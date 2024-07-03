import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { CreateStrukturPengurusEksekutifDto } from './dto/create-struktur-eksekutif.dto';
import { UpdateStrukturPengurusEksekutifDto } from './dto/update-struktur-eksekutif.dto';
import * as fs from 'fs';
import * as path from 'path';
import { QueryDto } from 'src/lib/query.dto';
import { StrukturPengurusEksekutif } from 'src/entities/struktur-pengurus-eksekutif.entity';


@Injectable()
export class StrukturPengurusEksekutifService {
    constructor(
        @InjectRepository(StrukturPengurusEksekutif)
        private readonly strukturPengurusEksekutifRepository: Repository<StrukturPengurusEksekutif>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(StrukturPengurusEksekutifService.name);

    async create(createStrukturPengurusEksekutifDto: CreateStrukturPengurusEksekutifDto, userId: string, imgSrc: string): Promise<StrukturPengurusEksekutif> {
        let newStrukturPengurusEksekutif: StrukturPengurusEksekutif

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataStrukturPengurusEksekutif = { ...createStrukturPengurusEksekutifDto, createdBy, updatedBy, fotoPengurus: imgSrc };
            newStrukturPengurusEksekutif = await transactionalEntityManager.save(
                this.strukturPengurusEksekutifRepository.create(dataStrukturPengurusEksekutif),
            );
        });

        await redis.del(`strukturpenguruseksekutifs`);
        return newStrukturPengurusEksekutif!;
    }

    async update(
        id: string,
        userId: string,
        updateStrukturPengurusEksekutifDto: UpdateStrukturPengurusEksekutifDto,
        imgSrc?: string,
    ): Promise<StrukturPengurusEksekutif> {
        let updatedSturkturPengurusEksekutif: StrukturPengurusEksekutif;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const strukturPengurusEksekutif = await transactionalEntityManager.findOne(StrukturPengurusEksekutif, { where: { id } });
            if (!strukturPengurusEksekutif) {
                throw new NotFoundException(`Struktur Pengurus Eksekutif with id ${id} not found`);
            }
            const updatedBy = user;
            const dataStrukturPengurusEksekutif = { ...updateStrukturPengurusEksekutifDto, updatedBy };

            if (imgSrc) {
                if (strukturPengurusEksekutif.fotoPengurus) {
                    const oldImagePath = path.join(__dirname, '../../public/upload/struktur-pengurus-eksekutifs', path.basename(strukturPengurusEksekutif.fotoPengurus));
                    fs.unlinkSync(oldImagePath);
                }
                dataStrukturPengurusEksekutif.fotoPengurus = imgSrc;
            }

            Object.assign(strukturPengurusEksekutif, dataStrukturPengurusEksekutif);
            updatedSturkturPengurusEksekutif = await transactionalEntityManager.save(strukturPengurusEksekutif);
        });

        await redis.del(`strukturpenguruseksekutifs`);
        return updatedSturkturPengurusEksekutif!;
    }

    async findOne(id: string): Promise<StrukturPengurusEksekutif | undefined> {
        return this.strukturPengurusEksekutifRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ strukturPengurusEksekutif: StrukturPengurusEksekutif[], total: number }> {
        const { page = 1, limit = 10, search, sort, order } = query;
        const cacheKey = `struktutpenguruseksekutifs`;

        this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

        const cachedData = await redis.get<string | null>(cacheKey);
        if (cachedData) {
            this.logger.log(`Cache hit for key: ${cacheKey}`);
            const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
            return result;
        }

        const skip = (page - 1) * limit;
        this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);

        const [strukturPengurusDirektorat, total] = await this.strukturPengurusEksekutifRepository.findAndCount({
            skip,
            take: limit,
            where: search ? { namaPengurus: Like(`%${search}%`) } : {},
            order: sort && order ? { [sort]: order } : {},
            relations: ['createdBy', 'updatedBy'],
        });

        this.logger.log(`DB result - Pengurus count: ${strukturPengurusDirektorat.length}, Total count: ${total}`);

        const result = { strukturPengurusEksekutif: strukturPengurusDirektorat, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const strukturPengurusEksekutif = await this.strukturPengurusEksekutifRepository.findOne({ where: { id } });
        if (!strukturPengurusEksekutif) {
            throw new NotFoundException(`Struktur Pengurus Eksekutif with id ${id} not found`);
        }

        if (strukturPengurusEksekutif.fotoPengurus) {
            const imagePath = path.join(__dirname, '../../public/upload/struktur-pengurus-eksekutifs', path.basename(strukturPengurusEksekutif.fotoPengurus));
            fs.unlinkSync(imagePath);
        }

        await this.strukturPengurusEksekutifRepository.delete(id);
        await redis.del(`strukturpenguruseksekutifs`);
    }
}