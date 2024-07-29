import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Thementor } from '../entities/thementor.entity';
import { Teks } from '../entities/teks.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import * as fs from 'fs';
import * as path from 'path';
import { CreateThementorDto } from './dto/create-thementor.dto';
import { UpdateThementorDto } from './dto/update-thementor.dto';

@Injectable()
export class ThementorService {
    private readonly logger = new Logger(ThementorService.name);

    constructor(
        @InjectRepository(Thementor)
        private readonly thementorRepository: Repository<Thementor>,
        private readonly entityManager: EntityManager,
    ) { }

    async create(createThementorDto: CreateThementorDto, dokumentasiFiles?: string[]): Promise<Thementor> {
        let newThementor: Thementor;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const teksEntities = createThementorDto.deskripsi.map((str, index) => {
                const teks = new Teks();
                teks.str = str;
                teks.order = index;
                return teks;
            });

            const dataThementor = {
                ...createThementorDto,
                deskripsi: teksEntities,
                dokumentasi: dokumentasiFiles || [],
            };

            newThementor = await transactionalEntityManager.save(
                this.thementorRepository.create(dataThementor),
            );
        });

        await this.clearAllThementorCache();
        return newThementor!;
    }

    async update(id: string, updateThementorDto: UpdateThementorDto, dokumentasiFiles?: string[]): Promise<Thementor> {
        let updatedThementor: Thementor;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const thementor = await transactionalEntityManager.findOne(Thementor, { where: { id }, relations: ['deskripsi'] });
            if (!thementor) {
                throw new NotFoundException(`Thementor with id ${id} not found`);
            }

            let teksData;
            if (updateThementorDto.deskripsi) {
                const teksEntities = updateThementorDto.deskripsi.map((str, index) => {
                    const teks = new Teks();
                    teks.str = str;
                    teks.order = index;
                    return teks;
                });
                teksData = teksEntities;
            }

            const existingDokumentasi = thementor.dokumentasi || [];
            const newDokumentasi = dokumentasiFiles ? [...existingDokumentasi, ...dokumentasiFiles] : existingDokumentasi;

            const dataThementor = { ...updateThementorDto, deskripsi: teksData, dokumentasi: newDokumentasi };

            Object.assign(thementor, dataThementor);
            updatedThementor = await transactionalEntityManager.save(thementor);
        });

        await this.clearAllThementorCache();
        return updatedThementor!;
    }

    // Inside ThementorService
    async deleteDokumentasi(thementorId: string, dokumentasiUrl: string): Promise<void> {
        const thementor = await this.thementorRepository.findOne({ where: { id: thementorId } });
        if (!thementor) {
            throw new NotFoundException(`Thementor with id ${thementorId} not found`);
        }

        // Remove the file URL from the dokumentasi array
        thementor.dokumentasi = thementor.dokumentasi.filter(doc => doc !== dokumentasiUrl);

        // Delete the file from the filesystem
        const filePath = path.join(__dirname, '../../public/upload/thementors', path.basename(dokumentasiUrl));
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        await this.thementorRepository.save(thementor);
        await this.clearAllThementorCache();
    }

    async findOne(id: string): Promise<Thementor | undefined> {
        const thementor = await this.thementorRepository.findOne({ where: { id }, relations: ['deskripsi'] });
        if (thementor && thementor.deskripsi) {
            thementor.deskripsi.sort((a, b) => a.order - b.order);
        }
        return thementor;
    }

    async findAll(query: QueryDto): Promise<{ data: Thementor[], total: number }> {
        let { limit, page, search, sort, order } = query;
        const cacheKey = `thementors_${limit}_${page}_${search}_${sort}_${order}`;
        this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

        const cachedData = await redis.get<string | null>(cacheKey);
        if (cachedData) {
            this.logger.log(`Cache hit for key: ${cacheKey}`);
            const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
            return result;
        }

        this.logger.log(`Fetching from DB with limit: ${limit}, page: ${page}`);

        if (limit) {
            limit = parseInt(limit as any, 10);
        }
        if (page) {
            page = parseInt(page as any, 10);
        }

        let skip = 0;
        if (limit && page) {
            skip = (page - 1) * limit;
        }

        const orderOption: { [key: string]: 'ASC' | 'DESC' } = {};
        if (sort && order) {
            orderOption[sort] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else if (order && !sort) {
            orderOption['createdAt'] = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        } else {
            orderOption['createdAt'] = 'DESC';
        }

        let thementors: Thementor[];
        let total: number;
        if (limit && page) {
            const [result, count] = await this.thementorRepository.findAndCount({
                take: limit,
                skip: skip,
                where: search ? { judul: Like(`%${search}%`) } : {},
                order: orderOption,
                relations: ['deskripsi'],
            });
            thementors = result;
            total = count;
        } else {
            const result = await this.thementorRepository.find({
                where: search ? { judul: Like(`%${search}%`) } : {},
                order: orderOption,
                relations: ['deskripsi'],
            });
            thementors = result;
            total = result.length;
        }

        this.logger.log(`DB result - Thementors count: ${thementors.length}, Total count: ${total}`);

        thementors.forEach(thementor => {
            if (thementor.deskripsi) {
                thementor.deskripsi.sort((a, b) => a.order - b.order);
            }
        });

        const result = { data: thementors, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const thementor = await this.thementorRepository.findOne({ where: { id }, relations: ['deskripsi'] });
        if (!thementor) {
            throw new NotFoundException(`Thementor with id ${id} not found`);
        }
        if (thementor.dokumentasi && thementor.dokumentasi.length > 0) {
            for (const file of thementor.dokumentasi) {
                const filePath = path.join(__dirname, '../../public/upload/thementors', path.basename(file));
                if (fs.existsSync(filePath)) { fs.unlinkSync(filePath); }
            }
        }

        await this.thementorRepository.delete(id);
        await this.clearAllThementorCache();
    }

    private async clearAllThementorCache(): Promise<void> {
        const keys = await redis.keys('thementors_*');
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}