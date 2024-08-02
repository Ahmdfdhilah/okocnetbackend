import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { MitraService } from './mitra.service';
import { Mitra } from 'src/entities/mitra.entity';
import { CreateMitraDto } from './dto/create-mitra.dto';
import { UpdateMitraDto } from './dto/update-mitra.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { QueryDto } from 'src/lib/query.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('mitras')
@ApiTags('mitras')
export class MitraController {
    constructor(private readonly mitraService: MitraService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('mitras')))
    @ApiOperation({ summary: 'Create a new Mitra' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'publishedAt', 'nama', 'tipe'], // Add 'tipe' to required fields
            properties: {
                nama: {
                    type: 'string',
                    format: 'text',
                    description: 'Nama mitra',
                    example: 'mitra okoce',
                },
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
                tipe: {
                    type: 'string',
                    enum: ['swasta', 'pendidikan', 'pemerintah'], 
                    description: 'Tipe mitra',
                    example: 'swasta',
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
    async findAll(@Query() query: QueryDto): Promise<{ data: Mitra[], total: number }> {
        return this.mitraService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Mitra by ID' })
    @ApiParam({ name: 'id', description: 'Mitra ID' })
    @ApiResponse({ status: 200, description: 'Returns the Mitra' })
    async findOne(@Param('id') id: string): Promise<Mitra> {
        return this.mitraService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('mitras')))
    @ApiOperation({ summary: 'Update a Mitra by ID' })
    @ApiParam({ name: 'id', description: 'Mitra ID' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nama: {
                    type: 'string',
                    format: 'text',
                    description: 'Nama mitra',
                    example: 'mitra okoce',
                },
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
                tipe: {
                    type: 'string',
                    enum: ['swasta', 'pendidikan', 'pemerintah'], 
                    description: 'Tipe mitra',
                    example: 'swasta',
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

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Mitra by ID' })
    @ApiParam({ name: 'id', description: 'Mitra ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Mitra successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.mitraService.remove(id);
    }
}