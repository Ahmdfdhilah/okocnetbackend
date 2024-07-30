import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { CreateSyaratMasterMentorDto } from './dto/create-syarat-master-mentor.dto';
import { UpdateSyaratMasterMentorDto } from './dto/update-syarat-master-mentor.dto';
import redis from 'src/lib/redis-client';
import * as fs from 'fs';
import * as path from 'path';
import { SyaratMasterMentor } from 'src/entities/syarat-master-mentor.entity';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class SyaratMasterMentorService {
  private readonly logger = new Logger(SyaratMasterMentorService.name);

  constructor(
    @InjectRepository(SyaratMasterMentor)
    private readonly syaratMasterMentorRepository: Repository<SyaratMasterMentor>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createDto: CreateSyaratMasterMentorDto, imgSrc: string): Promise<SyaratMasterMentor> {
    let newSyaratMasterMentor: SyaratMasterMentor;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const data = { ...createDto, img: imgSrc };
      newSyaratMasterMentor = await transactionalEntityManager.save(
        this.syaratMasterMentorRepository.create(data),
      );
    });

    await this.clearAllSyaratMasterMentorCache();
    return newSyaratMasterMentor!;
  }

  async update(id: string, updateDto: UpdateSyaratMasterMentorDto, imgSrc?: string): Promise<SyaratMasterMentor> {
    let updatedSyaratMasterMentor: SyaratMasterMentor;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const syaratMasterMentor = await transactionalEntityManager.findOne(SyaratMasterMentor, { where: { id } });
      if (!syaratMasterMentor) {
        throw new NotFoundException(`SyaratMasterMentor with id ${id} not found`);
      }

      const data: Partial<SyaratMasterMentor> = {
        deskripsi: updateDto.deskripsi || syaratMasterMentor.deskripsi,
        img: imgSrc || syaratMasterMentor.img,
      };

      if (imgSrc) {
        if (syaratMasterMentor.img) {
          const oldImagePath = path.join(__dirname, '../../public/upload/syarat-master-mentors', path.basename(syaratMasterMentor.img));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        data.img = imgSrc;
      }

      Object.assign(syaratMasterMentor, data);
      updatedSyaratMasterMentor = await transactionalEntityManager.save(syaratMasterMentor);
    });

    await this.clearAllSyaratMasterMentorCache();
    return updatedSyaratMasterMentor!;
  }

  async findOne(id: string): Promise<SyaratMasterMentor | undefined> {
    return this.syaratMasterMentorRepository.findOne({ where: { id } });
  }

  async findAll(query: QueryDto): Promise<{ data: SyaratMasterMentor[], total: number }> {
    let { limit, page, search, sort, order } = query;
    const cacheKey = `syaratMasterMentors_${limit}_${page}_${search}_${sort}_${order}`;
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

    let syaratMasterMentors: SyaratMasterMentor[];
    let total: number;
    if (limit && page) {
      const [result, count] = await this.syaratMasterMentorRepository.findAndCount({
        take: limit,
        skip: skip,
        where: search ? { deskripsi: Like(`%${search}%`) } : {},
        order: orderOption,
      });
      syaratMasterMentors = result;
      total = count;
    } else {
      const result = await this.syaratMasterMentorRepository.find({
        where: search ? { deskripsi: Like(`%${search}%`) } : {},
        order: orderOption,
      });
      syaratMasterMentors = result;
      total = result.length;
    }

    this.logger.log(`DB result - SyaratMasterMentors count: ${syaratMasterMentors.length}, Total count: ${total}`);

    const result = { data: syaratMasterMentors, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

    return result;
  }

  async remove(id: string): Promise<void> {
    const syaratMasterMentor = await this.syaratMasterMentorRepository.findOne({ where: { id } });
    if (!syaratMasterMentor) {
      throw new NotFoundException(`SyaratMasterMentor with id ${id} not found`);
    }
    if (syaratMasterMentor.img) {
      const imagePath = path.join(__dirname, '../../public/upload/syarat-master-mentors', path.basename(syaratMasterMentor.img));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.syaratMasterMentorRepository.delete(id);
    await this.clearAllSyaratMasterMentorCache();
  }

  private async clearAllSyaratMasterMentorCache(): Promise<void> {
    const keys = await redis.keys('syaratMasterMentors_*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
