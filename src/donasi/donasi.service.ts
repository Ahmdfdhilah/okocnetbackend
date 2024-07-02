import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Donasi } from 'src/entities/donasi.entity';
import { QueryDto } from 'src/lib/query.dto';
import { User } from 'src/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { CreateDonasiDto } from './dto/create-donasi.dto';
import { UpdateDonasiDto } from './dto/update-donasi.dto';
import redis from 'src/lib/redis-client';

@Injectable()
export class DonasiService {
  constructor(
    @InjectRepository(Donasi)
    private readonly donasiRepository: Repository<Donasi>,
    private readonly entityManager: EntityManager,
  ) {}
  private readonly logger = new Logger(DonasiService.name);

  async create(createDonasiDto: CreateDonasiDto, userId: string, imgSrc: string): Promise<Donasi> {
    let newDonasi: Donasi;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const createdBy = user;
      const updatedBy = user;

      const dataDonasi = { ...createDonasiDto, createdBy, updatedBy, fotoDonasi: imgSrc };
      newDonasi = await transactionalEntityManager.save(
        this.donasiRepository.create(dataDonasi),
      );
    });

    await redis.del(`donasis`);
    return newDonasi!;
  }

  async update(id: string, userId: string, updateDonasiDto: UpdateDonasiDto, imgSrc?: string): Promise<Donasi> {
    let updatedDonasi: Donasi;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const donasi = await transactionalEntityManager.findOne(Donasi, { where: { id } });
      if (!donasi) {
        throw new NotFoundException(`Donasi with id ${id} not found`);
      }
      const updatedBy = user;
      const dataDonasi = { ...updateDonasiDto, updatedBy };

      if (imgSrc) {
        if (donasi.fotoDonasi) {
          const oldImagePath = path.join(__dirname, '../../public/upload/donasis', path.basename(donasi.fotoDonasi));
          fs.unlinkSync(oldImagePath);
        }
        dataDonasi.fotoDonasi = imgSrc;
      }

      Object.assign(donasi, dataDonasi);
      updatedDonasi = await transactionalEntityManager.save(donasi);
    });

    await redis.del(`donasis`);
    return updatedDonasi!;
  }

  async findOne(id: string): Promise<Donasi | undefined> {
    return this.donasiRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
  }

  async findAll(query: QueryDto): Promise<{ donasis: Donasi[], total: number }> {
    const { page = 1, limit = 10, search, sort, order } = query;
    const cacheKey = `donasis`;

    this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

    const cachedData = await redis.get<string | null>(cacheKey);
    if (cachedData) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      return result;
    }

    const skip = (page - 1) * limit;
    this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);

    const [donasis, total] = await this.donasiRepository.findAndCount({
      skip,
      take: limit,
      where: search ? { judulDonasi: Like(`%${search}%`) } : {},
      order: sort && order ? { [sort]: order } : {},
      relations: ['createdBy', 'updatedBy'],
    });

    this.logger.log(`DB result - Donasis count: ${donasis.length}, Total count: ${total}`);

    const result = { donasis, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

    return result;
  }

  async remove(id: string): Promise<void> {
    const donasi = await this.donasiRepository.findOne({ where: { id } });
    if (!donasi) {
      throw new NotFoundException(`Donasi with id ${id} not found`);
    }
    if (donasi.fotoDonasi) {
      const imagePath = path.join(__dirname, '../../public/upload/donasis', path.basename(donasi.fotoDonasi));
      fs.unlinkSync(imagePath);
    }

    await this.donasiRepository.delete(id);
    await redis.del(`donasis`);
  }
}