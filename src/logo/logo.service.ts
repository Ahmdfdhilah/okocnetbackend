import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { Logo } from 'src/entities/logo.entity';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import fs from 'fs';
import path from 'path';

@Injectable()
export class LogoService {
    constructor(
        @InjectRepository(Logo)
        private readonly logoRepository: Repository<Logo>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(LogoService.name);

    async create(createLogoDto: CreateLogoDto, imgSrc: string): Promise<Logo> {
        let newLogo: Logo;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const dataLogo = { ...createLogoDto, foto: imgSrc };
            newLogo = await transactionalEntityManager.save(
                this.logoRepository.create(dataLogo),
            );
        });

        await this.clearAllLogoCache();
        return newLogo!;
    }

    async update(
        id: string,
        updateLogoDto: UpdateLogoDto,
        imgSrc?: string,
    ): Promise<Logo> {
        let updatedLogo: Logo;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const logo = await transactionalEntityManager.findOne(Logo, { where: { id } });
            if (!logo) {
                throw new NotFoundException(`Logo with id ${id} not found`);
            }

            if (imgSrc) {
                const oldImagePath = path.join(__dirname, '../../public/upload/logos', path.basename(logo.foto));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            const updatedData = {
                ...updateLogoDto,
                foto: imgSrc || logo.foto,
            };

            Object.assign(logo, updatedData);
            updatedLogo = await transactionalEntityManager.save(logo);
        });

        await this.clearAllLogoCache();
        return updatedLogo!;
    }

    async findOne(id: string): Promise<Logo | undefined> {
        return this.logoRepository.findOne({ where: { id } });
    }

    async findAll(query: QueryDto): Promise<{ data: Logo[], total: number }> {
        const { limit, page, search, sort, order } = query;
        const cacheKey = `logos_${limit}_${page}_${search}_${sort}_${order}`;

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

        let logos: Logo[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.logoRepository.findAndCount(findOptions);
            logos = result;
            total = count;
        } else {
            const result = await this.logoRepository.find(findOptions);
            logos = result;
            total = result.length;
        }

        this.logger.log(`DB result - Logos count: ${logos.length}, Total count: ${total}`);

        const result = { data: logos, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const logo = await this.logoRepository.findOne({ where: { id } });
        if (!logo) {
            throw new NotFoundException(`Logo with id ${id} not found`);
        }

        const imagePath = path.join(__dirname, '../../public/upload/logos', path.basename(logo.foto));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await this.logoRepository.delete(id);
        await this.clearAllLogoCache();
    }

    private async clearAllLogoCache() {
        const keys = await redis.keys('logos_*');

        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}
