import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Anniversary } from 'src/entities/anniversary.entity';
import { QueryDto } from 'src/lib/query.dto';
import redis from 'src/lib/redis-client';
import { CreateAnniversaryDto } from './dto/create-anniversary.dto';
import { UpdateAnniversaryDto } from './dto/update-anniversary.dto';

@Injectable()
export class AnniversaryService {
    constructor(
        @InjectRepository(Anniversary)
        private readonly anniversaryRepository: Repository<Anniversary>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(AnniversaryService.name);

    async create(createAnniversaryDto: CreateAnniversaryDto): Promise<Anniversary> {
        let newAnniversary: Anniversary;
        console.log(createAnniversaryDto);

        await this.entityManager.transaction(async transactionalEntityManager => {
            const dataAnniversary = { ...createAnniversaryDto };
            newAnniversary = await transactionalEntityManager.save(
                this.anniversaryRepository.create(dataAnniversary),
            );
        });

        await this.clearAllAnniversaryCache();
        return newAnniversary!;
    }

    async update(id: string, updateAnniversaryDto: UpdateAnniversaryDto): Promise<Anniversary> {
        let updatedAnniversary: Anniversary;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const anniversary = await transactionalEntityManager.findOne(Anniversary, { where: { id } });
            if (!anniversary) {
                throw new NotFoundException(`Anniversary with id ${id} not found`);
            }
            const dataAnniversary: Partial<Anniversary> = {
                judul: updateAnniversaryDto.judul || anniversary.judul,
                deskripsi: updateAnniversaryDto.deskripsi || anniversary.deskripsi,
                videoLink: updateAnniversaryDto.videoLink || anniversary.videoLink,
            };

            Object.assign(anniversary, dataAnniversary);
            updatedAnniversary = await transactionalEntityManager.save(anniversary);
        });

        await this.clearAllAnniversaryCache();
        return updatedAnniversary!;
    }

    async findOne(id: string): Promise<Anniversary | undefined> {
        return this.anniversaryRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: Anniversary[], total: number }> {
        let { limit, page, search, sort, order } = query;
        const cacheKey = `anniversaries_${limit}_${page}_${search}_${sort}_${order}`;
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

        let anniversaries: Anniversary[];
        let total: number;
        if (limit && page) {
            const [result, count] = await this.anniversaryRepository.findAndCount({
                take: limit,
                skip: skip,
                where: search ? { judul: Like(`%${search}%`) } : {},
                order: orderOption,
            });
            anniversaries = result;
            total = count;
        } else {
            const result = await this.anniversaryRepository.find({
                where: search ? { judul: Like(`%${search}%`) } : {},
                order: orderOption,
            });
            anniversaries = result;
            total = result.length;
        }

        this.logger.log(`DB result - Anniversaries count: ${anniversaries.length}, Total count: ${total}`);

        const result = { data: anniversaries, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const anniversary = await this.anniversaryRepository.findOne({ where: { id } });
        if (!anniversary) {
            throw new NotFoundException(`Anniversary with id ${id} not found`);
        }

        await this.anniversaryRepository.delete(id);
        await this.clearAllAnniversaryCache();
    }

    private async clearAllAnniversaryCache(): Promise<void> {
        const keys = await redis.keys('anniversaries_*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}
