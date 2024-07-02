import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Event } from 'src/entities/event.entity';
import { EventService } from './event.service';
import { EventController } from './event.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Event])],
    providers: [EventService],
    controllers: [EventController],
})
export class EventModule {}