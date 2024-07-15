import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { MitraService } from './mitra.service';
import { Mitra } from 'src/entities/mitra.entity';
import { CreateMitraDto } from './dto/create-mitra.dto';
import { UpdateMitraDto } from './dto/update-mitra.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('mitras')
@ApiTags('mitras')
export class MitraController {
    constructor(private readonly mitraService: MitraService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('mitras')))
    @ApiOperation({ summary: 'Create a new Mitra' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'publishedAt'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
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
        @Body() createMitraDto: CreateMitraDto,
    ): Promise<Mitra> {
        const imgSrc = getFileUrl('mitras', file);
        return this.mitraService.create(createMitraDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Mitra' })
    @ApiResponse({ status: 200, description: 'Returns all Mitra' })
    async findAll(): Promise<Mitra[]> {
        return this.mitraService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Mitra by ID' })
    @ApiParam({ name: 'id', description: 'Mitra ID' })
    @ApiResponse({ status: 200, description: 'Returns the Mitra' })
    async findOne(@Param('id') id: string): Promise<Mitra> {
        return this.mitraService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('mitras')))
    @ApiOperation({ summary: 'Update a Mitra by ID' })
    @ApiParam({ name: 'id', description: 'Mitra ID' })
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
        @Body() updateMitraDto: UpdateMitraDto,
    ): Promise<Mitra> {
        const imgSrc = getFileUrl('mitras', file);
        return this.mitraService.update(id, userId, updateMitraDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Mitra by ID' })
    @ApiParam({ name: 'id', description: 'Mitra ID' })
    @ApiResponse({ status: 204, description: 'Mitra successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.mitraService.remove(id);
    }
}