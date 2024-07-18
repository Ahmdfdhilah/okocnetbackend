import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { BannerService } from './banner.service';
import { Banner } from 'src/entities/banner.entity';
import { BannerDto } from './dto/banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('banners')
@ApiTags('banners')
export class BannerController {
    constructor(private readonly bannerService: BannerService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('banners')))
    @ApiOperation({ summary: 'Create a new Banner' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file'],
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
        @Body() createBannerDto: BannerDto,
    ): Promise<Banner> {
        const imgSrc = getFileUrl('banners', file);
        return this.bannerService.create(createBannerDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Banners' })
    @ApiResponse({ status: 200, description: 'Returns all Banners' })
    async findAll(): Promise<Banner[]> {
        return this.bannerService.findAll();
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put('reorder')
    @ApiOperation({ summary: 'Reorder Banners' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            required: ['banners'],
            properties: {
                banners: {
                    type: 'array',
                    items: {
                        type: 'object',
                        properties: {
                            id: { type: 'string' },
                            order: { type: 'integer' },
                        },
                    },
                },
            },
        },
    })
    async reorderBanners(@Body('banners') banners: { id: string, order: number }[]): Promise<void> {
        await this.bannerService.reorderBanners(banners);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Banner by ID' })
    @ApiParam({ name: 'id', description: 'Banner ID' })
    @ApiResponse({ status: 200, description: 'Returns the Banner' })
    async findOne(@Param('id') id: string): Promise<Banner> {
        return this.bannerService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Banner by ID' })
    @ApiParam({ name: 'id', description: 'Banner ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Banner successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        await this.bannerService.remove(id);
    }
}