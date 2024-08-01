import { Controller, Get, Post, Put, Delete, Param, Body, Query, UseGuards, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { AllBannerService } from './all-banners.service'; 
import { AllBanner } from '../entities/all-banner.entity';
import { CreateAllBannerDto } from './dto/create-all-banners.dto'; 
import { UpdateAllBannerDto } from './dto/update-all-banners.dto'; 
import { FilesInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrls } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('all-banners')
@ApiTags('all-banners')
export class AllBannerController {
    constructor(private readonly allBannerService: AllBannerService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions('all-banners')))
    @ApiOperation({ summary: 'Create a new AllBanner' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['files', 'nama'],
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
                nama: {
                    type: 'string',
                    description: 'Nama AllBanner',
                    example: 'Nama AllBanner',
                },
            },
        },
    })
    async create(
        @UploadedFiles() files: Express.Multer.File[],
        @Body() createAllBannerDto: CreateAllBannerDto,
    ): Promise<AllBanner> {
        const fileUrls = getFileUrls('all-banners', files);
        return this.allBannerService.create(createAllBannerDto, fileUrls);
    }

    @Get()
    @ApiOperation({ summary: 'Get all AllBanners' })
    @ApiResponse({ status: 200, description: 'Returns all AllBanners' })
    async findAll(@Query() query: QueryDto): Promise<{ data: AllBanner[], total: number }> {
        return this.allBannerService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an AllBanner by ID' })
    @ApiParam({ name: 'id', description: 'AllBanner ID' })
    @ApiResponse({ status: 200, description: 'Returns the AllBanner' })
    async findOne(@Param('id') id: string): Promise<AllBanner> {
        return this.allBannerService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    @UseInterceptors(FilesInterceptor('files', 10, fileUploadOptions('all-banners')))
    @ApiOperation({ summary: 'Update an AllBanner by ID' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id', description: 'AllBanner ID' })
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
                nama: {
                    type: 'string',
                    description: 'Nama AllBanner',
                    example: 'Nama AllBanner',
                },
                existingFotos: {
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
        @Body() updateAllBannerDto: UpdateAllBannerDto,
    ): Promise<AllBanner> {
        let fileUrls = updateAllBannerDto.existingFotos || [];

        if (files.length > 0) {
            const newFileUrls = getFileUrls('all-banners', files);
            fileUrls = fileUrls.concat(newFileUrls);
        }

        return this.allBannerService.update(id, updateAllBannerDto, fileUrls);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete an AllBanner by ID' })
    @ApiParam({ name: 'id', description: 'AllBanner ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'AllBanner successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.allBannerService.remove(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id/foto')
    @ApiOperation({ summary: 'Delete a Foto from AllBanner by ID' })
    @ApiParam({ name: 'id', description: 'AllBanner ID' })
    @ApiParam({ name: 'fotoUrl', description: 'Foto URL' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Foto successfully deleted' })
    async deleteFoto(
        @Param('id') id: string,
        @Query('fotoUrl') fotoUrl: string,
    ): Promise<void> {
        return this.allBannerService.deleteFoto(id, fotoUrl);
    }
}
