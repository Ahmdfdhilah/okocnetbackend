import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MagangService } from './magang.service';
import { Magang } from 'src/entities/magang.entity';
import { QueryDto } from 'src/lib/query.dto';
import { CreateMagangDto } from './dto/create-magang.dto';
import { UpdateMagangDto } from './dto/update-magang.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('magangs')
@ApiTags('magangs')
export class MagangController {
  constructor(private readonly magangService: MagangService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new Magang' })
  @ApiBody({ type: CreateMagangDto })
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('magangs')))
  async create(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createMagangDto: CreateMagangDto,
  ): Promise<Magang> {
    const imgSrc = getFileUrl('magangs', file);
    return this.magangService.create(createMagangDto, userId, imgSrc);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Magangs' })
  @ApiResponse({ status: 200, description: 'Returns all Magangs' })
  async findAll(@Query() query: QueryDto): Promise<{ magangs: Magang[], total: number }> {
    return this.magangService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Magang by ID' })
  @ApiParam({ name: 'id', description: 'Magang ID' })
  @ApiResponse({ status: 200, description: 'Returns the Magang' })
  async findOne(@Param('id') id: string): Promise<Magang> {
    return this.magangService.findOne(id);
  }

  @Put(':id/:userId')
  @ApiOperation({ summary: 'Update a Magang by ID' })
  @ApiParam({ name: 'id', description: 'Magang ID' })
  @ApiBody({ type: UpdateMagangDto })
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('magangs')))
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMagangDto: UpdateMagangDto,
  ): Promise<Magang> {
    const imgSrc = getFileUrl('magangs', file);
    return this.magangService.update(id, userId, updateMagangDto, imgSrc);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Magang by ID' })
  @ApiParam({ name: 'id', description: 'Magang ID' })
  @ApiResponse({ status: 204, description: 'Magang successfully deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.magangService.remove(id);
  }
}