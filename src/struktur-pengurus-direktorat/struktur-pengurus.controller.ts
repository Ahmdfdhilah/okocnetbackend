import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { StrukturPengurusService } from './struktur-pengurus.service';
import { StrukturPengurus } from 'src/entities/struktur-pengurus.entity';
import { CreateStrukturPengurusDto } from './dto/create-struktur-pengurus.dto';
import { UpdateStrukturPengurusDto } from './dto/update-struktur-pengurus.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('struktur-penguruses')
@ApiTags('struktur-penguruses')
export class StrukturPengurusController {
    constructor(private readonly strukturPengurusService: StrukturPengurusService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-penguruses')))
    @ApiOperation({ summary: 'Create a new StrukturPengurus' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'nama', 'jabatan', 'publishedAt', 'tipe'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
                },
                nama: {
                    type: 'string',
                    description: 'Nama',
                    example: 'John Doe',
                },
                jabatan: {
                    type: 'string',
                    description: 'Jabatan',
                    example: 'Ketua',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Tanggal publikasi',
                    example: '2024-07-03T04:48:57.000Z',
                },
                tipe: {
                    type: 'string',
                    enum: ['founder', 'eksekutif', 'harian', 'kurasi', 'pembina',  'direktorat'],
                    description: 'Tipe struktur pengurus',
                    example: 'eksekutif',
                },
            },
        },
    })
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createStrukturPengurusDto: CreateStrukturPengurusDto,
    ): Promise<StrukturPengurus> {
        const imgSrc = getFileUrl('struktur-penguruses', file);
        return this.strukturPengurusService.create(createStrukturPengurusDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all StrukturPengurus' })
    @ApiResponse({ status: 200, description: 'Returns all StrukturPengurus' })
    async findAll(@Query() query: QueryDto): Promise<{ data: StrukturPengurus[], total: number }> {
        return this.strukturPengurusService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a StrukturPengurus by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurus ID' })
    @ApiResponse({ status: 200, description: 'Returns the StrukturPengurus' })
    async findOne(@Param('id') id: string): Promise<StrukturPengurus> {
        return this.strukturPengurusService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-penguruses')))
    @ApiOperation({ summary: 'Update a StrukturPengurus by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurus ID' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
                },
                nama: {
                    type: 'string',
                    description: 'Nama',
                    example: 'John Doe',
                },
                jabatan: {
                    type: 'string',
                    description: 'Jabatan',
                    example: 'Ketua',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Tanggal publikasi',
                    example: '2024-07-03T04:48:57.000Z',
                },
                tipe: {
                    type: 'string',
                    enum: ['founder', 'eksekutif', 'harian', 'kurasi', 'pembina',  'direktorat'],
                    description: 'Tipe struktur pengurus',
                    example: 'eksekutif',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateStrukturPengurusDto: UpdateStrukturPengurusDto,
    ): Promise<StrukturPengurus> {
        const imgSrc = getFileUrl('struktur-penguruses', file);
        return this.strukturPengurusService.update(id, userId, updateStrukturPengurusDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a StrukturPengurus by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurus ID' })
    @ApiResponse({ status: 204, description: 'StrukturPengurus successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.strukturPengurusService.remove(id);
    }
}
