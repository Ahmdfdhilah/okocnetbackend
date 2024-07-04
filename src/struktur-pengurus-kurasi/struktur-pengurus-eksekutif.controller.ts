import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { StrukturPengurusKurasiService } from './struktur-pengurus-eksekutif.service';
import { StrukturPengurusKurasi } from 'src/entities/struktur-pengurus-kurasi.entity';
import { CreateStrukturPengurusKurasiDto } from './dto/create-struktur-kurasi.dto';
import { UpdateStrukturPengurusKurasiDto } from './dto/update-struktur-kurasi.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('struktur-pengurus-kurasi')
@ApiTags('struktur-pengurus-kurasi')
export class StrukturPengurusKurasiController {
    constructor(private readonly strukturPengurusKurasiService: StrukturPengurusKurasiService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-kurasi')))
    @ApiOperation({ summary: 'Create a new StrukturPengurusKurasi' })
    @ApiBody({ type: CreateStrukturPengurusKurasiDto })
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createStrukturPengurusKurasiDto: CreateStrukturPengurusKurasiDto,
    ): Promise<StrukturPengurusKurasi> {
        const imgSrc = getFileUrl('struktur-pengurus-kurasi', file);
        return this.strukturPengurusKurasiService.create(createStrukturPengurusKurasiDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all StrukturPengurusKurasi' })
    @ApiResponse({ status: 200, description: 'Returns all StrukturPengurusKurasi' })
    async findAll(@Query() query: QueryDto): Promise<{ data: StrukturPengurusKurasi[], total: number }> {
        return this.strukturPengurusKurasiService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a StrukturPengurusKurasi by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusKurasi ID' })
    @ApiResponse({ status: 200, description: 'Returns the StrukturPengurusKurasi' })
    async findOne(@Param('id') id: string): Promise<StrukturPengurusKurasi> {
        return this.strukturPengurusKurasiService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-kurasi')))
    @ApiOperation({ summary: 'Update a StrukturPengurusKurasi by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusKurasi ID' })
    @ApiBody({ type: UpdateStrukturPengurusKurasiDto })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateStrukturPengurusKurasiDto: UpdateStrukturPengurusKurasiDto,
    ): Promise<StrukturPengurusKurasi> {
        const imgSrc = getFileUrl('struktur-pengurus-kurasi', file);
        return this.strukturPengurusKurasiService.update(id, userId, updateStrukturPengurusKurasiDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a StrukturPengurusKurasi by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusKurasi ID' })
    @ApiResponse({ status: 204, description: 'StrukturPengurusKurasi successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.strukturPengurusKurasiService.remove(id);
    }
}
