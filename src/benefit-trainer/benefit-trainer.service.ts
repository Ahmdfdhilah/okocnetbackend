import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { BenefitTrainer } from 'src/entities/benefit-trainer.entity'; 
import { QueryDto } from 'src/lib/query.dto';
import { CreateBenefitTrainerDto } from './dto/create-benefit-trainer.dto';
import { UpdateBenefitTrainerDto } from './dto/update-benefit-trainer.dto';
import redis from 'src/lib/redis-client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BenefitTrainerService {
  private readonly logger = new Logger(BenefitTrainerService.name);

  constructor(
    @InjectRepository(BenefitTrainer)
    private readonly benefitTrainerRepository: Repository<BenefitTrainer>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createBenefitTrainerDto: CreateBenefitTrainerDto, imgSrc: string): Promise<BenefitTrainer> {
    let newBenefitTrainer: BenefitTrainer;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const dataBenefitTrainer = { ...createBenefitTrainerDto, img: imgSrc };
      newBenefitTrainer = await transactionalEntityManager.save(
        this.benefitTrainerRepository.create(dataBenefitTrainer),
      );
    });

    await this.clearAllBenefitTrainerCache();
    return newBenefitTrainer!;
  }

  async update(id: string, updateBenefitTrainerDto: UpdateBenefitTrainerDto, imgSrc?: string): Promise<BenefitTrainer> {
    let updatedBenefitTrainer: BenefitTrainer;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const benefitTrainer = await transactionalEntityManager.findOne(BenefitTrainer, { where: { id } });
      if (!benefitTrainer) {
        throw new NotFoundException(`BenefitTrainer with id ${id} not found`);
      }

      const dataBenefitTrainer: Partial<BenefitTrainer> = {
        judul: updateBenefitTrainerDto.judul || benefitTrainer.judul,
        deskripsi: updateBenefitTrainerDto.deskripsi || benefitTrainer.deskripsi,
        img: imgSrc || benefitTrainer.img,
      };

      if (imgSrc) {
        if (benefitTrainer.img) {
          const oldImagePath = path.join(__dirname, '../../public/upload/benefit-trainers', path.basename(benefitTrainer.img));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        dataBenefitTrainer.img = imgSrc;
      }

      Object.assign(benefitTrainer, dataBenefitTrainer);
      updatedBenefitTrainer = await transactionalEntityManager.save(benefitTrainer);
    });

    await this.clearAllBenefitTrainerCache();
    return updatedBenefitTrainer!;
  }

  async findOne(id: string): Promise<BenefitTrainer | undefined> {
    return this.benefitTrainerRepository.findOne({ where: { id } });
  }

  async findAll(query: QueryDto): Promise<{ data: BenefitTrainer[], total: number }> {
    let { limit, page, search, sort, order } = query;
    const cacheKey = `benefitTrainers_${limit}_${page}_${search}_${sort}_${order}`;
    this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

    const cachedData = await redis.get<string | null>(cacheKey);
    if (cachedData) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      return result;
    }

    this.logger.log(`Fetching from DB with limit: ${limit}, page: ${page}`);
    if (limit) {
      limit = parseInt(limit as any, 10);
    }
    if (page) {
      page = parseInt(page as any, 10);
    }
    let skip = 0;
    if (limit && page) {
      skip = (page - 1) * limit;
    }
    const orderOption: { [key: string]: 'ASC' | 'DESC' } = {};
    if (sort && order) {
      orderOption[sort] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    } else if (order && !sort) {
      orderOption['createdAt'] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    } else {
      orderOption['createdAt'] = 'DESC';
    }

    let benefitTrainers: BenefitTrainer[];
    let total: number;
    if (limit && page) {
      const [result, count] = await this.benefitTrainerRepository.findAndCount({
        take: limit,
        skip: skip,
        where: search ? { judul: Like(`%${search}%`) } : {},
        order: orderOption,
      });
      benefitTrainers = result;
      total = count;
    } else {
      const result = await this.benefitTrainerRepository.find({
        where: search ? { judul: Like(`%${search}%`) } : {},
        order: orderOption,
      });
      benefitTrainers = result;
      total = result.length;
    }

    this.logger.log(`DB result - BenefitTrainers count: ${benefitTrainers.length}, Total count: ${total}`);

    const result = { data: benefitTrainers, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

    return result;
  }

  async remove(id: string): Promise<void> {
    const benefitTrainer = await this.benefitTrainerRepository.findOne({ where: { id } });
    if (!benefitTrainer) {
      throw new NotFoundException(`BenefitTrainer with id ${id} not found`);
    }
    if (benefitTrainer.img) {
      const imagePath = path.join(__dirname, '../../public/upload/benefit-trainers', path.basename(benefitTrainer.img));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.benefitTrainerRepository.delete(id);
    await this.clearAllBenefitTrainerCache();
  }

  private async clearAllBenefitTrainerCache(): Promise<void> {
    const keys = await redis.keys('benefitTrainers_*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}