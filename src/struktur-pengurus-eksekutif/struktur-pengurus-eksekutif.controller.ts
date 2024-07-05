import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { StrukturPengurusEksekutifService } from './struktur-pengurus-eksekutif.service';
import { StrukturPengurusEksekutif } from 'src/entities/struktur-pengurus-eksekutif.entity';
import { CreateStrukturPengurusEksekutifDto } from './dto/create-struktur-eksekutif.dto';
import { UpdateStrukturPengurusEksekutifDto } from './dto/update-struktur-eksekutif.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('struktur-pengurus-eksekutifs')
@ApiTags('struktur-pengurus-eksekutifs')
export class StrukturPengurusEksekutifController {
    constructor(private readonly strukturPengurusEksekutifService: StrukturPengurusEksekutifService) {}

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-eksekutif')))
    @ApiOperation({ summary: 'Create a new StrukturPengurusEksekutif' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'namaPengurus', 'jabatanPengurus', 'publishedAt'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
                },
                namaPengurus: {
                    type: 'string',
                    description: 'Nama Pengurus',
                    example: 'John Doe',
                },
                jabatanPengurus: {
                    type: 'string',
                    description: 'Jabatan Pengurus',
                    example: 'Ketua',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Tanggal publikasi',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createStrukturPengurusEksekutifDto: CreateStrukturPengurusEksekutifDto,
    ): Promise<StrukturPengurusEksekutif> {
        const imgSrc = getFileUrl('struktur-pengurus-eksekutif', file);
        return this.strukturPengurusEksekutifService.create(createStrukturPengurusEksekutifDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all StrukturPengurusEksekutif' })
    @ApiResponse({ status: 200, description: 'Returns all StrukturPengurusEksekutif' })
    async findAll(@Query() query: QueryDto): Promise<{ data: StrukturPengurusEksekutif[], total: number }> {
        return this.strukturPengurusEksekutifService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a StrukturPengurusEksekutif by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusEksekutif ID' })
    @ApiResponse({ status: 200, description: 'Returns the StrukturPengurusEksekutif' })
    async findOne(@Param('id') id: string): Promise<StrukturPengurusEksekutif> {
        return this.strukturPengurusEksekutifService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-eksekutif')))
    @ApiOperation({ summary: 'Update a StrukturPengurusEksekutif by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusEksekutif ID' })
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
                namaPengurus: {
                    type: 'string',
                    description: 'Nama Pengurus',
                    example: 'John Doe',
                },
                jabatanPengurus: {
                    type: 'string',
                    description: 'Jabatan Pengurus',
                    example: 'Ketua',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Tanggal publikasi',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateStrukturPengurusEksekutifDto: UpdateStrukturPengurusEksekutifDto,
    ): Promise<StrukturPengurusEksekutif> {
        const imgSrc = getFileUrl('struktur-pengurus-eksekutif', file);
        return this.strukturPengurusEksekutifService.update(id, userId, updateStrukturPengurusEksekutifDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a StrukturPengurusEksekutif by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusEksekutif ID' })
    @ApiResponse({ status: 204, description: 'StrukturPengurusEksekutif successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.strukturPengurusEksekutifService.remove(id);
    }
}