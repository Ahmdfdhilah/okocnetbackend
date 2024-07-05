import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, HttpException, HttpStatus } from '@nestjs/common';
import { StrukturPengurusKurasiService } from './struktur-pengurus-kurasi.service';
import { StrukturPengurusKurasi } from 'src/entities/struktur-pengurus-kurasi.entity';
import { CreateStrukturPengurusKurasiDto } from './dto/create-struktur-kurasi.dto';
import { UpdateStrukturPengurusKurasiDto } from './dto/update-struktur-kurasi.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('struktur-pengurus-kurasi')
@ApiTags('struktur-pengurus-kurasi')
export class StrukturPengurusKurasiController {
    constructor(private readonly strukturPengurusKurasiService: StrukturPengurusKurasiService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-kurasi')))
    @ApiOperation({ summary: 'Create a new StrukturPengurusKurasi' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'namaDewan', 'jabatanDewan', 'publishedAt'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
                },
                namaDewan: {
                    type: 'string',
                    description: 'Nama Dewan',
                    example: 'Ami',
                },
                jabatanDewan: {
                    type: 'string',
                    description: 'Jabatan Dewan',
                    example: 'Dir',
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
        @Body() createStrukturPengurusKurasiDto: CreateStrukturPengurusKurasiDto,
    ): Promise<StrukturPengurusKurasi> {
        if (!file) {
            throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }
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
                namaDewan: {
                    type: 'string',
                    description: 'Nama Dewan',
                    example: 'Ami',
                },
                jabatanDewan: {
                    type: 'string',
                    description: 'Jabatan Dewan',
                    example: 'Dir',
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
        @Body() updateStrukturPengurusKurasiDto: UpdateStrukturPengurusKurasiDto,
    ): Promise<StrukturPengurusKurasi> {
        if (!file) {
            throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }
        const imgSrc = getFileUrl('struktur-pengurus-kurasi', file);
        return this.strukturPengurusKurasiService.update(id, userId, updateStrukturPengurusKurasiDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a StrukturPengurusKurasi by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusKurasi ID' })
    async remove(@Param('id') id: string): Promise<void> {
        await this.strukturPengurusKurasiService.remove(id);
    }
}