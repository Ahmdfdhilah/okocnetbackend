import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { Mitra } from 'src/entities/mitra.entity';
import { CreateMitraDto } from './dto/create-mitra.dto';
import { UpdateMitraDto } from './dto/update-mitra.dto';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';

@Injectable()
export class MitraService {
    constructor(
        @InjectRepository(Mitra)
        private readonly mitraRepository: Repository<Mitra>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(MitraService.name);

    async create(createMitraDto: CreateMitraDto, userId: string, imgSrc: string): Promise<Mitra> {
        let newMitra: Mitra;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataMitra = { ...createMitraDto, createdBy, updatedBy, foto: imgSrc };
            newMitra = await transactionalEntityManager.save(
                this.mitraRepository.create(dataMitra),
            );
        });

        await this.clearAllMitraCache();
        return newMitra!;
    }

    async update(
        id: string,
        userId: string,
        updateMitraDto: UpdateMitraDto,
        imgSrc?: string,
    ): Promise<Mitra> {
        let updatedMitra: Mitra;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const mitra = await transactionalEntityManager.findOne(Mitra, { where: { id } });
            if (!mitra) {
                throw new NotFoundException(`Mitra with id ${id} not found`);
            }
            const updatedBy = user;

            const updatedData = {
                publishedAt: updateMitraDto.publishedAt || mitra.publishedAt,
                updatedBy: updatedBy,
                foto: imgSrc || mitra.foto,
            };

            Object.assign(mitra, updatedData);
            updatedMitra = await transactionalEntityManager.save(mitra);
        });

        await this.clearAllMitraCache();
        return updatedMitra!;
    }

    async findOne(id: string): Promise<Mitra | undefined> {
        return this.mitraRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(): Promise<Mitra[]> {
        return this.mitraRepository.find({ relations: ['createdBy', 'updatedBy'] });
    }

    async remove(id: string): Promise<void> {
        const mitra = await this.mitraRepository.findOne({ where: { id } });
        if (!mitra) {
            throw new NotFoundException(`Mitra with id ${id} not found`);
        }

        await this.mitraRepository.delete(id);
        await this.clearAllMitraCache();
    }

    private async clearAllMitraCache() {
        const keys = await redis.keys('mitras_*');

        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}