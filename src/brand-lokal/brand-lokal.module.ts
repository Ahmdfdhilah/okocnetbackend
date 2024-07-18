import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BrandLokalService } from './brand-lokal.service';
import { BrandLokalController } from './brand-lokal.controller';
import { BrandLokal } from 'src/entities/brand-lokal.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([BrandLokal]), AuthModule],
  providers: [BrandLokalService],
  controllers: [BrandLokalController],
})
export class BrandLokalModule {}