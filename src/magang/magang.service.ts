import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Magang } from '../entities/magang.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import { User } from 'src/entities/user.entity';
import { CreateMagangDto } from './dto/create-magang.dto';
import { UpdateMagangDto } from './dto/update-magang.dto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MagangService {
  constructor(
    @InjectRepository(Magang)
    private readonly magangRepository: Repository<Magang>,
    private readonly entityManager: EntityManager,
  ) {}
  private readonly logger = new Logger(MagangService.name);

  async create(createMagangDto: CreateMagangDto, userId: string, imgSrc: string): Promise<Magang> {
    let newMagang: Magang;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const createdBy = user;
      const updatedBy = user;

      const dataMagang = { ...createMagangDto, createdBy, updatedBy, fotoMagang: imgSrc };
      newMagang = await transactionalEntityManager.save(
        this.magangRepository.create(dataMagang),
      );
    });

    await this.clearAllMagangsCache(); // hapus semua cache yang relevan
    return newMagang!;
  }

  async update(id: string, userId: string, updateMagangDto: UpdateMagangDto, imgSrc?: string): Promise<Magang> {
    let updatedMagang: Magang;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const magang = await transactionalEntityManager.findOne(Magang, { where: { id } });
      if (!magang) {
        throw new NotFoundException(`Magang with id ${id} not found`);
      }
      const updatedBy = user;
      const updatedData: Partial<Magang> = {
        judulMagang: updateMagangDto.judulMagang || magang.judulMagang,
        lokasiMagang: updateMagangDto.lokasiMagang || magang.lokasiMagang,
        durasiMagang: updateMagangDto.durasiMagang || magang.durasiMagang,
        jenisMagang: updateMagangDto.jenisMagang || magang.jenisMagang,
        fotoMagang: updateMagangDto.fotoMagang || magang.fotoMagang,
        tentangProgram: updateMagangDto.tentangProgram || magang.tentangProgram,
        benefitMagang: updateMagangDto.benefitMagang || magang.benefitMagang,
        kriteriaPeserta: updateMagangDto.kriteriaPeserta || magang.kriteriaPeserta,
        urlMsib: updateMagangDto.urlMsib || magang.urlMsib,
        kompetensi: updateMagangDto.kompetensi || magang.kompetensi,
        publishedAt: updateMagangDto.publishedAt || magang.publishedAt,
        updatedBy,
      };

      if (imgSrc) {
        if (magang.fotoMagang) {
          const oldImagePath = path.join(__dirname, '../../public/upload/magangs', path.basename(magang.fotoMagang));
          fs.unlinkSync(oldImagePath);
        }
        updatedData.fotoMagang = imgSrc;
      }

      Object.assign(magang, updatedData);
      updatedMagang = await transactionalEntityManager.save(magang);
    });

    await this.clearAllMagangsCache();
    return updatedMagang!;
  }

  async findOne(id: string): Promise<Magang | undefined> {
    return this.magangRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
  }

  async findAll(query: QueryDto): Promise<{ data: Magang[], total: number }> {
    const { limit, search, sort, order } = query;
    const cacheKey = `magangs_${limit}_${search}_${sort}_${order}`;

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
    }
    else {
      orderOption['createdAt'] = 'DESC';
    }

    const [magangs, total] = await this.magangRepository.findAndCount({
      take: limit,
      where: search ? { judulMagang: Like(`%${search}%`) } : {},
      order: orderOption,
      relations: ['createdBy', 'updatedBy'],
    });

    this.logger.log(`DB result - Magangs count: ${magangs.length}, Total count: ${total}`);

    const result = { data:magangs, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

    return result;
  }

  async remove(id: string): Promise<void> {
    const magang = await this.magangRepository.findOne({ where: { id } });
    if (!magang) {
      throw new NotFoundException(`Magang with id ${id} not found`);
    }

    if (magang.fotoMagang) {
      const imagePath = path.join(__dirname, '../../public/upload/magangs', path.basename(magang.fotoMagang));
      fs.unlinkSync(imagePath);
    }

    await this.magangRepository.delete(id);
    await this.clearAllMagangsCache(); 
  }

  private async clearAllMagangsCache(): Promise<void> {
    const keys = await redis.keys('magangs_*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}