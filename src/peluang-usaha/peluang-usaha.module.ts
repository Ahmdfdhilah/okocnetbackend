import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeluangUsaha } from 'src/entities/peluang-usaha.entity';
import { PeluangUsahaService } from './peluang-usaha.service';
import { PeluangUsahaController } from './peluang-usaha.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([PeluangUsaha]),
    ],
    providers: [PeluangUsahaService],
    controllers: [PeluangUsahaController],
})
export class PeluangUsahaModule { }