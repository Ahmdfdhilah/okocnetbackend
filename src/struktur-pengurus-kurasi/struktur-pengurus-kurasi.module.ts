import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrukturPengurusKurasi } from 'src/entities/struktur-pengurus-kurasi.entity';
import { User } from 'src/entities/user.entity';
import { StrukturPengurusKurasiController } from './struktur-pengurus-kurasi.controller';
import { StrukturPengurusKurasiService } from './struktur-pengurus-kurasi.service';

@Module({
  imports: [TypeOrmModule.forFeature([StrukturPengurusKurasi]), User],
  controllers: [StrukturPengurusKurasiController],
  providers: [StrukturPengurusKurasiService],
})
export class StrukturPengurusKurasiModule {}