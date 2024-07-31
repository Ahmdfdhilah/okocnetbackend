import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StrukturPengurus } from 'src/entities/struktur-pengurus.entity';
import { User } from 'src/entities/user.entity';
import { StrukturPengurusService } from './struktur-pengurus.service';
import { StrukturPengurusController } from './struktur-pengurus.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([StrukturPengurus]), User, AuthModule
    ],
    controllers: [StrukturPengurusController],
    providers: [StrukturPengurusService],
})
export class StrukturPengurusModule {}