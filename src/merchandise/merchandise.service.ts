import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { Merchandise } from 'src/entities/merchandise.entity';
import { User } from 'src/entities/user.entity';
import { CreateMerchandiseDto } from './dto/create-merchandise.dto';
import { UpdateMerchandiseDto } from './dto/update-merchandise.dto';
import * as path from 'path';
import * as fs from 'fs';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class MerchandiseService {
  constructor(
    @InjectRepository(Merchandise)
    private readonly merchandiseRepository: Repository<Merchandise>,
    private readonly entityManager: EntityManager,
  ) {}

  private readonly logger = new Logger(MerchandiseService.name);

  async create(createMerchandiseDto: CreateMerchandiseDto, userId: string, imgSrc: string): Promise<Merchandise> {
    let newMerchandise: Merchandise;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const createdBy = user;
      const updatedBy = user;

      const dataMerchandise = { ...createMerchandiseDto, createdBy, updatedBy, fotoMerchandise: imgSrc };
      newMerchandise = await transactionalEntityManager.save(
        this.merchandiseRepository.create(dataMerchandise),
      );
    });

    await redis.del(`merchandises`);
    return newMerchandise!;
  }

  async update(id: string, updateMerchandiseDto: UpdateMerchandiseDto, userId: string, imgSrc?: string): Promise<Merchandise> {
    let updatedMerchandise: Merchandise;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const merchandise = await transactionalEntityManager.findOne(Merchandise, { where: { id } });
      if (!merchandise) {
        throw new NotFoundException(`Merchandise with id ${id} not found`);
      }
      const updatedBy = user;
      const dataMerchandise = { ...updateMerchandiseDto, updatedBy };

      if (imgSrc) {
        if (merchandise.fotoMerchandise) {
          const oldImagePath = path.join(__dirname, '../../public/upload/merchandises', path.basename(merchandise.fotoMerchandise));
          fs.unlinkSync(oldImagePath);
        }
        dataMerchandise.fotoMerchandise = imgSrc;
      }
      Object.assign(merchandise, dataMerchandise);
      updatedMerchandise = await transactionalEntityManager.save(merchandise);
    });

    await redis.del(`merchandises`); 
    return updatedMerchandise!;
  }

  async findOne(id: string): Promise<Merchandise | undefined> {
    return this.merchandiseRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
  }

  async findAll(query: QueryDto): Promise<{ merchandises: Merchandise[], total: number }> {
    const { page = 1, limit = 10, search, sort, order } = query;
    const cacheKey = `merchandises`;

    this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

    const cachedData = await redis.get<string | null>(cacheKey);
    if (cachedData) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      return result;
    }

    const skip = (page - 1) * limit;
    this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);

    const [merchandises, total] = await this.merchandiseRepository.findAndCount({
      skip,
      take: limit,
      where: search ? { judulMerchandise: Like(`%${search}%`) } : {},
      order: sort && order ? { [sort]: order } : {},
      relations: ['createdBy', 'updatedBy'],
    });

    this.logger.log(`DB result - Merchandises count: ${merchandises.length}, Total count: ${total}`);

    const result = { merchandises, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

    return result;
  }
  async remove(id: string): Promise<void> {
    const merchandise = await this.merchandiseRepository.findOne({ where: { id } });
    if (!merchandise) {
      throw new NotFoundException(`Merchandise with id ${id} not found`);
    }

    if (merchandise.fotoMerchandise) {
      const imagePath = path.join(__dirname, '../../public/upload/merchandises', path.basename(merchandise.fotoMerchandise));
      fs.unlinkSync(imagePath);
    }

    await this.merchandiseRepository.delete(id);
    await redis.del(`merchandises`); 
  }
}
