import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { PengurusService } from './pengurus.service';
import { Pengurus } from 'src/entities/pengurus.entity';
import { CreatePengurusDto } from './dto/create-pengurus.dto';
import { UpdatePengurusDto } from './dto/update-pengurus.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';

@Controller('penguruses')
export class PengurusController {
    constructor(private readonly pengurusService: PengurusService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('penguruses')))
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createPengurusDto: CreatePengurusDto,
    ): Promise<Pengurus> {
        const imgSrc = getFileUrl('penguruses', file);
        return this.pengurusService.create(createPengurusDto, userId, imgSrc);
    }

    @Get()
    async findAll(@Query() query: QueryDto): Promise<{ penguruses: Pengurus[], total: number }> {
        return this.pengurusService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<Pengurus> {
        return this.pengurusService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('penguruses')))
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updatePengurusDto: UpdatePengurusDto,
    ): Promise<Pengurus> {
        const imgSrc = getFileUrl('penguruses', file);
        return this.pengurusService.update(id, userId, updatePengurusDto, imgSrc);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.pengurusService.remove(id);
    }
}