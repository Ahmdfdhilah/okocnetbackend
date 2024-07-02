import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DonasiService } from './donasi.service';
import { DonasiController } from './donasi.controller';
import { Donasi } from 'src/entities/donasi.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Donasi])],
  providers: [DonasiService],
  controllers: [DonasiController],
})
export class DonasiModule {}