import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeluangKerja } from 'src/entities/peluang-kerja.entity';
import { PeluangKerjaController } from './peluang-kerja.controller';
import { PeluangKerjaService } from './peluang-kerja.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [TypeOrmModule.forFeature([PeluangKerja]), AuthModule],
    controllers: [PeluangKerjaController],
    providers: [PeluangKerjaService],
})
export class PeluangKerjaModule { }
