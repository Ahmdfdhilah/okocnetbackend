import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from 'src/entities/banner.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Banner])],

})
export class BannerModule {}