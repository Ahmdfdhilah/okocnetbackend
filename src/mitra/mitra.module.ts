import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mitra } from 'src/entities/mitra.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Mitra])],

})
export class MitraModule {}