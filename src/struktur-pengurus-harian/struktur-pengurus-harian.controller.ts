import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    UseInterceptors,
    UploadedFile,
    Query,
} from '@nestjs/common';
import { StrukturPengurusHarianService } from './struktur-pengurus-harian.service';
import { StrukturPengurusHarian } from 'src/entities/struktur-pengurus-harian.entity';
import { CreateStrukturPengurusHarianDto } from './dto/create-struktur-pengurus-harian.dto';
import { UpdateStrukturPengurusHarianDto } from './dto/update-struktur-pengurus-harian.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';

@Controller('struktur-pengurus-harians')
export class StrukturPengurusHarianController {
    constructor(private readonly strukturPengurusHarianService: StrukturPengurusHarianService) {}

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-harians')))
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createStrukturPengurusHarianDto: CreateStrukturPengurusHarianDto,
    ): Promise<StrukturPengurusHarian> {
        const imgSrc = getFileUrl('strukturpengurusharians', file);
        return this.strukturPengurusHarianService.create(createStrukturPengurusHarianDto, userId, imgSrc);
    }

    @Get()
    async findAll(@Query() query: QueryDto): Promise<{ strukturPengurusHarian: StrukturPengurusHarian[], total: number }> {
        return this.strukturPengurusHarianService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<StrukturPengurusHarian> {
        return this.strukturPengurusHarianService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-harians')))
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateStrukturPengurusHarianDto: UpdateStrukturPengurusHarianDto,
    ): Promise<StrukturPengurusHarian> {
        const imgSrc = getFileUrl('strukturpengurusharians', file);
        return this.strukturPengurusHarianService.update(id, userId, updateStrukturPengurusHarianDto, imgSrc);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.strukturPengurusHarianService.remove(id);
    }
}