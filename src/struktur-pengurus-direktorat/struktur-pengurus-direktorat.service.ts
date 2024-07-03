import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrukturPengurusDirektorat } from 'src/entities/struktur-pengurus-direktorat.entity';
import { User } from 'src/entities/user.entity';
import { StrukturPengurusDirektoratService } from './struktur-pengurus-direktorat.module';
import { StrukturPengurusDirektoratController } from './struktur-pengurus-direktorat.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([StrukturPengurusDirektorat]), User
    ],
    controllers: [StrukturPengurusDirektoratController],
    providers: [StrukturPengurusDirektoratService],
})
export class StrukturPengurusDirektoratModule {}
