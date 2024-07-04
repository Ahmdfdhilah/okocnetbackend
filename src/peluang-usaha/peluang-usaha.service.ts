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

        await redis.del(`peluang-usahas`);
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

        await redis.del(`peluang-usahas`);
        return updatedPeluangUsaha!;
    }

    async findOne(id: string): Promise<PeluangUsaha | undefined> {
        return this.peluangUsahaRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: PeluangUsaha[], total: number }> {
        const { page = 1, limit = 10, search, sort, order } = query;
        const cacheKey = `peluang-usahas`;

        this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

        const cachedData = await redis.get<string | null>(cacheKey);
        if (cachedData) {
            this.logger.log(`Cache hit for key: ${cacheKey}`);
            const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
            return result;
        }

        const skip = (page - 1) * limit;
        this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);

        const [peluangUsahas, total] = await this.peluangUsahaRepository.findAndCount({
            skip,
            take: limit,
            where: search ? { judulUsaha: Like(`%${search}%`) } : {},
            order: sort && order ? { [sort]: order } : {},
            relations: ['createdBy', 'updatedBy'],
        });

        this.logger.log(`DB result - PeluangUsahas count: ${peluangUsahas.length}, Total count: ${total}`);

        const result = { data:peluangUsahas, total };
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
        await redis.del(`peluang-usahas`);
    }
}
