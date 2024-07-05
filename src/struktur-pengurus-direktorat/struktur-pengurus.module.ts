import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrukturPengurus } from 'src/entities/struktur-pengurus.entity';
import { User } from 'src/entities/user.entity';
import { StrukturPengurusService } from './struktur-pengurus.service';
import { StrukturPengurusController } from './struktur-pengurus.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([StrukturPengurus]), User
    ],
    controllers: [StrukturPengurusController],
    providers: [StrukturPengurusService],
})
export class StrukturPengurusModule {}