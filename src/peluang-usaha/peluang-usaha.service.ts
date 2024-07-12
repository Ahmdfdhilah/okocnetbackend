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

            const dataPeluangUsaha = {
                ...peluangUsaha,
                ...updatePeluangUsahaDto,
                updatedBy,
                fotoUsaha: imgSrc || peluangUsaha.fotoUsaha,
            };

            if (imgSrc && peluangUsaha.fotoUsaha) {
                const oldImagePath = path.join(__dirname, '../../public/upload/peluang-usahas', path.basename(peluangUsaha.fotoUsaha));
                fs.unlinkSync(oldImagePath);
            }

            updatedPeluangUsaha = await transactionalEntityManager.save(
                this.peluangUsahaRepository.create(dataPeluangUsaha),
            );
        });

        await this.clearPeluangUsahasCache();
        return updatedPeluangUsaha!;
    }

    async findOne(id: string): Promise<PeluangUsaha | undefined> {
        return this.peluangUsahaRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: PeluangUsaha[], total: number }> {
        let { limit, page, search, sort, order } = query;
        const cacheKey = `peluang-usahas_${limit}_${page}_${search}_${sort}_${order}`;

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
            findOptions.where = { judulUsaha: Like(`%${search}%`) };
        }

        let peluangUsahas: PeluangUsaha[];
        let total: number;

        if (limit && page) {
            const [result, count] = await this.peluangUsahaRepository.findAndCount(findOptions);
            peluangUsahas = result;
            total = count;
        } else {
            const result = await this.peluangUsahaRepository.find(findOptions);
            peluangUsahas = result;
            total = result.length;
        }

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