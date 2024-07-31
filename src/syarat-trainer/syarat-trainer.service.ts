import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { SyaratTrainer } from 'src/entities/syarat-trainer.entity';
import { CreateSyaratTrainerDto } from './dto/create-syarat-trainer.dto';
import { UpdateSyaratTrainerDto } from './dto/update-syarat-trainer.dto';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class SyaratTrainerService {
    constructor(
        @InjectRepository(SyaratTrainer)
        private readonly syaratTrainerRepository: Repository<SyaratTrainer>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(SyaratTrainerService.name);

    async create(createSyaratTrainerDto: CreateSyaratTrainerDto): Promise<SyaratTrainer> {
        let newSyaratTrainer: SyaratTrainer;

        await this.entityManager.transaction(async transactionalEntityManager => {
            newSyaratTrainer = await transactionalEntityManager.save(
                this.syaratTrainerRepository.create(createSyaratTrainerDto),
            );
        });

        await this.clearAllSyaratTrainerCache();
        return newSyaratTrainer!;
    }

    async update(id: string, updateSyaratTrainerDto: UpdateSyaratTrainerDto): Promise<SyaratTrainer> {
        let updatedSyaratTrainer: SyaratTrainer;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const syaratTrainer = await transactionalEntityManager.findOne(SyaratTrainer, { where: { id } });
            if (!syaratTrainer) {
                throw new NotFoundException(`SyaratTrainer with id ${id} not found`);
            }
            const dataSyaratTrainer: Partial<SyaratTrainer> = {
                judul: updateSyaratTrainerDto.judul || syaratTrainer.judul,
                deskripsi: updateSyaratTrainerDto.deskripsi || syaratTrainer.deskripsi,
            };

            Object.assign(syaratTrainer, dataSyaratTrainer);
            updatedSyaratTrainer = await transactionalEntityManager.save(syaratTrainer);
        });

        await this.clearAllSyaratTrainerCache();
        return updatedSyaratTrainer!;
    }

    async findOne(id: string): Promise<SyaratTrainer | undefined> {
        return this.syaratTrainerRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: SyaratTrainer[], total: number }> {
        let { limit, page, search, sort, order } = query;
        const cacheKey = `syarat_trainer_${limit}_${page}_${search}_${sort}_${order}`;
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

        let syaratTrainers: SyaratTrainer[];
        let total: number;
        if (limit && page) {
            const [result, count] = await this.syaratTrainerRepository.findAndCount({
                take: limit,
                skip: skip,
                where: search ? { judul: Like(`%${search}%`) } : {},
                order: orderOption,
            });
            syaratTrainers = result;
            total = count;
        } else {
            const result = await this.syaratTrainerRepository.find({
                where: search ? { judul: Like(`%${search}%`) } : {},
                order: orderOption,
            });
            syaratTrainers = result;
            total = result.length;
        }

        this.logger.log(`DB result - SyaratTrainers count: ${syaratTrainers.length}, Total count: ${total}`);

        const result = { data: syaratTrainers, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const syaratTrainer = await this.syaratTrainerRepository.findOne({ where: { id } });
        if (!syaratTrainer) {
            throw new NotFoundException(`SyaratTrainer with id ${id} not found`);
        }

        await this.syaratTrainerRepository.delete(id);
        await this.clearAllSyaratTrainerCache();
    }

    private async clearAllSyaratTrainerCache(): Promise<void> {
        const keys = await redis.keys('syarat_trainer_*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}