import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { CreateStrukturPengurusKurasiDto } from './dto/create-struktur-kurasi.dto';
import { UpdateStrukturPengurusKurasiDto } from './dto/update-struktur-kurasi.dto';
import * as fs from 'fs';
import * as path from 'path';
import { QueryDto } from 'src/lib/query.dto';
import { StrukturPengurusKurasi } from 'src/entities/struktur-pengurus-kurasi.entity';

@Injectable()
export class StrukturPengurusKurasiService {
    constructor(
        @InjectRepository(StrukturPengurusKurasi)
        private readonly strukturPengurusKurasiRepository: Repository<StrukturPengurusKurasi>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(StrukturPengurusKurasiService.name);

    async create(createStrukturPengurusKurasiDto: CreateStrukturPengurusKurasiDto, userId: string, imgSrc: string): Promise<StrukturPengurusKurasi> {
        let newStrukturPengurusKurasi: StrukturPengurusKurasi;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataStrukturPengurusKurasi = { ...createStrukturPengurusKurasiDto, createdBy, updatedBy, fotoDewan: imgSrc };
            newStrukturPengurusKurasi = await transactionalEntityManager.save(
                this.strukturPengurusKurasiRepository.create(dataStrukturPengurusKurasi),
            );
        });

        await redis.del(`strukturpenguruskurasis`);
        return newStrukturPengurusKurasi!;
    }

    async update(
        id: string,
        userId: string,
        updateStrukturPengurusKurasiDto: UpdateStrukturPengurusKurasiDto,
        imgSrc?: string,
    ): Promise<StrukturPengurusKurasi> {
        let updatedSturkturPengurusKurasi: StrukturPengurusKurasi;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const strukturPengurusKurasi = await transactionalEntityManager.findOne(StrukturPengurusKurasi, { where: { id } });
            if (!strukturPengurusKurasi) {
                throw new NotFoundException(`Struktur Pengurus Kurasi with id ${id} not found`);
            }
            const updatedBy = user;
            const dataStrukturPengurusKurasi = { ...updateStrukturPengurusKurasiDto, updatedBy };

            if (imgSrc) {
                if (strukturPengurusKurasi.fotoDewan) {
                    const oldImagePath = path.join(__dirname, '../../public/upload/struktur-pengurus-kurasi', path.basename(strukturPengurusKurasi.fotoDewan));
                    fs.unlinkSync(oldImagePath);
                }
                dataStrukturPengurusKurasi.fotoDewan = imgSrc;
            }

            Object.assign(strukturPengurusKurasi, dataStrukturPengurusKurasi);
            updatedSturkturPengurusKurasi = await transactionalEntityManager.save(strukturPengurusKurasi);
        });

        await redis.del(`strukturpenguruskurasis`);
        return updatedSturkturPengurusKurasi!;
    }

    async findOne(id: string): Promise<StrukturPengurusKurasi | undefined> {
        return this.strukturPengurusKurasiRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: StrukturPengurusKurasi[], total: number }> {
        const { page = 1, limit = 10, search, sort, order } = query;
        const cacheKey = `strukturpenguruskurasis`;

        this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

        const cachedData = await redis.get<string | null>(cacheKey);
        if (cachedData) {
            this.logger.log(`Cache hit for key: ${cacheKey}`);
            const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
            return result;
        }

        const skip = (page - 1) * limit;
        this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);

        const [strukturPengurusKurasi, total] = await this.strukturPengurusKurasiRepository.findAndCount({
            skip,
            take: limit,
            where: search ? { namaDewan: Like(`%${search}%`) } : {},
            order: sort && order ? { [sort]: order } : {},
            relations: ['createdBy', 'updatedBy'],
        });

        this.logger.log(`DB result - Kurasi count: ${strukturPengurusKurasi.length}, Total count: ${total}`);

        const result = { data : strukturPengurusKurasi, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const strukturPengurusKurasi = await this.strukturPengurusKurasiRepository.findOne({ where: { id } });
        if (!strukturPengurusKurasi) {
            throw new NotFoundException(`Struktur Pengurus Kurasi with id ${id} not found`);
        }

        if (strukturPengurusKurasi.fotoDewan) {
            const imagePath = path.join(__dirname, '../../public/upload/struktur-pengurus-kurasi', path.basename(strukturPengurusKurasi.fotoDewan));
            fs.unlinkSync(imagePath);
        }

        await this.strukturPengurusKurasiRepository.delete(id);
        await redis.del(`strukturpenguruskurasis`);
    }
}
