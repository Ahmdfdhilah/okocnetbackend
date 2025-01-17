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

        await this.clearAllCache();
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
                throw new NotFoundException(`Penggerak Okoce with id ${id} not found`);
            }
            const updatedBy = user;

            const updatedData: Partial<PenggerakOkoce> = {
                namaPenggerak: updatePenggerakOkoceDto.namaPenggerak || penggerakOkoce.namaPenggerak,
                deskripsiPenggerak: updatePenggerakOkoceDto.deskripsiPenggerak || penggerakOkoce.deskripsiPenggerak,
                publishedAt: updatePenggerakOkoceDto.publishedAt || penggerakOkoce.publishedAt,
                updatedBy: updatedBy,
            };

            if (imgSrc) {
                if (penggerakOkoce.fotoPenggerak) {
                    const oldImagePath = path.join(__dirname, '../../public/upload/penggerak-okoces', path.basename(penggerakOkoce.fotoPenggerak));
                    if (fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                updatedData.fotoPenggerak = imgSrc;
            } else {
                updatedData.fotoPenggerak = penggerakOkoce.fotoPenggerak;
            }

            Object.assign(penggerakOkoce, updatedData);
            updatedPenggerakOkoce = await transactionalEntityManager.save(penggerakOkoce);
        });

        await this.clearAllCache();
        return updatedPenggerakOkoce!;
    }

    async findOne(id: string): Promise<PenggerakOkoce | undefined> {
        return this.penggerakOkoceRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: PenggerakOkoce[], total: number }> {
        const { limit, page, search, sort, order } = query;
        const cacheKey = `penggerak-okoces_${limit}_${page}_${search}_${sort}_${order}`;

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
            findOptions.where = { namaPenggerak: Like(`%${search}%`) };
        }

        let penggerakOkoces: PenggerakOkoce[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.penggerakOkoceRepository.findAndCount(findOptions);
            penggerakOkoces = result;
            total = count;
        } else {
            const result = await this.penggerakOkoceRepository.find(findOptions);
            penggerakOkoces = result;
            total = result.length;
        }

        this.logger.log(`DB result - PenggerakOkoces count: ${penggerakOkoces.length}, Total count: ${total}`);

        const result = { data: penggerakOkoces, total };
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
            if(fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await this.penggerakOkoceRepository.delete(id);
        await this.clearAllCache();
    }

    private async clearAllCache() {
        const keys = await redis.keys('penggerak-okoces_*');

        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}