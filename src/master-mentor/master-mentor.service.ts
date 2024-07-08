import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { MasterMentor } from 'src/entities/master-mentor.entity';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { CreateMasterMentorDto } from './dto/create-master-mentor.dto';
import { UpdateMasterMentorDto } from './dto/update-master-mentor.dto';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class MasterMentorService {
    constructor(
        @InjectRepository(MasterMentor)
        private readonly masterMentorRepository: Repository<MasterMentor>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(MasterMentorService.name);

    async create(createMasterMentorDto: CreateMasterMentorDto, userId: string): Promise<MasterMentor> {
        let newMasterMentor: MasterMentor;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataMasterMentor = { ...createMasterMentorDto, createdBy, updatedBy };
            newMasterMentor = await transactionalEntityManager.save(
                this.masterMentorRepository.create(dataMasterMentor),
            );
        });

        await this.clearMasterMentorsCache();
        return newMasterMentor!;
    }

    async update(id: string, updateMasterMentorDto: UpdateMasterMentorDto, userId: string): Promise<MasterMentor> {
        let updatedMasterMentor: MasterMentor;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const masterMentor = await transactionalEntityManager.findOne(MasterMentor, { where: { id } });
            if (!masterMentor) {
                throw new NotFoundException(`MasterMentor with id ${id} not found`);
            }
            const updatedBy = user;

            const dataMasterMentor: Partial<MasterMentor>= {
                urlMasterMentor: updateMasterMentorDto.urlMasterMentor || masterMentor.urlMasterMentor,
                publishedAt: updateMasterMentorDto.publishedAt || masterMentor.publishedAt,
                updatedBy };
            Object.assign(masterMentor, dataMasterMentor);
            updatedMasterMentor = await transactionalEntityManager.save(masterMentor);
        });

        await this.clearMasterMentorsCache();
        return updatedMasterMentor!;
    }

    async findOne(id: string): Promise<MasterMentor | undefined> {
        return this.masterMentorRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: MasterMentor[], total: number }> {
        const { limit, sort, order } = query;
        const cacheKey = `masterMentors_${sort}_${limit}_${order}`;

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

        const [masterMentors, total] = await this.masterMentorRepository.findAndCount({
            take: limit,
            order: orderOption,
            relations: ['createdBy', 'updatedBy'],
        });

        this.logger.log(`DB result - MasterMentors count: ${masterMentors.length}, Total count: ${total}`);

        const result = { data: masterMentors, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const masterMentor = await this.masterMentorRepository.findOne({ where: { id } });
        if (!masterMentor) {
            throw new NotFoundException(`MasterMentor with id ${id} not found`);
        }

        await this.masterMentorRepository.delete(id);
        await this.clearMasterMentorsCache();
    }

    private async clearMasterMentorsCache(): Promise<void> {
        const keys = await redis.keys('masterMentors_*');
        
        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}