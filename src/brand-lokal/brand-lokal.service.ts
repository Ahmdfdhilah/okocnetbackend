import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { BrandLokal } from 'src/entities/brand-lokal.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import { User } from 'src/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { CreateBrandLokalDto } from './dto/create-brand-lokal.dto';
import { UpdateBrandLokalDto } from './dto/update-brand-lokal.dto';

@Injectable()
export class BrandLokalService {
  constructor(
    @InjectRepository(BrandLokal)
    private readonly brandLokalRepository: Repository<BrandLokal>,
    private readonly entityManager: EntityManager,
  ) {}
  private readonly logger = new Logger(BrandLokalService.name);

  async create(createBrandLokalDto: CreateBrandLokalDto, userId: string, imgSrc: string): Promise<BrandLokal> {
    let newBrandLokal: BrandLokal;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const createdBy = user;
      const updatedBy = user;

      const dataBrandLokal = { ...createBrandLokalDto, createdBy, updatedBy, fotoBrand: imgSrc };
      newBrandLokal = await transactionalEntityManager.save(
        this.brandLokalRepository.create(dataBrandLokal),
      );
    });

    await redis.del(`brandLokals`);
    return newBrandLokal!;
  }

  async update(id: string, userId: string, updateBrandLokalDto: UpdateBrandLokalDto, imgSrc?: string): Promise<BrandLokal> {
    let updatedBrandLokal: BrandLokal;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const brandLokal = await transactionalEntityManager.findOne(BrandLokal, { where: { id } });
      if (!brandLokal) {
        throw new NotFoundException(`BrandLokal with id ${id} not found`);
      }
      const updatedBy = user;
      const dataBrandLokal = { ...updateBrandLokalDto, updatedBy };

      if (imgSrc) {
        if (brandLokal.fotoBrand) {
          const oldImagePath = path.join(__dirname, '../../public/upload/brand-lokals', path.basename(brandLokal.fotoBrand));
          fs.unlinkSync(oldImagePath);
        }
        dataBrandLokal.fotoBrand = imgSrc;
      }

      Object.assign(brandLokal, dataBrandLokal);
      updatedBrandLokal = await transactionalEntityManager.save(brandLokal);
    });

    await redis.del(`brandLokals`);
    return updatedBrandLokal!;
  }

  async findOne(id: string): Promise<BrandLokal | undefined> {
    return this.brandLokalRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
  }

  async findAll(query: QueryDto): Promise<{ data: BrandLokal[], total: number }> {
    const { page = 1, limit = 10, search, sort, order } = query;
    const cacheKey = `brandLokals`;

    this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

    const cachedData = await redis.get<string | null>(cacheKey);
    if (cachedData) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      return result;
    }

    const skip = (page - 1) * limit;
    this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);

    const [brandLokals, total] = await this.brandLokalRepository.findAndCount({
      skip,
      take: limit,
      where: search ? { judulBrand: Like(`%${search}%`) } : {},
      order: sort && order ? { [sort]: order } : {},
      relations: ['createdBy', 'updatedBy'],
    });

    this.logger.log(`DB result - BrandLokals count: ${brandLokals.length}, Total count: ${total}`);

    const result = { data: brandLokals, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

    return result;
  }

  async remove(id: string): Promise<void> {
    const brandLokal = await this.brandLokalRepository.findOne({ where: { id } });
    if (!brandLokal) {
      throw new NotFoundException(`BrandLokal with id ${id} not found`);
    }
    if (brandLokal.fotoBrand) {
      const imagePath = path.join(__dirname, '../../public/upload/brand-lokals', path.basename(brandLokal.fotoBrand));
      fs.unlinkSync(imagePath);
    }

    await this.brandLokalRepository.delete(id);
    await redis.del(`brandLokals`);
  }
}