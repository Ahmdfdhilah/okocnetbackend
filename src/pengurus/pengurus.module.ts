import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PengurusService } from './pengurus.service';
import { PengurusController } from './pengurus.controller';
import { Pengurus } from 'src/entities/pengurus.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pengurus])],
  controllers: [PengurusController],
  providers: [PengurusService],
})
export class PengurusModule {}