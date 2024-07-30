import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { EmakKece } from 'src/entities/emak-kece.entity';
import { CreateEmakKeceDto } from './dto/create-emak-kece.dto';
import { UpdateEmakKeceDto } from './dto/update-emak-kece.dto';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import fs from 'fs';
import path from 'path';

@Injectable()
export class EmakKeceService {
    constructor(
        @InjectRepository(EmakKece)
        private readonly emakKeceRepository: Repository<EmakKece>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(EmakKeceService.name);

    async create(createEmakKeceDto: CreateEmakKeceDto, imgSrc: string): Promise<EmakKece> {
        let newEmakKece: EmakKece;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const dataEmakKece = { ...createEmakKeceDto, foto: imgSrc };
            newEmakKece = await transactionalEntityManager.save(
                this.emakKeceRepository.create(dataEmakKece),
            );
        });

        await this.clearAllEmakKeceCache();
        return newEmakKece!;
    }

    async update(
        id: string,
        updateEmakKeceDto: UpdateEmakKeceDto,
        imgSrc?: string,
    ): Promise<EmakKece> {
        let updatedEmakKece: EmakKece;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const emakKece = await transactionalEntityManager.findOne(EmakKece, { where: { id } });
            if (!emakKece) {
                throw new NotFoundException(`EmakKece with id ${id} not found`);
            }

            if (imgSrc && emakKece.foto) {
                const oldImagePath = path.join(__dirname, '../../public/upload/emak-keces', path.basename(emakKece.foto));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            const updatedData = {
                ...updateEmakKeceDto,
                foto: imgSrc || emakKece.foto,
            };

            Object.assign(emakKece, updatedData);
            updatedEmakKece = await transactionalEntityManager.save(emakKece);
        });

        await this.clearAllEmakKeceCache();
        return updatedEmakKece!;
    }

    async findOne(id: string): Promise<EmakKece | undefined> {
        return this.emakKeceRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: EmakKece[], total: number }> {
        const { limit, page, search, sort, order } = query;
        const cacheKey = `emakKeces_${limit}_${page}_${search}_${sort}_${order}`;

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
        };

        if (limit && page) {
            findOptions.take = parseInt(limit as any, 10);
            findOptions.skip = (parseInt(page as any, 10) - 1) * findOptions.take;
        }

        if (search) {
            findOptions.where = { nama: Like(`%${search}%`) };
        }

        let emakKeces: EmakKece[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.emakKeceRepository.findAndCount(findOptions);
            emakKeces = result;
            total = count;
        } else {
            const result = await this.emakKeceRepository.find(findOptions);
            emakKeces = result;
            total = result.length;
        }

        this.logger.log(`DB result - EmakKeces count: ${emakKeces.length}, Total count: ${total}`);

        const result = { data: emakKeces, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const emakKece = await this.emakKeceRepository.findOne({ where: { id } });
        if (!emakKece) {
            throw new NotFoundException(`EmakKece with id ${id} not found`);
        }

        const imagePath = path.join(__dirname, '../../public/upload/emak-keces', path.basename(emakKece.foto));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await this.emakKeceRepository.delete(id);
        await this.clearAllEmakKeceCache();
    }

    private async clearAllEmakKeceCache() {
        const keys = await redis.keys('emakKeces_*');

        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}