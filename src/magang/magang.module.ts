import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Magang } from '../entities/magang.entity';
import { MagangService } from './magang.service';
import { MagangController } from './magang.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Magang])],
  controllers: [MagangController],
  providers: [MagangService],
})
export class MagangModule {}