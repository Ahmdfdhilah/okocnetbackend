import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { BannerService } from './banner.service';
import { Banner } from 'src/entities/banner.entity';
import { CreateBannerDto } from './dto/create-banner.dto';
import { UpdateBannerDto } from './dto/update-banner.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('banners')
@ApiTags('banners')
export class BannerController {
    constructor(private readonly bannerService: BannerService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('banners')))
    @ApiOperation({ summary: 'Create a new Banner' })
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
        @Body() createBannerDto: CreateBannerDto,
    ): Promise<Banner> {
        const imgSrc = getFileUrl('banners', file);
        return this.bannerService.create(createBannerDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Banners' })
    @ApiResponse({ status: 200, description: 'Returns all Banners' })
    async findAll(@Query() query: QueryDto): Promise<Banner[]> {
        return this.bannerService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Banner by ID' })
    @ApiParam({ name: 'id', description: 'Banner ID' })
    @ApiResponse({ status: 200, description: 'Returns the Banner' })
    async findOne(@Param('id') id: string): Promise<Banner> {
        return this.bannerService.findOne(id);
    }
        
    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('banners')))
    @ApiOperation({ summary: 'Update a Banner by ID' })
    @ApiParam({ name: 'id', description: 'Banner ID' })
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
        @Body() updateBannerDto: UpdateBannerDto,
    ): Promise<Banner> {
        const imgSrc = getFileUrl('banners', file);
        return this.bannerService.update(id, userId, updateBannerDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Banner by ID' })
    @ApiParam({ name: 'id', description: 'Banner ID' })
    @ApiResponse({ status: 204, description: 'Banner successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.bannerService.remove(id);
    }
}
