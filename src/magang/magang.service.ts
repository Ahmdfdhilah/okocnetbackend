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
import { Teks } from 'src/entities/teks.entity';

@Injectable()
export class MagangService {
  constructor(
    @InjectRepository(Magang)
    private readonly magangRepository: Repository<Magang>,
    private readonly entityManager: EntityManager,
  ) { }
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

      const teksDeskripsiEntities = createMagangDto.deskripsiMagang.map((str, index) => {
        const teks = new Teks();
        teks.str = str;
        teks.order = index;
        return teks;
      });
      const teksKriteriaEntities = createMagangDto.kriteriaPeserta.map((str, index) => {
        const teks = new Teks();
        teks.str = str;
        teks.order = index; 
        return teks;
      });
      const teksKompetensiEntities = createMagangDto.kompetensi.map((str, index) => {
        const teks = new Teks();
        teks.str = str;
        teks.order = index; 
        return teks;
      });

      const dataMagang = { ...createMagangDto, createdBy, updatedBy, fotoMagang: imgSrc, deskripsiMagang: teksDeskripsiEntities, kriteriaPeserta: teksKriteriaEntities, kompetensi: teksKompetensiEntities };
      newMagang = await transactionalEntityManager.save(
        this.magangRepository.create(dataMagang),
      );
    });

    await this.clearAllMagangsCache();
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
      let teksDeskripsiEntities;
      let teksKompetensiEntities;
      let teksKriteriaEntities;

      if (updateMagangDto.deskripsiMagang) {
        teksDeskripsiEntities = updateMagangDto.deskripsiMagang.map((str, index) => {
          const teks = new Teks();
          teks.str = str;
          teks.order = index;
          return teks;
        });
      }
      if (updateMagangDto.kompetensi) {
        teksKompetensiEntities = updateMagangDto.kompetensi.map((str, index)  => {
          const teks = new Teks();
          teks.str = str;
          teks.order = index;
          return teks;
        });
      }
      if (updateMagangDto.kriteriaPeserta) {

        teksKriteriaEntities = updateMagangDto.kriteriaPeserta.map((str, index)  => {
          const teks = new Teks();
          teks.str = str;
          teks.order = index;
          return teks;
        });
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
        urlMsib: updateMagangDto.urlMsib || magang.urlMsib,
        publishedAt: updateMagangDto.publishedAt || magang.publishedAt,
        deskripsiMagang: teksDeskripsiEntities || magang.deskripsiMagang,
        kriteriaPeserta: teksKriteriaEntities || magang.kriteriaPeserta,
        kompetensi: teksKompetensiEntities || magang.kompetensi,
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
    const magang = await this.magangRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy', 'kriteriaPeserta', 'kompetensi', 'deskripsiMagang'] });
  
    if (magang) {
      magang.deskripsiMagang.sort((a, b) => a.order - b.order);
      magang.kriteriaPeserta.sort((a, b) => a.order - b.order);
      magang.kompetensi.sort((a, b) => a.order - b.order);
    }
    return magang;
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
      relations: ['createdBy', 'updatedBy', 'kriteriaPeserta', 'kompetensi', 'deskripsiMagang'],
    });

    this.logger.log(`DB result - Magangs count: ${magangs.length}, Total count: ${total}`);

    magangs.forEach(magang => {
      magang.deskripsiMagang.sort((a, b) => a.order - b.order);
      magang.kriteriaPeserta.sort((a, b) => a.order - b.order);
      magang.kompetensi.sort((a, b) => a.order - b.order);
    });
  
    const result = { data: magangs, total };
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