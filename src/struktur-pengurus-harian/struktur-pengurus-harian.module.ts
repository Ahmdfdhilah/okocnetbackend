import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrukturPengurusHarian } from 'src/entities/struktur-pengurus-harian.entity';
import { User } from 'src/entities/user.entity';
import { StrukturPengurusHarianController } from './struktur-pengurus-harian.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([StrukturPengurusHarian]), User
    ],
    controllers: [StrukturPengurusHarianController],
    providers: [StrukturPengurusHarianController],
})
export class StrukturPengurusDirektoratModule {}