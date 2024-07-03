import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrukturPengurusEksekutifService } from './struktur-pengurus-eksekutif.service';
import { StrukturPengurusEksekutif } from 'src/entities/struktur-pengurus-eksekutif.entity';
import { User } from 'src/entities/user.entity';
import { StrukturPengurusEksekutifController } from './struktur-pengurus-eksekutif.controller';

@Module({
  imports: [TypeOrmModule.forFeature([StrukturPengurusEksekutif]), User],
  controllers: [StrukturPengurusEksekutifController],
  providers: [StrukturPengurusEksekutifService],
})
export class StrukturPengurusEksekutifModule {}