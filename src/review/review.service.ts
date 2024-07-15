import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { Review } from 'src/entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { User } from 'src/entities/user.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';

@Injectable()
export class ReviewService {
    constructor(
        @InjectRepository(Review)
        private readonly reviewRepository: Repository<Review>,
        private readonly entityManager: EntityManager,
    ) { }

    private readonly logger = new Logger(ReviewService.name);

    async create(createReviewDto: CreateReviewDto, userId: string): Promise<Review> {
        let newReview: Review;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataReview = { ...createReviewDto, createdBy, updatedBy };
            newReview = await transactionalEntityManager.save(
                this.reviewRepository.create(dataReview),
            );
        });

        await this.clearAllReviewCache();
        return newReview!;
    }

    async update(
        id: string,
        userId: string,
        updateReviewDto: UpdateReviewDto,
    ): Promise<Review> {
        let updatedReview: Review;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const review = await transactionalEntityManager.findOne(Review, { where: { id } });
            if (!review) {
                throw new NotFoundException(`Review with id ${id} not found`);
            }
            const updatedBy = user;

            const updatedData = {
                deskripsi: updateReviewDto.deskripsi || review.deskripsi,
                nama: updateReviewDto.nama || review.nama,
                posisi: updateReviewDto.posisi || review.posisi,
                publishedAt: updateReviewDto.publishedAt || review.publishedAt,
                updatedBy: updatedBy,
            };

            Object.assign(review, updatedData);
            updatedReview = await transactionalEntityManager.save(review);
        });

        await this.clearAllReviewCache();
        return updatedReview!;
    }

    async findOne(id: string): Promise<Review | undefined> {
        return this.reviewRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: Review[], total: number }> {
        const { limit, page, search, sort, order } = query;
        const cacheKey = `reviews_${limit}_${page}_${search}_${sort}_${order}`;
    
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
    
        let reviews: Review[];
        let total: number;
    
        if (limit && page) {
            const [result, count] = await this.reviewRepository.findAndCount(findOptions);
            reviews = result;
            total = count;
        } else {
            const result = await this.reviewRepository.find(findOptions);
            reviews = result;
            total = result.length;
        }
    
        this.logger.log(`DB result - Reviews count: ${reviews.length}, Total count: ${total}`);
    
        const result = { data: reviews, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });
    
        return result;
    }
        
    async remove(id: string): Promise<void> {
        const review = await this.reviewRepository.findOne({ where: { id } });
        if (!review) {
            throw new NotFoundException(`Review with id ${id} not found`);
        }

        await this.reviewRepository.delete(id);
        await this.clearAllReviewCache();
    }

    private async clearAllReviewCache() {
        const keys = await redis.keys('reviews_*');

        if (keys.length > 0) {
            await redis.del(...keys);
        }
    }
}