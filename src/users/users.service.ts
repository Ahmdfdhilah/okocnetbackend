import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { CreateUserDtoType } from './dto/create-user.dto';
import { UpdateUserDtoType } from './dto/update-user.dto';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly entityManager: EntityManager
  ) { }
  private readonly logger = new Logger(UsersService.name)

  async create(createUserDto: CreateUserDtoType): Promise<User> {
    const { password, ...userData } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);
    let newUser: User;

    await this.entityManager.transaction(async transactionalEntityManager => {
      newUser = await transactionalEntityManager.save(
        this.userRepository.create({
          ...userData,
          password: hashedPassword,
        }),
      );
    });

    return newUser!;
  }
  async update(id: string, updateUserDto: UpdateUserDtoType): Promise<User> {
    let updatedUser: User;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id } });
      if (!user) {
        throw new NotFoundException(`User with id ${id} not found`);
      }

      Object.assign(user, updateUserDto);

      if (updateUserDto.password) {
        const hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
        user.password = hashedPassword;
      }

      updatedUser = await transactionalEntityManager.save(user);
    });

    return updatedUser!;
  }

  async findOne(id: string): Promise<User | undefined> {
    return this.userRepository.findOne({ where: { id } });
  }

  async findAll(query: QueryDto): Promise<{ users: User[], total: number }> {
    const { page = 1, limit = 10, search, sort, order } = query;
    const cacheKey = `users:page:${page}:limit:${limit}`;

    this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

    const cachedData = await redis.get<string | null>(cacheKey);
    if (cachedData) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      return result;
    }

    const skip = (page - 1) * limit;
    this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);

    const [users, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      where: search ? { username: Like(`%${search}%`) } : {},
      order: sort && order ? { [sort]: order } : {},
    });

    this.logger.log(`DB result - Users count: ${users.length}, Total count: ${total}`);

    const result = { users, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

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

  async save(user: User): Promise<User> {
    return this.userRepository.save(user);
  }
}
