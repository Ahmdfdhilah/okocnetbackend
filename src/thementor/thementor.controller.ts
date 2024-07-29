import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { ThementorService } from './thementor.service';
import { Thementor } from '../entities/thementor.entity';
import { CreateThementorDto } from './dto/create-thementor.dto';
import { UpdateThementorDto } from './dto/update-thementor.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrls } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('thementors')
@ApiTags('thementors')
export class ThementorController {
    constructor(private readonly thementorService: ThementorService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions('thementors')))
    @ApiOperation({ summary: 'Create a new Thementor' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['files', 'judul', 'deskripsi', 'publishedAt'],
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
                judul: {
                    type: 'string',
                    description: 'Judul Thementor',
                    example: 'Nama Thementor',
                },
                deskripsi: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    description: 'Deskripsi Thementor',
                    example: ['Deskripsi bagian 1', 'Deskripsi bagian 2'],
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
        @UploadedFiles() files: Express.Multer.File[],
        @Body() createThementorDto: CreateThementorDto,
    ): Promise<Thementor> {
        const fileUrls = getFileUrls('thementors', files);
        return this.thementorService.create(createThementorDto, fileUrls);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Thementors' })
    @ApiResponse({ status: 200, description: 'Returns all Thementors' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Thementor[], total: number }> {
        return this.thementorService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Thementor by ID' })
    @ApiParam({ name: 'id', description: 'Thementor ID' })
    @ApiResponse({ status: 200, description: 'Returns the Thementor' })
    async findOne(@Param('id') id: string): Promise<Thementor> {
        return this.thementorService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions('thementors')))
    @ApiOperation({ summary: 'Update a Thementor by ID' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id', description: 'Thementor ID' })
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
                judul: {
                    type: 'string',
                    description: 'Judul Thementor',
                    example: 'Nama Thementor',
                },
                deskripsi: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    description: 'Deskripsi Thementor',
                    example: ['Deskripsi bagian 1', 'Deskripsi bagian 2'],
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Tanggal publikasi',
                    example: '2024-07-03T04:48:57.000Z',
                },
                existingDokumentasi: {
                    type: 'array',
                    items: {
                        type: 'string',
                    },
                    description: 'Existing file URLs',
                    example: ['https://link-to-existing-file1.jpg', 'https://link-to-existing-file2.jpg'],
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() updateThementorDto: UpdateThementorDto,
    ): Promise<Thementor> {
        let fileUrls = updateThementorDto.existingDokumentasi || [];

        if (files.length > 0) {
            const newFileUrls = getFileUrls('thementors', files);
            fileUrls = fileUrls.concat(newFileUrls);
        }

        return this.thementorService.update(id, updateThementorDto, fileUrls);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Thementor by ID' })
    @ApiParam({ name: 'id', description: 'Thementor ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Thementor successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.thementorService.remove(id);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id/dokumentasi')
    @ApiOperation({ summary: 'Delete a Dokumentasi from Thementor by ID' })
    @ApiParam({ name: 'id', description: 'Thementor ID' })
    @ApiParam({ name: 'dokumentasiUrl', description: 'Dokumentasi URL' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Dokumentasi successfully deleted' })
    async deleteDokumentasi(
        @Param('id') id: string,
        @Query('dokumentasiUrl') dokumentasiUrl: string,
    ): Promise<void> {
        return this.thementorService.deleteDokumentasi(id, dokumentasiUrl);
    }
}
