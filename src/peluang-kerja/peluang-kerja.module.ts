import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeluangKerja } from 'src/entities/peluang-kerja.entity';
import { PeluangKerjaController } from './peluang-kerja.controller';
import { PeluangKerjaService } from './peluang-kerja.service';

@Module({
    imports: [TypeOrmModule.forFeature([PeluangKerja])],
    controllers: [PeluangKerjaController],
    providers: [PeluangKerjaService],
})
export class PeluangKerjaModule { }
