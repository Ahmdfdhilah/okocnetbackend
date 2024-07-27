// src/sosmed/sosmed.controller.ts
import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SosmedService } from './sosmed.service';
import { Sosmed } from 'src/entities/sosmed.entity';
import { CreateSosmedDto } from './dto/create-sosmed.dto';
import { UpdateSosmedDto } from './dto/update-sosmed.dto';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('sosmeds')
@Controller('sosmeds')
export class SosmedController {
    constructor(private readonly sosmedService: SosmedService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('sosmeds')))
    @ApiOperation({ summary: 'Create a new Sosmed' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['link', 'nama'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
                },
                link: {
                    type: 'string',
                    description: 'Link URL for social media.',
                    example: 'https://twitter.com/johndoe',
                },
                nama: {
                    type: 'string',
                    enum: ['whatsapp', 'instagram', 'twitter', 'facebook', 'tiktok', 'youtube'],
                    description: 'Name of the social media platform.',
                    example: 'Twitter',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Date of publication for the social media entry.',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createSosmedDto: CreateSosmedDto,
    ): Promise<Sosmed> {
        const imgSrc = getFileUrl('sosmeds', file);
        return this.sosmedService.create(createSosmedDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Sosmeds' })
    @ApiResponse({ status: 200, description: 'Returns all Sosmeds' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Sosmed[], total: number }> {
        return this.sosmedService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Sosmed by ID' })
    @ApiParam({ name: 'id', description: 'Sosmed ID' })
    @ApiResponse({ status: 200, description: 'Returns the Sosmed' })
    async findOne(@Param('id') id: string): Promise<Sosmed> {
        return this.sosmedService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('sosmeds')))
    @ApiOperation({ summary: 'Update a Sosmed by ID' })
    @ApiParam({ name: 'id', description: 'Sosmed ID' })
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
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
                link: {
                    type: 'string',
                    description: 'Link URL for social media.',
                    example: 'https://twitter.com/johndoe',
                },
                nama: {
                    type: 'string',
                    enum: ['whatsapp', 'instagram', 'twitter', 'facebook', 'tiktok'],
                    description: 'Name of the social media platform.',
                    example: 'Twitter',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Date of publication for the social media entry.',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateSosmedDto: UpdateSosmedDto,
    ): Promise<Sosmed> {
        const imgSrc = getFileUrl('sosmeds', file);
        return this.sosmedService.update(id, userId, updateSosmedDto, imgSrc);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a Sosmed by ID' })
    @ApiParam({ name: 'id', description: 'Sosmed ID' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.sosmedService.remove(id);
    }
}