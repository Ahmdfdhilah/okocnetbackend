import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { Pengurus } from 'src/entities/pengurus.entity';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { CreatePengurusDto } from './dto/create-pengurus.dto';
import { UpdatePengurusDto } from './dto/update-pengurus.dto';
import * as fs from 'fs';
import * as path from 'path';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class PengurusService {
    constructor(
        @InjectRepository(Pengurus)
        private readonly pengurusRepository: Repository<Pengurus>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(PengurusService.name);

    async create(createPengurusDto: CreatePengurusDto, userId: string, imgSrc: string): Promise<Pengurus> {
        let newPengurus: Pengurus

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataPengurus = { ...createPengurusDto, createdBy, updatedBy, fotoFounder: imgSrc };
            newPengurus = await transactionalEntityManager.save(
                this.pengurusRepository.create(dataPengurus),
            );
        });

        await redis.del(`penguruses`);
        return newPengurus!;
    }

    async update(
        id: string,
        userId: string,
        updatePengurusDto: UpdatePengurusDto,
        imgSrc?: string,
    ): Promise<Pengurus> {
        let updatedPengurus: Pengurus;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const pengurus = await transactionalEntityManager.findOne(Pengurus, { where: { id } });
            if (!pengurus) {
                throw new NotFoundException(`Pengurus with id ${id} not found`);
            }
            const updatedBy = user;
            const dataPengurus = { ...updatePengurusDto, updatedBy };

            if (imgSrc) {
                if (pengurus.fotoFounder) {
                    const oldImagePath = path.join(__dirname, '../../public/upload/penguruses', path.basename(pengurus.fotoFounder));
                    fs.unlinkSync(oldImagePath);
                }
                dataPengurus.fotoFounder = imgSrc;
            }

            Object.assign(pengurus, dataPengurus);
            updatedPengurus = await transactionalEntityManager.save(pengurus);
        });

        await redis.del(`penguruses`);
        return updatedPengurus!;
    }

    async findOne(id: string): Promise<Pengurus | undefined> {
        return this.pengurusRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: Pengurus[], total: number }> {
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

        const [pengurus, total] = await this.pengurusRepository.findAndCount({
            skip,
            take: limit,
            where: search ? { namaFounder: Like(`%${search}%`) } : {},
            order: sort && order ? { [sort]: order } : {},
            relations: ['createdBy', 'updatedBy'],
        });

        this.logger.log(`DB result - Pengurus count: ${pengurus.length}, Total count: ${total}`);

        const result = { data: pengurus, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const pengurus = await this.pengurusRepository.findOne({ where: { id } });
        if (!pengurus) {
            throw new NotFoundException(`Pengurus with id ${id} not found`);
        }

        if (pengurus.fotoFounder) {
            const imagePath = path.join(__dirname, '../../public/upload/penguruses', path.basename(pengurus.fotoFounder));
            fs.unlinkSync(imagePath);
        }

        await this.pengurusRepository.delete(id);
        await redis.del(`penguruses`);
    }
}