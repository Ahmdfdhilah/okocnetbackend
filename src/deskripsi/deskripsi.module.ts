import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deskripsi } from 'src/entities/deskripsi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Deskripsi])],

})
export class DeskripsiModule {}