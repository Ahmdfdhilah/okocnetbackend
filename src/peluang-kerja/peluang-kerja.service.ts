import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { PeluangKerja } from 'src/entities/peluang-kerja.entity';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { CreatePeluangKerjaDto } from './dto/create-peluang-kerja.dto';
import { UpdatePeluangKerjaDto } from './dto/update-peluang-kerja.dto';
import * as fs from 'fs';
import * as path from 'path';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class PeluangKerjaService {
    constructor(
        @InjectRepository(PeluangKerja)
        private readonly peluangKerjaRepository: Repository<PeluangKerja>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(PeluangKerjaService.name);

    async create(createPeluangKerjaDto: CreatePeluangKerjaDto, userId: string, imgSrc: string): Promise<PeluangKerja> {
        let newPeluangKerja: PeluangKerja;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataPeluangKerja = { ...createPeluangKerjaDto, createdBy, updatedBy, fotoKerja: imgSrc };
            newPeluangKerja = await transactionalEntityManager.save(
                this.peluangKerjaRepository.create(dataPeluangKerja),
            );
        });

        await this.clearPeluangKerjasCache();
        return newPeluangKerja!;
    }

    async update(
        id: string,
        userId: string,
        updatePeluangKerjaDto: UpdatePeluangKerjaDto,
        imgSrc?: string,
    ): Promise<PeluangKerja> {
        let updatedPeluangKerja: PeluangKerja;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const peluangKerja = await transactionalEntityManager.findOne(PeluangKerja, { where: { id } });
            if (!peluangKerja) {
                throw new NotFoundException(`PeluangKerja with id ${id} not found`);
            }
            const updatedBy = user;
            const dataPeluangKerja = {
                ...peluangKerja,
                ...updatePeluangKerjaDto,
                updatedBy,
                fotoKerja: imgSrc || peluangKerja.fotoKerja, 
            };
            
            if (imgSrc) {
                if (peluangKerja.fotoKerja) {
                    const oldImagePath = path.join(__dirname, '../../public/upload/peluang-kerjas', path.basename(peluangKerja.fotoKerja));
                    if(fs.existsSync(oldImagePath)) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                dataPeluangKerja.fotoKerja = imgSrc;
            }

            Object.assign(peluangKerja, dataPeluangKerja);
            updatedPeluangKerja = await transactionalEntityManager.save(peluangKerja);
        });

        await this.clearPeluangKerjasCache();
        return updatedPeluangKerja!;
    }

    async findOne(id: string): Promise<PeluangKerja | undefined> {
        return this.peluangKerjaRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: PeluangKerja[], total: number }> {
        let { limit, page, search, sort, order } = query;
        const cacheKey = `peluang-kerjas_${limit}_${page}_${search}_${sort}_${order}`;
    
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
            where: search ? { judulKerja: Like(`%${search}%`) } : {},
            order: orderOption,
            relations: ['createdBy', 'updatedBy'],
        };
    
        if (limit) {
            findOptions.take = parseInt(limit as any, 10);
        }
    
        if (page) {
            findOptions.skip = (parseInt(page as any, 10) - 1) * (findOptions.take || 10);
        }
    
        const [peluangKerjas, total] = await this.peluangKerjaRepository.findAndCount(findOptions);
    
        this.logger.log(`DB result - PeluangKerjas count: ${peluangKerjas.length}, Total count: ${total}`);
    
        const result = { data: peluangKerjas, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
    
        return result;
    }
    
    async remove(id: string): Promise<void> {
        const peluangKerja = await this.peluangKerjaRepository.findOne({ where: { id } });
        if (!peluangKerja) {
            throw new NotFoundException(`PeluangKerja with id ${id} not found`);
        }

        if (peluangKerja.fotoKerja) {
            const imagePath = path.join(__dirname, '../../public/upload/peluang-kerjas', path.basename(peluangKerja.fotoKerja));
            if(fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await this.peluangKerjaRepository.delete(id);
        await this.clearPeluangKerjasCache();
    }

    private async clearPeluangKerjasCache() {
        const keys = await redis.keys('peluang-kerjas_*');
        
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}
