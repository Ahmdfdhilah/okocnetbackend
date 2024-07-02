import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { MagangService } from './magang.service';
import { Magang } from 'src/entities/magang.entity';
import { QueryDto } from 'src/lib/query.dto';
import { CreateMagangDto } from './dto/create-magang.dto';
import { UpdateMagangDto } from './dto/update-magang.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';

@Controller('magangs')
export class MagangController {
  constructor(private readonly magangService: MagangService) {}

  @Post(':userId')
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
  async findAll(@Query() query: QueryDto): Promise<{ magangs: Magang[], total: number }> {
    return this.magangService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Magang> {
    return this.magangService.findOne(id);
  }

  @Put(':id/:userId')
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
  async remove(@Param('id') id: string): Promise<void> {
    return this.magangService.remove(id);
  }
}