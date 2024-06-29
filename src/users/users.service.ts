import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDtoType } from './dto/create-user.dto';
import { UpdateUserDtoType } from './dto/update-user.dto';
import redis from 'src/lib/redis-client';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  private readonly logger = new Logger(UsersService.name)
  
  async create(createUserDto: CreateUserDtoType): Promise<User> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });
    return this.userRepository.save(newUser);
  }

  async update(id: string, updateUserDto: UpdateUserDtoType): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    Object.assign(user, updateUserDto);

    if (updateUserDto.password) {
      const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      user.password = hashedPassword;
    }

    return this.userRepository.save(user);
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll(page: number = 1, limit: number = 10): Promise<{ users: User[], total: number }> {
    const cacheKey = `users:page:${page}:limit:${limit}`;
    const cachedData = await redis.get<string | null>(cacheKey);

    if (cachedData) {
      const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      return result;
    }

    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });

    const result = { users, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
    this.logger.log(`Added to cache with key: ${cacheKey}`);

    return result;
  }
  
  async remove(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByUsernameOrEmail(username: string, email: string): Promise<User> {
    return this.userRepository
      .createQueryBuilder('user')
      .where('user.username = :username OR user.email = :email', { username, email })
      .getOne();
  }

  async findByResetPasswordToken(token: string): Promise<User> {
    return this.userRepository.findOne({ where: { resetPasswordToken: token } });
  }

  async findByConfirmationToken(token: string): Promise<User> {
    return this.userRepository.findOne({ where: { confirmationToken: token } });
  }

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
