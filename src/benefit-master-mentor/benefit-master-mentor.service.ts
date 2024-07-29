import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { BenefitMasterMentor } from 'src/entities/benefit-master-mentor.entity';
import { QueryDto } from 'src/lib/query.dto';
import { CreateBemefitMasterMentorDto } from './dto/create-benefit-master-mentor.dto';
import { UpdateBenefitMasterMentorDto } from './dto/update-benefit-master-mentor.dto';
import redis from 'src/lib/redis-client';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BenefitMasterMentorService {
  private readonly logger = new Logger(BenefitMasterMentorService.name);

  constructor(
    @InjectRepository(BenefitMasterMentor)
    private readonly benefitMasterMentorRepository: Repository<BenefitMasterMentor>,
    private readonly entityManager: EntityManager,
  ) {}

  async create(createMasterMentorDto: CreateBemefitMasterMentorDto, imgSrc: string): Promise<BenefitMasterMentor> {
    let newMasterMentor: BenefitMasterMentor;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const dataMasterMentor = { ...createMasterMentorDto, img: imgSrc };
      newMasterMentor = await transactionalEntityManager.save(
        this.benefitMasterMentorRepository.create(dataMasterMentor),
      );
    });

    await this.clearAllMasterMentorCache();
    return newMasterMentor!;
  }

  async update(id: string, updateMasterMentorDto: UpdateBenefitMasterMentorDto, imgSrc?: string): Promise<BenefitMasterMentor> {
    let updatedMasterMentor: BenefitMasterMentor;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const masterMentor = await transactionalEntityManager.findOne(BenefitMasterMentor, { where: { id } });
      if (!masterMentor) {
        throw new NotFoundException(`MasterMentor with id ${id} not found`);
      }

      const dataMasterMentor: Partial<BenefitMasterMentor> = {
        judul: updateMasterMentorDto.judul || masterMentor.judul,
        deskripsi: updateMasterMentorDto.deskripsi || masterMentor.deskripsi,
        img: imgSrc || masterMentor.img,
      };

      if (imgSrc) {
        if (masterMentor.img) {
          const oldImagePath = path.join(__dirname, '../../public/upload/master-mentors', path.basename(masterMentor.img));
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        dataMasterMentor.img = imgSrc;
      }

      Object.assign(masterMentor, dataMasterMentor);
      updatedMasterMentor = await transactionalEntityManager.save(masterMentor);
    });

    await this.clearAllMasterMentorCache();
    return updatedMasterMentor!;
  }

  async findOne(id: string): Promise<BenefitMasterMentor | undefined> {
    return this.benefitMasterMentorRepository.findOne({ where: { id } });
  }

  async findAll(query: QueryDto): Promise<{ data: BenefitMasterMentor[], total: number }> {
    let { limit, page, search, sort, order } = query;
    const cacheKey = `masterMentors_${limit}_${page}_${search}_${sort}_${order}`;
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

    let masterMentors: BenefitMasterMentor[];
    let total: number;
    if (limit && page) {
      const [result, count] = await this.benefitMasterMentorRepository.findAndCount({
        take: limit,
        skip: skip,
        where: search ? { judul: Like(`%${search}%`) } : {},
        order: orderOption,
      });
      masterMentors = result;
      total = count;
    } else {
      const result = await this.benefitMasterMentorRepository.find({
        where: search ? { judul: Like(`%${search}%`) } : {},
        order: orderOption,
      });
      masterMentors = result;
      total = result.length;
    }

    this.logger.log(`DB result - MasterMentors count: ${masterMentors.length}, Total count: ${total}`);

    const result = { data: masterMentors, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

    return result;
  }

  async remove(id: string): Promise<void> {
    const masterMentor = await this.benefitMasterMentorRepository.findOne({ where: { id } });
    if (!masterMentor) {
      throw new NotFoundException(`MasterMentor with id ${id} not found`);
    }
    if (masterMentor.img) {
      const imagePath = path.join(__dirname, '../../public/upload/master-mentors', path.basename(masterMentor.img));
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await this.benefitMasterMentorRepository.delete(id);
    await this.clearAllMasterMentorCache();
  }

  private async clearAllMasterMentorCache(): Promise<void> {
    const keys = await redis.keys('masterMentors_*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}