import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { CreateStrukturPengurusDto } from './dto/create-struktur-pengurus.dto';
import { UpdateStrukturPengurusDto } from './dto/update-struktur-pengurus.dto';
import * as fs from 'fs';
import * as path from 'path';
import { QueryDto } from 'src/lib/query.dto';
import { StrukturPengurus } from 'src/entities/struktur-pengurus.entity';

@Injectable()
export class StrukturPengurusService {
    constructor(
        @InjectRepository(StrukturPengurus)
        private readonly strukturPengurusRepository: Repository<StrukturPengurus>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(StrukturPengurusService.name);

    async create(createStrukturPengurusDto: CreateStrukturPengurusDto, userId: string, imgSrc: string): Promise<StrukturPengurus> {
        let newStrukturPengurus: StrukturPengurus;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataStrukturPengurus = { ...createStrukturPengurusDto, createdBy, updatedBy, foto: imgSrc };
            newStrukturPengurus = await transactionalEntityManager.save(
                this.strukturPengurusRepository.create(dataStrukturPengurus),
            );
        });

        await this.clearAllStrukturCache();
        return newStrukturPengurus!;
    }

    async update(
        id: string,
        userId: string,
        updateStrukturPengurusDto: UpdateStrukturPengurusDto,
        imgSrc?: string,
    ): Promise<StrukturPengurus> {
        let updatedStrukturPengurus: StrukturPengurus;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const strukturPengurus = await transactionalEntityManager.findOne(StrukturPengurus, { where: { id } });
            if (!strukturPengurus) {
                throw new NotFoundException(`Struktur Pengurus with id ${id} not found`);
            }
            const updatedBy = user;

            const updatedData = {
                nama: updateStrukturPengurusDto.nama || strukturPengurus.nama,
                jabatan: updateStrukturPengurusDto.jabatan || strukturPengurus.jabatan,
                publishedAt: updateStrukturPengurusDto.publishedAt || strukturPengurus.publishedAt,
                tipe: updateStrukturPengurusDto.tipe || strukturPengurus.tipe,
                updatedBy: updatedBy,
                foto: null
            };

            if (imgSrc) {
                if (strukturPengurus.foto) {
                    const oldImagePath = path.join(__dirname, '../../public/upload/struktur-penguruses', path.basename(strukturPengurus.foto));
                    if (oldImagePath) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                updatedData.foto = imgSrc;
            } else {
                updatedData.foto = strukturPengurus.foto;
            }

            Object.assign(strukturPengurus, updatedData);
            updatedStrukturPengurus = await transactionalEntityManager.save(strukturPengurus);
        });

        await this.clearAllStrukturCache();
        return updatedStrukturPengurus!;
    }

    async findOne(id: string): Promise<StrukturPengurus | undefined> {
        return this.strukturPengurusRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: StrukturPengurus[], total: number }> {
        const { limit, search, sort, order } = query;
        const cacheKey = `strukturpenguruses_${limit}_${search}_${sort}_${order}`;

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
        }
        else {
            orderOption['createdAt'] = 'DESC';
        }

        const [strukturPenguruses, total] = await this.strukturPengurusRepository.findAndCount({
            take: limit,
            where: search ? { nama: Like(`%${search}%`) } : {},
            order: orderOption,
            relations: ['createdBy', 'updatedBy'],
        });

        this.logger.log(`DB result - StrukturPenguruses count: ${strukturPenguruses.length}, Total count: ${total}`);

        const result = { data: strukturPenguruses, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const strukturPengurus = await this.strukturPengurusRepository.findOne({ where: { id } });
        if (!strukturPengurus) {
            throw new NotFoundException(`Struktur Pengurus with id ${id} not found`);
        }

        if (strukturPengurus.foto) {
            const imagePath = path.join(__dirname, '../../public/upload/struktur-penguruses', path.basename(strukturPengurus.foto));
            fs.unlinkSync(imagePath);
        }

        await this.strukturPengurusRepository.delete(id);
        await this.clearAllStrukturCache();
    }

    private async clearAllStrukturCache() {
        const keys = await redis.keys('strukturpenguruses_*');

        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}