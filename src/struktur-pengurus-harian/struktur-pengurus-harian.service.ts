import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { CreateStrukturPengurusHarianDto } from './dto/create-struktur-pengurus-harian.dto';
import { UpdateStrukturPengurusHarianDto } from './dto/update-struktur-pengurus-harian.dto';
import * as fs from 'fs';
import * as path from 'path';
import { QueryDto } from 'src/lib/query.dto';
import { StrukturPengurusHarian } from 'src/entities/struktur-pengurus-harian.entity';

@Injectable()
export class StrukturPengurusHarianService {
    constructor(
        @InjectRepository(StrukturPengurusHarian)
        private readonly strukturPengurusHarianRepository: Repository<StrukturPengurusHarian>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(StrukturPengurusHarianService.name);

    async create(createStrukturPengurusHarianDto: CreateStrukturPengurusHarianDto, userId: string, imgSrc: string): Promise<StrukturPengurusHarian> {
        let newStrukturPengurusHarian: StrukturPengurusHarian;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataStrukturPengurusHarian = { ...createStrukturPengurusHarianDto, createdBy, updatedBy, fotoPengurus: imgSrc };
            newStrukturPengurusHarian = await transactionalEntityManager.save(
                this.strukturPengurusHarianRepository.create(dataStrukturPengurusHarian),
            );
        });

        await redis.del(`strukturpengurusharians`);
        return newStrukturPengurusHarian!;
    }

    async update(
        id: string,
        userId: string,
        updateStrukturPengurusHarianDto: UpdateStrukturPengurusHarianDto,
        imgSrc?: string,
    ): Promise<StrukturPengurusHarian> {
        let updatedStrukturPengurusHarian: StrukturPengurusHarian;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const strukturPengurusHarian = await transactionalEntityManager.findOne(StrukturPengurusHarian, { where: { id } });
            if (!strukturPengurusHarian) {
                throw new NotFoundException(`Struktur Pengurus Harian with id ${id} not found`);
            }
            const updatedBy = user;
            const dataStrukturPengurusHarian = { ...updateStrukturPengurusHarianDto, updatedBy };

            if (imgSrc) {
                if (strukturPengurusHarian.fotoPengurus) {
                    const oldImagePath = path.join(__dirname, '../../public/upload/struktur-pengurus-harians', path.basename(strukturPengurusHarian.fotoPengurus));
                    fs.unlinkSync(oldImagePath);
                }
                dataStrukturPengurusHarian.fotoPengurus = imgSrc;
            }

            Object.assign(strukturPengurusHarian, dataStrukturPengurusHarian);
            updatedStrukturPengurusHarian = await transactionalEntityManager.save(strukturPengurusHarian);
        });

        await redis.del(`strukturpengurusharians`);
        return updatedStrukturPengurusHarian!;
    }

    async findOne(id: string): Promise<StrukturPengurusHarian | undefined> {
        return this.strukturPengurusHarianRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: StrukturPengurusHarian[], total: number }> {
        const { page = 1, limit = 10, search, sort, order } = query;
        const cacheKey = `strukturpengurusharians`;

        this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

        const cachedData = await redis.get<string | null>(cacheKey);
        if (cachedData) {
            this.logger.log(`Cache hit for key: ${cacheKey}`);
            const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
            return result;
        }

        const skip = (page - 1) * limit;
        this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);

        const [strukturPengurusHarian, total] = await this.strukturPengurusHarianRepository.findAndCount({
            skip,
            take: limit,
            where: search ? { namaPengurus: Like(`%${search}%`) } : {},
            order: sort && order ? { [sort]: order } : {},
            relations: ['createdBy', 'updatedBy'],
        });

        this.logger.log(`DB result - Pengurus count: ${strukturPengurusHarian.length}, Total count: ${total}`);

        const result = { data : strukturPengurusHarian, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const strukturPengurusHarian = await this.strukturPengurusHarianRepository.findOne({ where: { id } });
        if (!strukturPengurusHarian) {
            throw new NotFoundException(`Struktur Pengurus Harian with id ${id} not found`);
        }

        if (strukturPengurusHarian.fotoPengurus) {
            const imagePath = path.join(__dirname, '../../public/upload/struktur-pengurus-harians', path.basename(strukturPengurusHarian.fotoPengurus));
            fs.unlinkSync(imagePath);
        }

        await this.strukturPengurusHarianRepository.delete(id);
        await redis.del(`strukturpengurusharians`);
    }
}
