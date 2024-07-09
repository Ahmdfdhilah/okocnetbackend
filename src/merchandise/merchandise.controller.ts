import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFiles, Query } from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';
import { Merchandise } from 'src/entities/merchandise.entity';
import { CreateMerchandiseDto } from './dto/create-merchandise.dto';
import { UpdateMerchandiseDto } from './dto/update-merchandise.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrls } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('merchandises')
@ApiTags('merchandises')
export class MerchandiseController {
    constructor(private readonly merchandiseService: MerchandiseService) { }

    @Post(':userId')
    @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions('merchandises')))
    @ApiOperation({ summary: 'Create a new Merchandise' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['files', 'judulMerchandise', 'deskripsiMerchandise', 'hargaMerchandise', 'stockMerchandise', 'linkMerchandise', 'publishedAt'],
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'File uploads',
                    example: ['file1.jpg', 'file2.jpg'],
                },
                judulMerchandise: {
                    type: 'string',
                    description: 'Judul Merchandise',
                    example: 'Nama Merchandise',
                },
                deskripsiMerchandise: {
                    type: 'string',
                    description: 'Deskripsi Merchandise',
                    example: 'Deskripsi singkat tentang merchandise',
                },
                hargaMerchandise: {
                    type: 'number',
                    description: 'Harga Merchandise',
                    example: '100000',
                },
                stockMerchandise: {
                    type: 'string',
                    description: 'Stock Merchandise',
                    example: '10',
                },
                linkMerchandise: {
                    type: 'string',
                    description: 'Link Merchandise',
                    example: 'https://link-merchandise.com',
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
        @UploadedFiles() files: Express.Multer.File[],
        @Body() createMerchandiseDto: CreateMerchandiseDto,
    ): Promise<Merchandise> {
        const imgSrcs = getFileUrls('merchandises', files);
        return this.merchandiseService.create(createMerchandiseDto, userId, imgSrcs);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Merchandises' })
    @ApiResponse({ status: 200, description: 'Returns all Merchandises' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Merchandise[], total: number }> {
        return this.merchandiseService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Merchandise by ID' })
    @ApiParam({ name: 'id', description: 'Merchandise ID' })
    @ApiResponse({ status: 200, description: 'Returns the Merchandise' })
    async findOne(@Param('id') id: string): Promise<Merchandise> {
        return this.merchandiseService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions('merchandises')))
    @ApiOperation({ summary: 'Update a Merchandise by ID' })
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id', description: 'Merchandise ID' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                files: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                    description: 'File uploads',
                    example: ['file1.jpg', 'file2.jpg'],
                },
                judulMerchandise: {
                    type: 'string',
                    description: 'Judul Merchandise',
                    example: 'Nama Merchandise',
                },
                deskripsiMerchandise: {
                    type: 'string',
                    description: 'Deskripsi Merchandise',
                    example: 'Deskripsi singkat tentang merchandise',
                },
                hargaMerchandise: {
                    type: 'string',
                    description: 'Harga Merchandise',
                    example: 'Rp 100.000',
                },
                stockMerchandise: {
                    type: 'string',
                    description: 'Stock Merchandise',
                    example: '10',
                },
                linkMerchandise: {
                    type: 'string',
                    description: 'Link Merchandise',
                    example: 'https://link-merchandise.com',
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
        @UploadedFiles() files: Express.Multer.File[],
        @Body() updateMerchandiseDto: UpdateMerchandiseDto,
    ): Promise<Merchandise> {
        const imgSrcs = files.length > 0 ? getFileUrls('merchandises', files) : undefined;
        return this.merchandiseService.update(id, updateMerchandiseDto, userId, imgSrcs);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Merchandise by ID' })
    @ApiParam({ name: 'id', description: 'Merchandise ID' })
    @ApiResponse({ status: 204, description: 'Merchandise successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.merchandiseService.remove(id);
    }
}
