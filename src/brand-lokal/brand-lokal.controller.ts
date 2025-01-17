import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { BrandLokalService } from './brand-lokal.service';
import { BrandLokal } from 'src/entities/brand-lokal.entity';
import { QueryDto } from 'src/lib/query.dto';
import { CreateBrandLokalDto } from './dto/create-brand-lokal.dto';
import { UpdateBrandLokalDto } from './dto/update-brand-lokal.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';

@Controller('brand-lokals')
@ApiTags('brand-lokals')
export class BrandLokalController {
  constructor(private readonly brandLokalService: BrandLokalService) { }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':userId')
  @ApiOperation({ summary: 'Create a new Brand Lokal' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      required: ['judulBrand', 'deskripsiBrand', 'publishedAt', 'file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File upload',
          example: 'file.jpg',
        },
        judulBrand: { type: 'string', example: 'Brand Lokal' },
        deskripsiBrand: { type: 'string', example: 'Deskripsi Brand Lokal' },
        publishedAt: { type: 'string', format: 'date-time', example: '2024-07-03T04:48:57.000Z' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('brand-lokals')))
  async create(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createBrandLokalDto: CreateBrandLokalDto
  ): Promise<BrandLokal> {
    const imgSrc = getFileUrl('brand-lokals', file);
    return this.brandLokalService.create(createBrandLokalDto, userId, imgSrc);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Brand Lokals' })
  @ApiResponse({ status: 200, description: 'Returns all Brand Lokals' })
  async findAll(@Query() query: QueryDto): Promise<{ data: BrandLokal[], total: number }> {
    return this.brandLokalService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Brand Lokal by ID' })
  @ApiParam({ name: 'id', description: 'Brand Lokal ID' })
  @ApiResponse({ status: 200, description: 'Returns the Brand Lokal' })
  async findOne(@Param('id') id: string): Promise<BrandLokal> {
    return this.brandLokalService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id/:userId')
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update a Brand Lokal by ID' })
  @ApiParam({ name: 'id', description: 'Brand Lokal ID' })
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
        judulBrand: { type: 'string', example: 'Brand Lokal' },
        deskripsiBrand: { type: 'string', example: 'Deskripsi Brand Lokal' },
        publishedAt: { type: 'string', format: 'date-time', example: '2024-07-03T04:48:57.000Z' },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('brand-lokals')))
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBrandLokalDto: UpdateBrandLokalDto
  ): Promise<BrandLokal> {
    const imgSrc = getFileUrl('brand-lokals', file);
    return this.brandLokalService.update(id, userId, updateBrandLokalDto, imgSrc);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a Brand Lokal by ID' })
  @ApiParam({ name: 'id', description: 'Brand Lokal ID' })
  @ApiResponse({ status: 204, description: 'Brand Lokal successfully deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.brandLokalService.remove(id);
  }
}