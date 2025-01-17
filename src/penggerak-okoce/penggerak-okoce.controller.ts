import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { PenggerakOkoceService } from './penggerak-okoce.service';
import { PenggerakOkoce } from 'src/entities/penggerak-okoce.entity';
import { CreatePenggerakOkoceDto} from './dto/create-penggerak-okoce.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { UpdatePenggerakOkoceDto } from './dto/update-penggerak-okoce.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';

@Controller('penggerak-okoces')
@ApiTags('penggerak-okoces')
export class PenggerakOkoceController {
    constructor(private readonly penggerakOkoceService: PenggerakOkoceService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('penggerak-okoces')))
    @ApiOperation({ summary: 'Create a new PenggerakOkoce' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'namaPenggerak', 'deskripsiPenggerak'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
                },
                namaPenggerak: {
                    type: 'string',
                    description: 'Nama Penggerak',
                    example: 'John Doe',
                },
                deskripsiPenggerak: {
                    type: 'string',
                    description: 'Deskripsi Penggerak',
                    example: 'Deskripsi singkat tentang penggerak',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Tanggal publikasi (optional)',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createPenggerakOkoceDto: CreatePenggerakOkoceDto,
    ): Promise<PenggerakOkoce> {
        const imgSrc = getFileUrl('penggerak-okoces', file);
        return this.penggerakOkoceService.create(createPenggerakOkoceDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all PenggerakOkoces' })
    @ApiResponse({ status: 200, description: 'Returns all PenggerakOkoces' })
    async findAll(@Query() query: QueryDto): Promise<{ data: PenggerakOkoce[], total: number }> {
        return this.penggerakOkoceService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a PenggerakOkoce by ID' })
    @ApiParam({ name: 'id', description: 'PenggerakOkoce ID' })
    @ApiResponse({ status: 200, description: 'Returns the PenggerakOkoce' })
    async findOne(@Param('id') id: string): Promise<PenggerakOkoce> {
        return this.penggerakOkoceService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('penggerak-okoces')))
    @ApiOperation({ summary: 'Update a PenggerakOkoce by ID' })
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'PenggerakOkoce ID' })
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
                namaPenggerak: {
                    type: 'string',
                    description: 'Nama Penggerak',
                    example: 'John Doe',
                },
                deskripsiPenggerak: {
                    type: 'string',
                    description: 'Deskripsi Penggerak',
                    example: 'Deskripsi singkat tentang penggerak',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Tanggal publikasi (optional)',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updatePenggerakOkoceDto: UpdatePenggerakOkoceDto,
    ): Promise<PenggerakOkoce> {
        const imgSrc = getFileUrl('penggerak-okoces', file);
        return this.penggerakOkoceService.update(id, userId, updatePenggerakOkoceDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a PenggerakOkoce by ID' })
    @ApiParam({ name: 'id', description: 'PenggerakOkoce ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'PenggerakOkoce successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.penggerakOkoceService.remove(id);
    }
}
