import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Berita } from '../entities/berita.entity';
import { Teks } from '../entities/teks.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import { User } from 'src/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { CreateBeritaDto } from './dto/create-berita.dto';
import { UpdateBeritaDto } from './dto/update-berita.dto';

@Injectable()
export class BeritaService {
  constructor(
    @InjectRepository(Berita)
    private readonly beritaRepository: Repository<Berita>,
    @InjectRepository(Teks)
    private readonly teksRepository: Repository<Teks>,
    private readonly entityManager: EntityManager,
  ) { }
  private readonly logger = new Logger(BeritaService.name);

  async create(createBeritaDto: CreateBeritaDto, userId: string, fotoBerita: string, fotoContent: string): Promise<Berita> {
    let newBerita: Berita;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const createdBy = user;
      const updatedBy = user;

      const teksEntities = createBeritaDto.deskripsiBerita.map((str, index) => {
        const teks = new Teks();
        teks.str = str;
        teks.order = index;
        return teks;
      });

      const dataBerita = {
        ...createBeritaDto,
        deskripsiBerita: teksEntities,
        createdBy,
        updatedBy,
        fotoBerita,
        fotoContent
      };

      newBerita = await transactionalEntityManager.save(
        this.beritaRepository.create(dataBerita),
      );
    });

    await this.clearAllBeritaCache();
    return newBerita!;
  }

  async update(id: string, userId: string, updateBeritaDto: UpdateBeritaDto, fotoBerita?: string, fotoContent?: string): Promise<Berita> {
    let updatedBerita: Berita;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const berita = await transactionalEntityManager.findOne(Berita, { where: { id }, relations: ['deskripsiBerita'] });
      if (!berita) {
        throw new NotFoundException(`Berita with id ${id} not found`);
      }
      const updatedBy = user;
      const dataBerita = { ...updateBeritaDto, updatedBy };

      if (fotoBerita) {
        if (berita.fotoBerita) {
          const oldImagePath = path.join(__dirname, '../../public/upload/beritas', path.basename(berita.fotoBerita));
          fs.unlinkSync(oldImagePath);
        }
        dataBerita.fotoBerita = fotoBerita;
      }

      if (fotoContent) {
        if (berita.fotoContent) {
          const oldImagePath = path.join(__dirname, '../../public/upload/beritas', path.basename(berita.fotoContent));
          fs.unlinkSync(oldImagePath);
        }
        dataBerita.fotoContent = fotoContent;
      }
      let dataBeritaWithDeskripsi = {...dataBerita, deskripsiBerita: null}
      if (updateBeritaDto.deskripsiBerita) {
        const teksEntities = updateBeritaDto.deskripsiBerita.map((str, index) => {
          const teks = new Teks();
          teks.str = str;
          teks.order = index;
          return teks;
        });
        dataBeritaWithDeskripsi.deskripsiBerita = teksEntities
      }
      
      Object.assign(berita, dataBeritaWithDeskripsi);
      updatedBerita = await transactionalEntityManager.save(berita);
    });

    await this.clearAllBeritaCache();
    return updatedBerita!;
  }

  async findOne(id: string): Promise<Berita | undefined> {
    const berita = await this.beritaRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy', 'deskripsiBerita'] });
    if (berita) {
      berita.deskripsiBerita.sort((a, b) => a.order - b.order); 
    }
    return berita;
  }

  async findAll(query: QueryDto): Promise<{ data: Berita[], total: number }> {
    const { limit, search, sort, order } = query;
    const cacheKey = `beritas_${limit}_${search}_${sort}_${order}`; 
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

    const [beritas, total] = await this.beritaRepository.findAndCount({
      take: limit,
      where: search ? { judulBerita: Like(`%${search}%`) } : {},
      order: orderOption,
      relations: ['createdBy', 'updatedBy', 'deskripsiBerita'],
    });

    this.logger.log(`DB result - Beritas count: ${beritas.length}, Total count: ${total}`);

    beritas.forEach(berita => {
      berita.deskripsiBerita.sort((a, b) => a.order - b.order);
    });

    const result = { data: beritas, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

    return result;
  }

  async remove(id: string): Promise<void> {
    const berita = await this.beritaRepository.findOne({ where: { id }, relations: ['deskripsiBerita'] });
    if (!berita) {
      throw new NotFoundException(`Berita with id ${id} not found`);
    }
    if (berita.fotoBerita) {
      const imagePath = path.join(__dirname, '../../public/upload/beritas', path.basename(berita.fotoBerita));
      fs.unlinkSync(imagePath);
    }

    await this.beritaRepository.delete(id);
    await this.clearAllBeritaCache();
  }

  private async clearAllBeritaCache(): Promise<void> {
    const keys = await redis.keys('beritas_*');
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
