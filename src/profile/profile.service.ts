import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { Profile } from 'src/entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import * as fs from 'fs';
import * as path from 'path';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(Profile)
        private readonly profileRepository: Repository<Profile>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(ProfileService.name);

    async create(createProfileDto: CreateProfileDto, userId: string, imgSrc: string): Promise<Profile> {
        let newProfile: Profile;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataProfile = { ...createProfileDto, createdBy, updatedBy, foto: imgSrc };
            newProfile = await transactionalEntityManager.save(
                this.profileRepository.create(dataProfile),
            );
        });

        await this.clearAllProfileCache();
        return newProfile!;
    }

    async update(
        id: string,
        userId: string,
        updateProfileDto: UpdateProfileDto,
        imgSrc?: string,
    ): Promise<Profile> {
        let updatedProfile: Profile;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const profile = await transactionalEntityManager.findOne(Profile, { where: { id } });
            if (!profile) {
                throw new NotFoundException(`Profile with id ${id} not found`);
            }
            const updatedBy = user;

            const updatedData = {
                nama: updateProfileDto.nama || profile.nama,
                posisi: updateProfileDto.posisi || profile.posisi,
                publishedAt: updateProfileDto.publishedAt || profile.publishedAt,
                updatedBy: updatedBy,
                foto: null
            };

            if (imgSrc) {
                if (profile.foto) {
                    const oldImagePath = path.join(__dirname, '../../public/upload/profiles', path.basename(profile.foto));
                    if (oldImagePath) {
                        fs.unlinkSync(oldImagePath);
                    }
                }
                updatedData.foto = imgSrc;
            } else {
                updatedData.foto = profile.foto;
            }

            Object.assign(profile, updatedData);
            updatedProfile = await transactionalEntityManager.save(profile);
        });

        await this.clearAllProfileCache();
        return updatedProfile!;
    }

    async findOne(id: string): Promise<Profile | undefined> {
        return this.profileRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: Profile[], total: number }> {
        const { limit, page, search, sort, order } = query;
        const cacheKey = `profiles_${limit}_${page}_${search}_${sort}_${order}`;
    
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
            order: orderOption,
            relations: ['createdBy', 'updatedBy'],
        };
    
        if (limit && page) {
            findOptions.take = parseInt(limit as any, 10);
            findOptions.skip = (parseInt(page as any, 10) - 1) * findOptions.take;
        }
    
        if (search) {
            findOptions.where = { nama: Like(`%${search}%`) };
        }
    
        let profiles: Profile[];
        let total: number;
    
        if (limit && page) {
            const [result, count] = await this.profileRepository.findAndCount(findOptions);
            profiles = result;
            total = count;
        } else {
            const result = await this.profileRepository.find(findOptions);
            profiles = result;
            total = result.length;
        }
    
        this.logger.log(`DB result - Profiles count: ${profiles.length}, Total count: ${total}`);
    
        const result = { data: profiles, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
    
        return result;
    }
        
    async remove(id: string): Promise<void> {
        const profile = await this.profileRepository.findOne({ where: { id } });
        if (!profile) {
            throw new NotFoundException(`Profile with id ${id} not found`);
        }

        if (profile.foto) {
            const imagePath = path.join(__dirname, '../../public/upload/profiles', path.basename(profile.foto));
            fs.unlinkSync(imagePath);
        }

        await this.profileRepository.delete(id);
        await this.clearAllProfileCache();
    }

    private async clearAllProfileCache() {
        const keys = await redis.keys('profiles_*');

        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}