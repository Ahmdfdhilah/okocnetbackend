import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { PenggerakOkoceService } from './penggerak-okoce.service';
import { PenggerakOkoce } from 'src/entities/penggerak-okoce.entity';
import { CreatePenggerakOkoceDto } from './dto/create-penggerak-okoce.dto';
import { UpdatePenggerakOkoceDto } from './dto/update-penggerak-okoce.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';

@Controller('penggerak-okoces')
export class PenggerakOkoceController {
    constructor(private readonly penggerakOkoceService: PenggerakOkoceService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('penggerak-okoces')))
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createPenggerakOkoceDto: CreatePenggerakOkoceDto,
    ): Promise<PenggerakOkoce> {
        const imgSrc = getFileUrl('penggerak-okoces', file);
        return this.penggerakOkoceService.create(createPenggerakOkoceDto, userId, imgSrc);
    }

    @Get()
    async findAll(@Query() query: QueryDto): Promise<{ penggerakOkoces: PenggerakOkoce[], total: number }> {
        return this.penggerakOkoceService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<PenggerakOkoce> {
        return this.penggerakOkoceService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('penggerak-okoces')))
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updatePenggerakOkoceDto: UpdatePenggerakOkoceDto,
    ): Promise<PenggerakOkoce> {
        const imgSrc = getFileUrl('penggerak-okoces', file);
        return this.penggerakOkoceService.update(id, userId, updatePenggerakOkoceDto, imgSrc);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.penggerakOkoceService.remove(id);
    }
}