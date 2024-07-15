import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Total } from 'src/entities/total.entity';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import { CreateTotalDto } from './dto/create-total.dto';
import { UpdateTotalDto } from './dto/update-total.dto';

@Injectable()
export class TotalService {
    private readonly logger = new Logger(TotalService.name);

    constructor(
        @InjectRepository(Total)
        private readonly totalRepository: Repository<Total>,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) {}

    async create(createTotalDto: CreateTotalDto, userId: string): Promise<Total> {
        let newTotal: Total;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataTotal = { ...createTotalDto, createdBy, updatedBy };
            newTotal = await transactionalEntityManager.save(
                this.totalRepository.create(dataTotal),
            );
        });

        await this.clearAllTotalCache();
        return newTotal!;
    }

    async update(id: string, userId: string, updateTotalDto: UpdateTotalDto): Promise<Total> {
        let updatedTotal: Total;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const total = await transactionalEntityManager.findOne(Total, { where: { id } });
            if (!total) {
                throw new NotFoundException(`Total with id ${id} not found`);
            }
            const updatedBy = user;

            const updatedData = {
                total: updateTotalDto.total || total.total,
                nama: updateTotalDto.nama || total.nama,
                publishedAt: updateTotalDto.publishedAt || total.publishedAt,
                updatedBy: updatedBy,
            };

            Object.assign(total, updatedData);
            updatedTotal = await transactionalEntityManager.save(total);
        });

        await this.clearAllTotalCache();
        return updatedTotal!;
    }

    async findOne(id: string): Promise<Total | undefined> {
        return this.totalRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: Total[], total: number }> {
        const { limit, page, search, sort, order } = query;
        const cacheKey = `totals_${limit}_${page}_${search}_${sort}_${order}`;
    
        this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);
    
        const cachedData = await redis.get<string | null>(cacheKey);
        if (cachedData) {
            this.logger.log(`Cache hit for key: ${cacheKey}`);
            const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
            return result;
        }
    
        this.logger.log(`Fetching from DB`);
    
        const orderOption: { [key: string]: 'ASC' | 'DESC' } = {};
        if (sort && order) {
            orderOption[sort] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else if (order && !sort) {
            orderOption['createdAt'] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else {
            orderOption['createdAt'] = 'DESC';
        }
    
        const findOptions: any = {
            order: orderOption,
            relations: ['createdBy', 'updatedBy'],
        };
    
        if (limit && page) {
            findOptions.take = parseInt(limit as any, 10);
            findOptions.skip = (parseInt(page as any, 10) - 1) * findOptions.take;
        }
    
        if (search) {
            findOptions.where = { nama: Like(`%${search}%`) };
        }
    
        let totals: Total[];
        let total: number;
    
        if (limit && page) {
            const [result, count] = await this.totalRepository.findAndCount(findOptions);
            totals = result;
            total = count;
        } else {
            const result = await this.totalRepository.find(findOptions);
            totals = result;
            total = result.length;
        }
    
        this.logger.log(`DB result - Totals count: ${totals.length}, Total count: ${total}`);
    
        const result = { data: totals, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
    
        return result;
    }
        
    async remove(id: string): Promise<void> {
        const total = await this.totalRepository.findOne({ where: { id } });
        if (!total) {
            throw new NotFoundException(`Total with id ${id} not found`);
        }

        await this.totalRepository.delete(id);
        await this.clearAllTotalCache();
    }

    private async clearAllTotalCache() {
        const keys = await redis.keys('totals_*');

        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}