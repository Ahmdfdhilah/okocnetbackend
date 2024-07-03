import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { StrukturPengurusKurasiService } from './struktur-pengurus-eksekutif.service';
import { StrukturPengurusKurasi } from 'src/entities/struktur-pengurus-kurasi.entity';
import { CreateStrukturPengurusKurasiDto } from './dto/create-struktur-kurasi.dto';
import { UpdateStrukturPengurusKurasiDto } from './dto/update-struktur-kurasi.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';

@Controller('struktur-pengurus-kurasi')
export class StrukturPengurusKurasiController {
    constructor(private readonly strukturPengurusKurasiService: StrukturPengurusKurasiService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-kurasi')))
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createStrukturPengurusKurasiDto: CreateStrukturPengurusKurasiDto,
    ): Promise<StrukturPengurusKurasi> {
        const imgSrc = getFileUrl('strukturpenguruskurasi', file);
        return this.strukturPengurusKurasiService.create(createStrukturPengurusKurasiDto, userId, imgSrc);
    }

    @Get()
    async findAll(@Query() query: QueryDto): Promise<{ strukturPengurusKurasi: StrukturPengurusKurasi[], total: number }> {
        return this.strukturPengurusKurasiService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<StrukturPengurusKurasi> {
        return this.strukturPengurusKurasiService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-kurasi')))
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateStrukturPengurusKurasiDto: UpdateStrukturPengurusKurasiDto,
    ): Promise<StrukturPengurusKurasi> {
        const imgSrc = getFileUrl('strukturpenguruskurasi', file);
        return this.strukturPengurusKurasiService.update(id, userId, updateStrukturPengurusKurasiDto, imgSrc);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.strukturPengurusKurasiService.remove(id);
    }
}
