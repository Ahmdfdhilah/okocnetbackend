import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandLokalService } from './brand-lokal.service';
import { BrandLokalController } from './brand-lokal.controller';
import { BrandLokal } from 'src/entities/brand-lokal.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BrandLokal])],
  providers: [BrandLokalService],
  controllers: [BrandLokalController],
})
export class BrandLokalModule {}