import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrukturPengurusPembina } from 'src/entities/struktur-pengurus-pembina.entity';
import { User } from 'src/entities/user.entity';
import { StrukturPengurusPembinaController } from './struktur-pengurus-pembina.controller';
import { StrukturPengurusPembinaService } from './struktur-pengurus-pembina.service';


@Module({
  imports: [TypeOrmModule.forFeature([StrukturPengurusPembina]), User],
  controllers: [StrukturPengurusPembinaController],
  providers: [StrukturPengurusPembinaService],
})
export class StrukturPengurusPembinaModule {}