import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { CreateStrukturPengurusDirektoratDto } from './dto/create-struktur-pengurus-direktorat.dto';
import { UpdateStrukturPengurusDirektoratDto } from './dto/update-struktur-pengurus-direktorat.dto';
import * as fs from 'fs';
import * as path from 'path';
import { QueryDto } from 'src/lib/query.dto';
import { StrukturPengurusDirektorat } from 'src/entities/struktur-pengurus-direktorat.entity';

@Injectable()
export class StrukturPengurusDirektoratService {
    constructor(
        @InjectRepository(StrukturPengurusDirektorat)
        private readonly strukturPengurusDirektoratRepository: Repository<StrukturPengurusDirektorat>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(StrukturPengurusDirektoratService.name);

    async create(createStrukturPengurusDirektoratDto: CreateStrukturPengurusDirektoratDto, userId: string, imgSrc: string): Promise<StrukturPengurusDirektorat> {
        let newStrukturPengurusDirektorat: StrukturPengurusDirektorat

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataStrukturPengurusDirektorat = { ...createStrukturPengurusDirektoratDto, createdBy, updatedBy, fotoPengurus: imgSrc };
            newStrukturPengurusDirektorat = await transactionalEntityManager.save(
                this.strukturPengurusDirektoratRepository.create(dataStrukturPengurusDirektorat),
            );
        });

        await redis.del(`strukturpengurusdirektorats`);
        return newStrukturPengurusDirektorat!;
    }

    async update(
        id: string,
        userId: string,
        updateStrukturPengurusDirektoratDto: UpdateStrukturPengurusDirektoratDto,
        imgSrc?: string,
    ): Promise<StrukturPengurusDirektorat> {
        let updatedSturkturPengurusDirektorat: StrukturPengurusDirektorat;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const strukturPengurusDirektorat = await transactionalEntityManager.findOne(StrukturPengurusDirektorat, { where: { id } });
            if (!strukturPengurusDirektorat) {
                throw new NotFoundException(`Struktur Pengurus Direktorat with id ${id} not found`);
            }
            const updatedBy = user;
            const dataStrukturPengurusDirektorat = { ...updateStrukturPengurusDirektoratDto, updatedBy };

            if (imgSrc) {
                if (strukturPengurusDirektorat.fotoPengurus) {
                    const oldImagePath = path.join(__dirname, '../../public/upload/strukturpengurusdirektorats', path.basename(strukturPengurusDirektorat.fotoPengurus));
                    fs.unlinkSync(oldImagePath);
                }
                dataStrukturPengurusDirektorat.fotoPengurus = imgSrc;
            }

            Object.assign(strukturPengurusDirektorat, dataStrukturPengurusDirektorat);
            updatedSturkturPengurusDirektorat = await transactionalEntityManager.save(strukturPengurusDirektorat);
        });

        await redis.del(`strukturpengurusdirektorats`);
        return updatedSturkturPengurusDirektorat!;
    }

    async findOne(id: string): Promise<StrukturPengurusDirektorat | undefined> {
        return this.strukturPengurusDirektoratRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ strukturPengurusDirektorat: StrukturPengurusDirektorat[], total: number }> {
        const { page = 1, limit = 10, search, sort, order } = query;
        const cacheKey = `penguruses`;

        this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

        const cachedData = await redis.get<string | null>(cacheKey);
        if (cachedData) {
            this.logger.log(`Cache hit for key: ${cacheKey}`);
            const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
            return result;
        }

        const skip = (page - 1) * limit;
        this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);

        const [strukturPengurusDirektorat, total] = await this.strukturPengurusDirektoratRepository.findAndCount({
            skip,
            take: limit,
            where: search ? { namaPengurus: Like(`%${search}%`) } : {},
            order: sort && order ? { [sort]: order } : {},
            relations: ['createdBy', 'updatedBy'],
        });

        this.logger.log(`DB result - Pengurus count: ${strukturPengurusDirektorat.length}, Total count: ${total}`);

        const result = { strukturPengurusDirektorat: strukturPengurusDirektorat, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const strukturPengurusDirektorat = await this.strukturPengurusDirektoratRepository.findOne({ where: { id } });
        if (!strukturPengurusDirektorat) {
            throw new NotFoundException(`Struktur Pengurus Direktorat with id ${id} not found`);
        }

        if (strukturPengurusDirektorat.fotoPengurus) {
            const imagePath = path.join(__dirname, '../../public/upload/struktur-pengurus-direktorat', path.basename(strukturPengurusDirektorat.fotoPengurus));
            fs.unlinkSync(imagePath);
        }

        await this.strukturPengurusDirektoratRepository.delete(id);
        await redis.del(`strukturpengurusdirektorats`);
    }
}