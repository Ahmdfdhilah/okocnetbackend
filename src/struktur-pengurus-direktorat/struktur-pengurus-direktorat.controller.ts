import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { StrukturPengurusDirektoratService } from './struktur-pengurus-direktorat.service';
import { StrukturPengurusDirektorat } from 'src/entities/struktur-pengurus-direktorat.entity';
import { CreateStrukturPengurusDirektoratDto } from './dto/create-struktur-pengurus-direktorat.dto';
import { UpdateStrukturPengurusDirektoratDto } from './dto/update-struktur-pengurus-direktorat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';

@Controller('struktur-pengurus-direktorats')
export class StrukturPengurusDirektoratController {
    constructor(private readonly strukturPengurusDirektoratService: StrukturPengurusDirektoratService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('strukturpengurusdirektorats')))
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createStrukturPengurusDirektoratDto: CreateStrukturPengurusDirektoratDto,
    ): Promise<StrukturPengurusDirektorat> {
        const imgSrc = getFileUrl('strukturpengurusdirektorats', file);
        return this.strukturPengurusDirektoratService.create(createStrukturPengurusDirektoratDto, userId, imgSrc);
    }

    @Get()
    async findAll(@Query() query: QueryDto): Promise<{ strukturPengurusDirektorat: StrukturPengurusDirektorat[], total: number }> {
        return this.strukturPengurusDirektoratService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<StrukturPengurusDirektorat> {
        return this.strukturPengurusDirektoratService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('strukturpengurusdirektorats')))
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateStrukturPengurusDirektoratDto: UpdateStrukturPengurusDirektoratDto,
    ): Promise<StrukturPengurusDirektorat> {
        const imgSrc = getFileUrl('strukturpengurusdirektorats', file);
        return this.strukturPengurusDirektoratService.update(id, userId, updateStrukturPengurusDirektoratDto, imgSrc);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.strukturPengurusDirektoratService.remove(id);
    }
}
