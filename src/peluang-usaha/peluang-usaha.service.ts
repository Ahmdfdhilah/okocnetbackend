import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { PeluangUsaha } from 'src/entities/peluang-usaha.entity';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { CreatePeluangUsahaDto } from './dto/create-peluang-usaha.dto';
import { UpdatePeluangUsahaDto } from './dto/update-peluang-usaha.dto';
import * as fs from 'fs';
import * as path from 'path';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class PeluangUsahaService {
    constructor(
        @InjectRepository(PeluangUsaha)
        private readonly peluangUsahaRepository: Repository<PeluangUsaha>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(PeluangUsahaService.name);

    async create(createPeluangUsahaDto: CreatePeluangUsahaDto, userId: string, imgSrc: string): Promise<PeluangUsaha> {
        let newPeluangUsaha: PeluangUsaha;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataPeluangUsaha = { ...createPeluangUsahaDto, createdBy, updatedBy, fotoUsaha: imgSrc };
            newPeluangUsaha = await transactionalEntityManager.save(
                this.peluangUsahaRepository.create(dataPeluangUsaha),
            );
        });

        await this.clearPeluangUsahasCache();
        return newPeluangUsaha!;
    }

    async update(
        id: string,
        userId: string,
        updatePeluangUsahaDto: UpdatePeluangUsahaDto,
        imgSrc?: string,
    ): Promise<PeluangUsaha> {
        let updatedPeluangUsaha: PeluangUsaha;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const peluangUsaha = await transactionalEntityManager.findOne(PeluangUsaha, { where: { id } });
            if (!peluangUsaha) {
                throw new NotFoundException(`PeluangUsaha with id ${id} not found`);
            }
            const updatedBy = user;
            const dataPeluangUsaha = { ...updatePeluangUsahaDto, updatedBy };

            if (imgSrc) {
                if (peluangUsaha.fotoUsaha) {
                    const oldImagePath = path.join(__dirname, '../../public/upload/peluang-usahas', path.basename(peluangUsaha.fotoUsaha));
                    fs.unlinkSync(oldImagePath);
                }
                dataPeluangUsaha.fotoUsaha = imgSrc;
            }

            Object.assign(peluangUsaha, dataPeluangUsaha);
            updatedPeluangUsaha = await transactionalEntityManager.save(peluangUsaha);
        });

        await this.clearPeluangUsahasCache();
        return updatedPeluangUsaha!;
    }

    async findOne(id: string): Promise<PeluangUsaha | undefined> {
        return this.peluangUsahaRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: PeluangUsaha[], total: number }> {
        const { limit, search, sort, order } = query;
        const cacheKey = `peluang-usahas_${limit}_${search}_${sort}_${order}`;

        this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

        const cachedData = await redis.get<string | null>(cacheKey);
        if (cachedData) {
            this.logger.log(`Cache hit for key: ${cacheKey}`);
            const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
            return result;
        }

        this.logger.log(`Fetching from DB with limit: ${limit}`);

        const orderOption: { [key: string]: 'ASC' | 'DESC' } = {};
        if (sort && order) {
            orderOption[sort] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else if (order && !sort) {
            orderOption['createdAt'] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else {
            orderOption['createdAt'] = 'DESC';
        }

        const [peluangUsahas, total] = await this.peluangUsahaRepository.findAndCount({
            take: limit,
            where: search ? { judulUsaha: Like(`%${search}%`) } : {},
            order: orderOption,
            relations: ['createdBy', 'updatedBy'],
        });

        this.logger.log(`DB result - PeluangUsahas count: ${peluangUsahas.length}, Total count: ${total}`);

        const result = { data: peluangUsahas, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const peluangUsaha = await this.peluangUsahaRepository.findOne({ where: { id } });
        if (!peluangUsaha) {
            throw new NotFoundException(`PeluangUsaha with id ${id} not found`);
        }

        if (peluangUsaha.fotoUsaha) {
            const imagePath = path.join(__dirname, '../../public/upload/peluang-usahas', path.basename(peluangUsaha.fotoUsaha));
            fs.unlinkSync(imagePath);
        }

        await this.peluangUsahaRepository.delete(id);
        await this.clearPeluangUsahasCache();
    }

    private async clearPeluangUsahasCache() {
        const keys = await redis.keys('peluang-usahas_*');
        
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}