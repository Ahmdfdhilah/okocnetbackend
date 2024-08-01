import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { AllBanner } from '../entities/all-banner.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import * as fs from 'fs';
import * as path from 'path';
import { CreateAllBannerDto } from './dto/create-all-banners.dto'; 
import { UpdateAllBannerDto } from './dto/update-all-banners.dto'; 

@Injectable()
export class AllBannerService {
    private readonly logger = new Logger(AllBannerService.name);

    constructor(
        @InjectRepository(AllBanner)
        private readonly allBannerRepository: Repository<AllBanner>,
        private readonly entityManager: EntityManager,
    ) { }

    async create(createAllBannerDto: CreateAllBannerDto, fotoFiles?: string[]): Promise<AllBanner> {
        let newAllBanner: AllBanner;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const dataAllBanner = {
                ...createAllBannerDto,
                foto: fotoFiles || [],
            };

            newAllBanner = await transactionalEntityManager.save(
                this.allBannerRepository.create(dataAllBanner),
            );
        });

        await this.clearAllAllBannerCache();
        return newAllBanner!;
    }

    async update(id: string, updateAllBannerDto: UpdateAllBannerDto, fotoFiles?: string[]): Promise<AllBanner> {
        let updatedAllBanner: AllBanner;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const allBanner = await transactionalEntityManager.findOne(AllBanner, { where: { id } });
            if (!allBanner) {
                throw new NotFoundException(`AllBanner with id ${id} not found`);
            }

            const existingFoto = allBanner.foto || [];
            const newFoto = fotoFiles ? [...existingFoto, ...fotoFiles] : existingFoto;

            const dataAllBanner = { ...updateAllBannerDto, foto: newFoto };

            Object.assign(allBanner, dataAllBanner);
            updatedAllBanner = await transactionalEntityManager.save(allBanner);
        });

        await this.clearAllAllBannerCache();
        return updatedAllBanner!;
    }

    async deleteFoto(allBannerId: string, fotoUrl: string): Promise<void> {
        const allBanner = await this.allBannerRepository.findOne({ where: { id: allBannerId } });
        if (!allBanner) {
            throw new NotFoundException(`AllBanner with id ${allBannerId} not found`);
        }

        allBanner.foto = allBanner.foto.filter(foto => foto !== fotoUrl);

        const filePath = path.join(__dirname, '../../public/upload/all-banners', path.basename(fotoUrl));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await this.allBannerRepository.save(allBanner);
        await this.clearAllAllBannerCache();
    }

    async findOne(id: string): Promise<AllBanner | undefined> {
        return this.allBannerRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: AllBanner[], total: number }> {
        let { limit, page, search, sort, order } = query;
        const cacheKey = `all-banners_${limit}_${page}_${search}_${sort}_${order}`;
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

        let allBanners: AllBanner[];
        let total: number;
        if (limit && page) {
            const [result, count] = await this.allBannerRepository.findAndCount({
                take: limit,
                skip: skip,
                where: search ? { nama: Like(`%${search}%`) } : {},
                order: orderOption,
            });
            allBanners = result;
            total = count;
        } else {
            const result = await this.allBannerRepository.find({
                where: search ? { nama: Like(`%${search}%`) } : {},
                order: orderOption,
            });
            allBanners = result;
            total = result.length;
        }

        this.logger.log(`DB result - AllBanners count: ${allBanners.length}, Total count: ${total}`);

        const result = { data: allBanners, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const allBanner = await this.allBannerRepository.findOne({ where: { id } });
        if (!allBanner) {
            throw new NotFoundException(`AllBanner with id ${id} not found`);
        }
        if (allBanner.foto && allBanner.foto.length > 0) {
            for (const file of allBanner.foto) {
                const filePath = path.join(__dirname, '../../public/upload/all-banners', path.basename(file));
                if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); }
            }
        }

        await this.allBannerRepository.delete(id);
        await this.clearAllAllBannerCache();
    }

    private async clearAllAllBannerCache(): Promise<void> {
        const keys = await redis.keys('all-banners_*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}
