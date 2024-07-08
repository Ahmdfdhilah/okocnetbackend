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

  async create(createMerchandiseDto: CreateMerchandiseDto, userId: string, imgSrcs: string[]): Promise<Merchandise> {
    let newMerchandise: Merchandise;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const createdBy = user;
      const updatedBy = user;

      const dataMerchandise = { ...createMerchandiseDto, createdBy, updatedBy, fotoMerchandise: imgSrcs };
      newMerchandise = await transactionalEntityManager.save(
        this.merchandiseRepository.create(dataMerchandise),
      );
    });

    await this.clearMerchandisesCache();
    return newMerchandise!;
  }

  async update(id: string, updateMerchandiseDto: UpdateMerchandiseDto, userId: string, imgSrcs?: string[]): Promise<Merchandise> {
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
      const updatedData : Partial<Merchandise> = {
        judulMerchandise: updateMerchandiseDto.judulMerchandise || merchandise.judulMerchandise,
        deskripsiMerchandise: updateMerchandiseDto.deskripsiMerchandise || merchandise.deskripsiMerchandise,
        hargaMerchandise: updateMerchandiseDto.hargaMerchandise || merchandise.hargaMerchandise,
        stockMerchandise: updateMerchandiseDto.stockMerchandise || merchandise.stockMerchandise,
        linkMerchandise: updateMerchandiseDto.linkMerchandise || merchandise.linkMerchandise,
        fotoMerchandise: updateMerchandiseDto.fotoMerchandise || merchandise.fotoMerchandise,
        publishedAt: updateMerchandiseDto.publishedAt || merchandise.publishedAt,
        updatedBy,
      };
      if (imgSrcs) {
        if (merchandise.fotoMerchandise) {
          for (const oldImage of merchandise.fotoMerchandise) {
            const oldImagePath = path.join(__dirname, '../../public/upload/merchandises', path.basename(oldImage));
            fs.unlinkSync(oldImagePath);
          }
        }
        updatedData.fotoMerchandise = imgSrcs;
      }
      Object.assign(merchandise, updatedData);
      updatedMerchandise = await transactionalEntityManager.save(merchandise);
    });

    await this.clearMerchandisesCache();
    return updatedMerchandise!;
  }

  async findOne(id: string): Promise<Merchandise | undefined> {
    return this.merchandiseRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
  }

  async findAll(query: QueryDto): Promise<{ data: Merchandise[], total: number }> {
    const { limit, search, sort, order } = query;
    const cacheKey = `merchandises_${limit}_${search}_${sort}_${order}`;

    this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

    const cachedData = await redis.get<string | null>(cacheKey);
    if (cachedData) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      return result;
    }

    this.logger.log(`Fetching from DB with limit: ${limit}`);

    const orderOption: { [key: string]: 'ASC' | 'DESC' } = {};
    if (sort && order) {
      orderOption[sort] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    } else if (order && !sort) {
      orderOption['createdAt'] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    } else {
      orderOption['createdAt'] = 'DESC';
    }

    const [merchandises, total] = await this.merchandiseRepository.findAndCount({
      take: limit,
      where: search ? { judulMerchandise: Like(`%${search}%`) } : {},
      order: orderOption,
      relations: ['createdBy', 'updatedBy'],
    });

    this.logger.log(`DB result - Merchandises count: ${merchandises.length}, Total count: ${total}`);

    const result = { data: merchandises, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

    return result;
  }

  async remove(id: string): Promise<void> {
    const merchandise = await this.merchandiseRepository.findOne({ where: { id } });
    if (!merchandise) {
      throw new NotFoundException(`Merchandise with id ${id} not found`);
    }

    if (merchandise.fotoMerchandise) {
      for (const image of merchandise.fotoMerchandise) {
        const imagePath = path.join(__dirname, '../../public/upload/merchandises', path.basename(image));
        fs.unlinkSync(imagePath);
      }
    }

    await this.merchandiseRepository.delete(id);
    await this.clearMerchandisesCache();
  }

  private async clearMerchandisesCache() {
    const keys = await redis.keys('merchandises_*');
        
    if (keys.length > 0) {
        await redis.del(...keys);
    }
  }
}
