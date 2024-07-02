import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { PeluangUsahaService } from './peluang-usaha.service';
import { PeluangUsaha } from 'src/entities/peluang-usaha.entity';
import { CreatePeluangUsahaDto } from './dto/create-peluang-usaha.dto';
import { UpdatePeluangUsahaDto } from './dto/update-peluang-usaha.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';

@Controller('peluang-usahas')
export class PeluangUsahaController {
    constructor(private readonly peluangUsahaService: PeluangUsahaService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('peluang-usahas')))
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createPeluangUsahaDto: CreatePeluangUsahaDto,
    ): Promise<PeluangUsaha> {
        const imgSrc = getFileUrl('peluang-usahas', file);
        return this.peluangUsahaService.create(createPeluangUsahaDto, userId, imgSrc);
    }

    @Get()
    async findAll(@Body() query: QueryDto): Promise<{ peluangUsahas: PeluangUsaha[], total: number }> {
        return this.peluangUsahaService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<PeluangUsaha> {
        return this.peluangUsahaService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('peluang-usahas')))
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updatePeluangUsahaDto: UpdatePeluangUsahaDto,
    ): Promise<PeluangUsaha> {
        const imgSrc = getFileUrl('peluang-usahas', file);
        return this.peluangUsahaService.update(id, userId, updatePeluangUsahaDto, imgSrc);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.peluangUsahaService.remove(id);
    }
}