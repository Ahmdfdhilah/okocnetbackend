import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Total } from 'src/entities/total.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Total])],

})
export class TotalModule {}