import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { PenggerakOkoce } from 'src/entities/penggerak-okoce.entity';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { CreatePenggerakOkoceDto } from './dto/create-penggerak-okoce.dto';
import { UpdatePenggerakOkoceDto } from './dto/update-penggerak-okoce.dto';
import * as fs from 'fs';
import * as path from 'path';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class PenggerakOkoceService {
    constructor(
        @InjectRepository(PenggerakOkoce)
        private readonly penggerakOkoceRepository: Repository<PenggerakOkoce>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(PenggerakOkoceService.name);

    async create(createPenggerakOkoceDto: CreatePenggerakOkoceDto, userId: string, imgSrc: string): Promise<PenggerakOkoce> {
        let newPenggerakOkoce: PenggerakOkoce;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataPenggerakOkoce = { ...createPenggerakOkoceDto, createdBy, updatedBy, fotoPenggerak: imgSrc };
            newPenggerakOkoce = await transactionalEntityManager.save(
                this.penggerakOkoceRepository.create(dataPenggerakOkoce),
            );
        });

        await redis.del(`penggerak-okoces`);
        return newPenggerakOkoce!;
    }

    async update(
        id: string,
        userId: string,
        updatePenggerakOkoceDto: UpdatePenggerakOkoceDto,
        imgSrc?: string,
    ): Promise<PenggerakOkoce> {
        let updatedPenggerakOkoce: PenggerakOkoce;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const penggerakOkoce = await transactionalEntityManager.findOne(PenggerakOkoce, { where: { id } });
            if (!penggerakOkoce) {
                throw new NotFoundException(`PenggerakOkoce with id ${id} not found`);
            }
            const updatedBy = user;
            const dataPenggerakOkoce = { ...updatePenggerakOkoceDto, updatedBy };

            if (imgSrc) {
                if (penggerakOkoce.fotoPenggerak) {
                    const oldImagePath = path.join(__dirname, '../../public/upload/penggerak-okoces', path.basename(penggerakOkoce.fotoPenggerak));
                    fs.unlinkSync(oldImagePath);
                }
                dataPenggerakOkoce.fotoPenggerak = imgSrc;
            }

            Object.assign(penggerakOkoce, dataPenggerakOkoce);
            updatedPenggerakOkoce = await transactionalEntityManager.save(penggerakOkoce);
        });

        await redis.del(`penggerak-okoces`);
        return updatedPenggerakOkoce!;
    }

    async findOne(id: string): Promise<PenggerakOkoce | undefined> {
        return this.penggerakOkoceRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ penggerakOkoces: PenggerakOkoce[], total: number }> {
        const { page = 1, limit = 10, search, sort, order } = query;
        const cacheKey = `penggerak-okoces`;

        this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

        const cachedData = await redis.get<string | null>(cacheKey);
        if (cachedData) {
            this.logger.log(`Cache hit for key: ${cacheKey}`);
            const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
            return result;
        }

        const skip = (page - 1) * limit;
        this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);

        const [penggerakOkoces, total] = await this.penggerakOkoceRepository.findAndCount({
            skip,
            take: limit,
            where: search ? { namaPenggerak: Like(`%${search}%`) } : {},
            order: sort && order ? { [sort]: order } : {},
            relations: ['createdBy', 'updatedBy'],
        });

        this.logger.log(`DB result - PenggerakOkoces count: ${penggerakOkoces.length}, Total count: ${total}`);

        const result = { penggerakOkoces, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const penggerakOkoce = await this.penggerakOkoceRepository.findOne({ where: { id } });
        if (!penggerakOkoce) {
            throw new NotFoundException(`PenggerakOkoce with id ${id} not found`);
        }

        if (penggerakOkoce.fotoPenggerak) {
            const imagePath = path.join(__dirname, '../../public/upload/penggerak-okoces', path.basename(penggerakOkoce.fotoPenggerak));
            fs.unlinkSync(imagePath);
        }

        await this.penggerakOkoceRepository.delete(id);
        await redis.del(`penggerak-okoces`);
    }
}