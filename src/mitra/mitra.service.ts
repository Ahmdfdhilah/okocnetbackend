import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Mitra } from 'src/entities/mitra.entity';
import { CreateMitraDto } from './dto/create-mitra.dto';
import { UpdateMitraDto } from './dto/update-mitra.dto';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import fs from 'fs';
import path from 'path';

@Injectable()
export class MitraService {
    constructor(
        @InjectRepository(Mitra)
        private readonly mitraRepository: Repository<Mitra>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(MitraService.name);

    async create(createMitraDto: CreateMitraDto, userId: string, imgSrc: string): Promise<Mitra> {
        let newMitra: Mitra;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataMitra = { ...createMitraDto, createdBy, updatedBy, foto: imgSrc };
            newMitra = await transactionalEntityManager.save(
                this.mitraRepository.create(dataMitra),
            );
        });

        await this.clearAllMitraCache();
        return newMitra!;
    }

    async update(
        id: string,
        userId: string,
        updateMitraDto: UpdateMitraDto,
        imgSrc?: string,
    ): Promise<Mitra> {
        let updatedMitra: Mitra;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const mitra = await transactionalEntityManager.findOne(Mitra, { where: { id } });
            if (!mitra) {
                throw new NotFoundException(`Mitra with id ${id} not found`);
            }
            const updatedBy = user;

            if (imgSrc) {
                const oldImagePath = path.join(__dirname, '../../public/upload/mitras', path.basename(mitra.foto));
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }

            const updatedData = {
                ...updateMitraDto,
                updatedBy: updatedBy,
                foto: imgSrc || mitra.foto,
            };

            Object.assign(mitra, updatedData);
            updatedMitra = await transactionalEntityManager.save(mitra);
        });

        await this.clearAllMitraCache();
        return updatedMitra!;
    }

    async findOne(id: string): Promise<Mitra | undefined> {
        return this.mitraRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: Mitra[], total: number }> {
        const { limit, page, search, sort, order } = query;
        const cacheKey = `mitras_${limit}_${page}_${search}_${sort}_${order}`;

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

        let mitras: Mitra[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.mitraRepository.findAndCount(findOptions);
            mitras = result;
            total = count;
        } else {
            const result = await this.mitraRepository.find(findOptions);
            mitras = result;
            total = result.length;
        }

        this.logger.log(`DB result - Mitras count: ${mitras.length}, Total count: ${total}`);

        const result = { data: mitras, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const mitra = await this.mitraRepository.findOne({ where: { id } });
        if (!mitra) {
            throw new NotFoundException(`Mitra with id ${id} not found`);
        }

        const imagePath = path.join(__dirname, '../../public/upload/mitras', path.basename(mitra.foto));
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        await this.mitraRepository.delete(id);
        await this.clearAllMitraCache();
    }

    private async clearAllMitraCache() {
        const keys = await redis.keys('mitras_*');

        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}
