import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, HttpException, HttpStatus } from '@nestjs/common';
import { StrukturPengurusHarianService } from './struktur-pengurus-harian.service';
import { StrukturPengurusHarian } from 'src/entities/struktur-pengurus-harian.entity';
import { CreateStrukturPengurusHarianDto } from './dto/create-struktur-pengurus-harian.dto';
import { UpdateStrukturPengurusHarianDto } from './dto/update-struktur-pengurus-harian.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@ApiTags('Struktur Pengurus Harian')
@Controller('struktur-pengurus-harians')
export class StrukturPengurusHarianController {
    constructor(private readonly strukturPengurusHarianService: StrukturPengurusHarianService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-harians')))
    @ApiOperation({ summary: 'Create a new Struktur Pengurus Harian' })
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
        @Body() createStrukturPengurusHarianDto: CreateStrukturPengurusHarianDto,
    ): Promise<StrukturPengurusHarian> {
        if (!file) {
            throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }
        const imgSrc = getFileUrl('struktur-pengurus-harians', file);
        return this.strukturPengurusHarianService.create(createStrukturPengurusHarianDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Struktur Pengurus Harian' })
    @ApiResponse({ status: 200, description: 'Returns all Struktur Pengurus Harian', type: [StrukturPengurusHarian] })
    async findAll(@Query() query: QueryDto): Promise<{ data: StrukturPengurusHarian[], total: number }> {
        return this.strukturPengurusHarianService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Struktur Pengurus Harian by ID' })
    @ApiParam({ name: 'id', description: 'Struktur Pengurus Harian ID' })
    @ApiResponse({ status: 200, description: 'Returns the Struktur Pengurus Harian' })
    @ApiResponse({ status: 404, description: 'Struktur Pengurus Harian not found' })
    async findOne(@Param('id') id: string): Promise<StrukturPengurusHarian> {
        const strukturPengurusHarian = await this.strukturPengurusHarianService.findOne(id);
        if (!strukturPengurusHarian) {
            throw new HttpException('Struktur Pengurus Harian not found', HttpStatus.NOT_FOUND);
        }
        return strukturPengurusHarian;
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-harians')))
    @ApiOperation({ summary: 'Update a Struktur Pengurus Harian by ID' })
    @ApiParam({ name: 'id', description: 'Struktur Pengurus Harian ID' })
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
        @Body() updateStrukturPengurusHarianDto: UpdateStrukturPengurusHarianDto,
    ): Promise<StrukturPengurusHarian> {
        if (!file) {
            throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }
        const imgSrc = getFileUrl('struktur-pengurus-harians', file);
        const strukturPengurusHarian = await this.strukturPengurusHarianService.update(id, userId, updateStrukturPengurusHarianDto, imgSrc);
        if (!strukturPengurusHarian) {
            throw new HttpException('Struktur Pengurus Harian not found', HttpStatus.NOT_FOUND);
        }
        return strukturPengurusHarian;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Struktur Pengurus Harian by ID' })
    @ApiParam({ name: 'id', description: 'Struktur Pengurus Harian ID' })
    @ApiResponse({ status: 204, description: 'Struktur Pengurus Harian successfully deleted' })
    @ApiResponse({ status: 404, description: 'Struktur Pengurus Harian not found' })
    async remove(@Param('id') id: string): Promise<void> {
        await this.strukturPengurusHarianService.remove(id);
    }
}