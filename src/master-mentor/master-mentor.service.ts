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

        await redis.del(`master-mentors`);
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

            const dataMasterMentor = { ...updateMasterMentorDto, updatedBy };
            Object.assign(masterMentor, dataMasterMentor);
            updatedMasterMentor = await transactionalEntityManager.save(masterMentor);
        });

        await redis.del(`master-mentors`);
        return updatedMasterMentor!;
    }

    async findOne(id: string): Promise<MasterMentor | undefined> {
        return this.masterMentorRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: MasterMentor[], total: number }> {
        const { page = 1, limit = 10, search, sort, order } = query;
        const cacheKey = `masterMentors`;
    
        this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);
    
        const cachedData = await redis.get<string | null>(cacheKey);
        if (cachedData) {
          this.logger.log(`Cache hit for key: ${cacheKey}`);
          const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
          return result;
        }
    
        const skip = (page - 1) * limit;
        this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);
    
        const [masterMentors, total] = await this.masterMentorRepository.findAndCount({
          skip,
          take: limit,
          order: sort && order ? { [sort]: order } : {},
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
        await redis.del(`master-mentors`);
    }
}