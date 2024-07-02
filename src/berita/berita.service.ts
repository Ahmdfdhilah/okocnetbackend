import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Berita } from '../entities/berita.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import { User } from 'src/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class BeritaService {
  constructor(
    @InjectRepository(Berita)
    private readonly beritaRepository: Repository<Berita>,
    private readonly entityManager: EntityManager,
  ) {}
  private readonly logger = new Logger(BeritaService.name);

  async create(createBeritaDto: Partial<Berita>, userId: string, imgSrc: string): Promise<Berita> {
    let newBerita: Berita;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const createdBy = user;
      const updatedBy = user;

      const dataBerita = { ...createBeritaDto, createdBy, updatedBy, fotoBerita: imgSrc };
      newBerita = await transactionalEntityManager.save(
        this.beritaRepository.create(dataBerita),
      );
    });

    await redis.del(`beritas`);
    return newBerita!;
  }

  async update(id: string, userId: string, updateBeritaDto: Partial<Berita>, imgSrc?: string): Promise<Berita> {
    let updatedBerita: Berita;

    await this.entityManager.transaction(async transactionalEntityManager => {
      const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
      if (!user) {
        throw new NotFoundException(`User with id ${userId} not found`);
      }
      const berita = await transactionalEntityManager.findOne(Berita, { where: { id } });
      if (!berita) {
        throw new NotFoundException(`Berita with id ${id} not found`);
      }
      const updatedBy = user;
      const dataBerita = { ...updateBeritaDto, updatedBy };

      if (imgSrc) {
        if (berita.fotoBerita) {
          const oldImagePath = path.join(__dirname, '../../public/upload/beritas', path.basename(berita.fotoBerita));
          fs.unlinkSync(oldImagePath);
        }
        dataBerita.fotoBerita = imgSrc;
      }

      Object.assign(berita, dataBerita);
      updatedBerita = await transactionalEntityManager.save(berita);
    });

    await redis.del(`beritas`);
    return updatedBerita!;
  }

  async findOne(id: string): Promise<Berita | undefined> {
    return this.beritaRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
  }

  async findAll(query: QueryDto): Promise<{ beritas: Berita[], total: number }> {
    const { page = 1, limit = 10, search, sort, order } = query;
    const cacheKey = `beritas`;

    this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

    const cachedData = await redis.get<string | null>(cacheKey);
    if (cachedData) {
      this.logger.log(`Cache hit for key: ${cacheKey}`);
      const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
      return result;
    }

    const skip = (page - 1) * limit;
    this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);

    const [beritas, total] = await this.beritaRepository.findAndCount({
      skip,
      take: limit,
      where: search ? { judulBerita: Like(`%${search}%`) } : {},
      order: sort && order ? { [sort]: order } : {},
      relations: ['createdBy', 'updatedBy'],
    });

    this.logger.log(`DB result - Beritas count: ${beritas.length}, Total count: ${total}`);

    const result = { beritas, total };
    await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

    return result;
  }

  async remove(id: string): Promise<void> {
    const berita = await this.beritaRepository.findOne({ where: { id } });
    if (!berita) {
      throw new NotFoundException(`Berita with id ${id} not found`);
    }
    if (berita.fotoBerita) {
      const imagePath = path.join(__dirname, '../../public/upload/beritas', path.basename(berita.fotoBerita));
      fs.unlinkSync(imagePath);
    }

    await this.beritaRepository.delete(id);
    await redis.del(`beritas`);
  }
}