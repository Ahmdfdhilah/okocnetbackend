import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Sosmed } from 'src/entities/sosmed.entity';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import { CreateSosmedDto } from './dto/create-sosmed.dto';
import { UpdateSosmedDto } from './dto/update-sosmed.dto';

@Injectable()
export class SosmedService {
    private readonly logger = new Logger(SosmedService.name);

    constructor(
        @InjectRepository(Sosmed)
        private readonly sosmedRepository: Repository<Sosmed>,
        @InjectEntityManager()
        private readonly entityManager: EntityManager,
    ) { }

    async create(createSosmedDto: CreateSosmedDto, userId: string, imgSrc: string): Promise<Sosmed> {
        let newSosmed: Sosmed;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;

            const dataSosmed = { ...createSosmedDto, foto:imgSrc, createdBy };
            newSosmed = await transactionalEntityManager.save(
                this.sosmedRepository.create(dataSosmed),
            );
        });

        await this.clearAllSosmedCache();
        return newSosmed!;
    }

    async update(id: string, userId: string, updateSosmedDto: UpdateSosmedDto, imgSrc: string): Promise<Sosmed> {
        let updatedSosmed: Sosmed;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const sosmed = await transactionalEntityManager.findOne(Sosmed, { where: { id } });
            if (!sosmed) {
                throw new NotFoundException(`Sosmed with id ${id} not found`);
            }

            const updatedData = {
                link: updateSosmedDto.link || sosmed.link,
                nama: updateSosmedDto.nama || sosmed.nama,
                foto: imgSrc || sosmed.foto,
                publishedAt: updateSosmedDto.publishedAt || sosmed.publishedAt,
                updatedBy: user,
            };

            Object.assign(sosmed, updatedData);
            updatedSosmed = await transactionalEntityManager.save(sosmed);
        });

        await this.clearAllSosmedCache();
        return updatedSosmed!;
    }

    async findOne(id: string): Promise<Sosmed | undefined> {
        return this.sosmedRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: Sosmed[], total: number }> {
        const { limit, page, search, sort, order } = query;
        const cacheKey = `sosmeds_${limit}_${page}_${search}_${sort}_${order}`;

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

        let sosmeds: Sosmed[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.sosmedRepository.findAndCount(findOptions);
            sosmeds = result;
            total = count;
        } else {
            const result = await this.sosmedRepository.find(findOptions);
            sosmeds = result;
            total = result.length;
        }

        this.logger.log(`DB result - Sosmeds count: ${sosmeds.length}, Total count: ${total}`);

        const result = { data: sosmeds, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const sosmed = await this.sosmedRepository.findOne({ where: { id } });
        if (!sosmed) {
            throw new NotFoundException(`Sosmed with id ${id} not found`);
        }

        await this.sosmedRepository.delete(id);
        await this.clearAllSosmedCache();
    }

    private async clearAllSosmedCache() {
        const keys = await redis.keys('sosmeds_*');

        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}
