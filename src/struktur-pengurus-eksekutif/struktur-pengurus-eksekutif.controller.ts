import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { StrukturPengurusEksekutifService } from './struktur-pengurus-eksekutif.service';
import { StrukturPengurusEksekutif } from 'src/entities/struktur-pengurus-eksekutif.entity';
import { CreateStrukturPengurusEksekutifDto } from './dto/create-struktur-eksekutif.dto';
import { UpdateStrukturPengurusEksekutifDto } from './dto/update-struktur-eksekutif.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';

@Controller('pengurus-eksekutif')
export class StrukturPengurusEksekutifController {
    constructor(private readonly strukturPengurusEksekutifService: StrukturPengurusEksekutifService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('strukturpenguruseksekutifs')))
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createStrukturPengurusEksekutifDto: CreateStrukturPengurusEksekutifDto,
    ): Promise<StrukturPengurusEksekutif> {
        const imgSrc = getFileUrl('strukturpenguruseksekutifs', file);
        return this.strukturPengurusEksekutifService.create(createStrukturPengurusEksekutifDto, userId, imgSrc);
    }

    @Get()
    async findAll(@Query() query: QueryDto): Promise<{ strukturPengurusEksekutif: StrukturPengurusEksekutif[], total: number }> {
        return this.strukturPengurusEksekutifService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<StrukturPengurusEksekutif> {
        return this.strukturPengurusEksekutifService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('strukturpenguruseksekutifs')))
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateStrukturPengurusEksekutifDto: UpdateStrukturPengurusEksekutifDto,
    ): Promise<StrukturPengurusEksekutif> {
        const imgSrc = getFileUrl('strukturpenguruseksekutifs', file);
        return this.strukturPengurusEksekutifService.update(id, userId, updateStrukturPengurusEksekutifDto, imgSrc);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.strukturPengurusEksekutifService.remove(id);
    }
}