import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { CreateStrukturPengurusPembinaDto } from './dto/create-struktur-pengurus-pembina.dto';
import { UpdateStrukturPengurusPembinaDto } from './dto/update-struktur-pengurus-pembina.dto';
import * as fs from 'fs';
import * as path from 'path';
import { QueryDto } from 'src/lib/query.dto';
import { StrukturPengurusPembina } from 'src/entities/struktur-pengurus-pembina.entity';

@Injectable()
export class StrukturPengurusPembinaService {
    constructor(
        @InjectRepository(StrukturPengurusPembina)
        private readonly strukturPengurusPembinaRepository: Repository<StrukturPengurusPembina>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(StrukturPengurusPembinaService.name);

    async create(createStrukturPengurusPembinaDto: CreateStrukturPengurusPembinaDto, userId: string, imgSrc: string): Promise<StrukturPengurusPembina> {
        let newStrukturPengurusPembina: StrukturPengurusPembina;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataStrukturPengurusPembina = { ...createStrukturPengurusPembinaDto, createdBy, updatedBy, fotoPembina: imgSrc };
            newStrukturPengurusPembina = await transactionalEntityManager.save(
                this.strukturPengurusPembinaRepository.create(dataStrukturPengurusPembina),
            );
        });

        await redis.del(`strukturpenguruspembinas`);
        return newStrukturPengurusPembina!;
    }

    async update(
        id: string,
        userId: string,
        updateStrukturPengurusPembinaDto: UpdateStrukturPengurusPembinaDto,
        imgSrc?: string,
    ): Promise<StrukturPengurusPembina> {
        let updatedSturkturPengurusPembina: StrukturPengurusPembina;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const strukturPengurusPembina = await transactionalEntityManager.findOne(StrukturPengurusPembina, { where: { id } });
            if (!strukturPengurusPembina) {
                throw new NotFoundException(`Struktur Pengurus Pembina with id ${id} not found`);
            }
            const updatedBy = user;
            const dataStrukturPengurusPembina = { ...updateStrukturPengurusPembinaDto, updatedBy };

            if (imgSrc) {
                if (strukturPengurusPembina.fotoPembina) {
                    const oldImagePath = path.join(__dirname, '../../public/upload/struktur-pengurus-pembinas', path.basename(strukturPengurusPembina.fotoPembina));
                    fs.unlinkSync(oldImagePath);
                }
                dataStrukturPengurusPembina.fotoPembina = imgSrc;
            }

            Object.assign(strukturPengurusPembina, dataStrukturPengurusPembina);
            updatedSturkturPengurusPembina = await transactionalEntityManager.save(strukturPengurusPembina);
        });

        await redis.del(`strukturpenguruspembinas`);
        return updatedSturkturPengurusPembina!;
    }

    async findOne(id: string): Promise<StrukturPengurusPembina | undefined> {
        return this.strukturPengurusPembinaRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: StrukturPengurusPembina[], total: number }> {
        const { page = 1, limit = 10, search, sort, order } = query;
        const cacheKey = `strukturpenguruspembinas`;

        this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

        const cachedData = await redis.get<string | null>(cacheKey);
        if (cachedData) {
            this.logger.log(`Cache hit for key: ${cacheKey}`);
            const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
            return result;
        }

        const skip = (page - 1) * limit;
        this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);

        const [data, total] = await this.strukturPengurusPembinaRepository.findAndCount({
            skip,
            take: limit,
            where: search ? { namaPembina: Like(`%${search}%`) } : {},
            order: sort && order ? { [sort]: order } : {},
            relations: ['createdBy', 'updatedBy'],
        });

        this.logger.log(`DB result - Pembina count: ${data.length}, Total count: ${total}`);

        const result = { data, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const strukturPengurusPembina = await this.strukturPengurusPembinaRepository.findOne({ where: { id } });
        if (!strukturPengurusPembina) {
            throw new NotFoundException(`Struktur Pengurus Pembina with id ${id} not found`);
        }

        if (strukturPengurusPembina.fotoPembina) {
            const imagePath = path.join(__dirname, '../../public/upload/struktur-pengurus-pembinas', path.basename(strukturPengurusPembina.fotoPembina));
            fs.unlinkSync(imagePath);
        }

        await this.strukturPengurusPembinaRepository.delete(id);
        await redis.del(`strukturpenguruspembinas`);
    }
}
