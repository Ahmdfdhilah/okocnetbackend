import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BeritaService } from './berita.service';
import { Berita } from 'src/entities/berita.entity';
import { QueryDto } from 'src/lib/query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';

@Controller('beritas')
export class BeritaController {
  constructor(private readonly beritaService: BeritaService) {}

  @Post(':userId')
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('beritas')))
  async create(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createBeritaDto: Partial<Berita>,
  ): Promise<Berita> {
    const imgSrc = getFileUrl('beritas', file);
    return this.beritaService.create(createBeritaDto, userId, imgSrc);
  }

  @Get()
  async findAll(@Query() query: QueryDto): Promise<{ beritas: Berita[], total: number }> {
    return this.beritaService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Berita> {
    return this.beritaService.findOne(id);
  }

  @Put(':id/:userId')
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('beritas')))
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBeritaDto: Partial<Berita>,
  ): Promise<Berita> {
    const imgSrc = getFileUrl('beritas', file);
    return this.beritaService.update(id, userId, updateBeritaDto, imgSrc);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.beritaService.remove(id);
  }
}