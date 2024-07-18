import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeluangUsaha } from 'src/entities/peluang-usaha.entity';
import { PeluangUsahaService } from './peluang-usaha.service';
import { PeluangUsahaController } from './peluang-usaha.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([PeluangUsaha]), AuthModule
    ],
    providers: [PeluangUsahaService],
    controllers: [PeluangUsahaController],
})
export class PeluangUsahaModule { }