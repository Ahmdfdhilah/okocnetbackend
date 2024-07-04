import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository, Like } from 'typeorm';
import { Event } from 'src/entities/event.entity';
import redis from 'src/lib/redis-client';
import { QueryDto } from 'src/lib/query.dto';
import { User } from 'src/entities/user.entity';
import * as fs from 'fs';
import * as path from 'path';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventService {
    constructor(
        @InjectRepository(Event)
        private readonly eventRepository: Repository<Event>,
        private readonly entityManager: EntityManager,
    ) { }
    private readonly logger = new Logger(EventService.name);

    async create(createEventDto: CreateEventDto, userId: string, imgSrc: string): Promise<Event> {
        let newEvent: Event;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const createdBy = user;
            const updatedBy = user;

            const dataEvent = { ...createEventDto, createdBy, updatedBy, fotoEvent: imgSrc };
            newEvent = await transactionalEntityManager.save(
                this.eventRepository.create(dataEvent),
            );
        });

        await redis.del(`events`);
        return newEvent!;
    }

    async update(id: string, userId: string, updateEventDto: UpdateEventDto, imgSrc?: string): Promise<Event> {
        let updatedEvent: Event;

        await this.entityManager.transaction(async transactionalEntityManager => {
            const user = await transactionalEntityManager.findOne(User, { where: { id: userId } });
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const event = await transactionalEntityManager.findOne(Event, { where: { id } });
            if (!event) {
                throw new NotFoundException(`Event with id ${id} not found`);
            }
            const updatedBy = user;
            const dataEvent = { ...updateEventDto, updatedBy };

            if (imgSrc) {
                if (event.fotoEvent) {
                    const oldImagePath = path.join(__dirname, '../../public/upload/events', path.basename(event.fotoEvent));
                    fs.unlinkSync(oldImagePath);
                }
                dataEvent.fotoEvent = imgSrc;
            }

            Object.assign(event, dataEvent);
            updatedEvent = await transactionalEntityManager.save(event);
        });

        await redis.del(`events`);
        return updatedEvent!;
    }

    async findOne(id: string): Promise<Event | undefined> {
        return this.eventRepository.findOne({ where: { id }, relations: ['createdBy', 'updatedBy'] });
    }

    async findAll(query: QueryDto): Promise<{ data: Event[], total: number }> {
        const { page = 1, limit = 10, search, sort, order } = query;
        const cacheKey = `events`;

        this.logger.log(`Fetching data for cacheKey: ${cacheKey}`);

        const cachedData = await redis.get<string | null>(cacheKey);
        if (cachedData) {
            this.logger.log(`Cache hit for key: ${cacheKey}`);
            const result = typeof cachedData === 'string' ? JSON.parse(cachedData) : cachedData;
            return result;
        }

        const skip = (page - 1) * limit;
        this.logger.log(`Fetching from DB with skip: ${skip}, limit: ${limit}`);

        const [events, total] = await this.eventRepository.findAndCount({
            skip,
            take: limit,
            where: search ? { judulEvent: Like(`%${search}%`) } : {},
            order: sort && order ? { [sort]: order } : {},
            relations: ['createdBy', 'updatedBy'],
        });

        this.logger.log(`DB result - Events count: ${events.length}, Total count: ${total}`);

        const result = { data:events, total };
        await redis.set(cacheKey, JSON.stringify(result), { ex: 3600 });

        return result;
    }

    async remove(id: string): Promise<void> {
        const event = await this.eventRepository.findOne({ where: { id } });
        if (!event) {
            throw new NotFoundException(`Event with id ${id} not found`);
        }
        if (event.fotoEvent) {
            const imagePath = path.join(__dirname, '../../public/upload/events', path.basename(event.fotoEvent));
            fs.unlinkSync(imagePath);
        }

        await this.eventRepository.delete(id);
        await redis.del(`events`);
    }
}