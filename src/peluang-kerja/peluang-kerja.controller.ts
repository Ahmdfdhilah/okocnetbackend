import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { PeluangKerjaService } from './peluang-kerja.service';
import { PeluangKerja } from 'src/entities/peluang-kerja.entity';
import { CreatePeluangKerjaDto } from './dto/create-peluang-kerja.dto';
import { UpdatePeluangKerjaDto } from './dto/update-peluang-kerja.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';

@Controller('peluang-kerjas')
export class PeluangKerjaController {
    constructor(private readonly peluangKerjaService: PeluangKerjaService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('peluang-kerjas')))
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createPeluangKerjaDto: CreatePeluangKerjaDto,
    ): Promise<PeluangKerja> {
        const imgSrc = getFileUrl('peluang-kerjas', file);
        return this.peluangKerjaService.create(createPeluangKerjaDto, userId, imgSrc);
    }

    @Get()
    async findAll(@Query() query: QueryDto): Promise<{ peluangKerjas: PeluangKerja[], total: number }> {
        return this.peluangKerjaService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<PeluangKerja> {
        return this.peluangKerjaService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('peluang-kerjas')))
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updatePeluangKerjaDto: UpdatePeluangKerjaDto,
    ): Promise<PeluangKerja> {
        const imgSrc = getFileUrl('peluang-kerjas', file);
        return this.peluangKerjaService.update(id, userId, updatePeluangKerjaDto, imgSrc);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.peluangKerjaService.remove(id);
    }
}