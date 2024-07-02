import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BrandLokalService } from './brand-lokal.service';
import { BrandLokal } from 'src/entities/brand-lokal.entitiy';
import { QueryDto } from 'src/lib/query.dto';
import { CreateBrandLokalDto } from './dto/create-brand-lokal.dto';
import { UpdateBrandLokalDto } from './dto/update-brand-lokal.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as fs from 'fs';

const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/upload/brand-lokal';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    cb(null, `${uuidv4()}${extname(file.originalname)}`);
  },
});

@Controller('brand-lokals')
export class BrandLokalController {
  constructor(private readonly brandLokalService: BrandLokalService) {}

  @Post(':userId')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async create(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createBrandLokalDto: CreateBrandLokalDto
  ): Promise<BrandLokal> {
    return this.brandLokalService.create(createBrandLokalDto, userId, file.filename);
  }

  @Get()
  async findAll(@Query() query: QueryDto): Promise<{ brandLokals: BrandLokal[], total: number }> {
    return this.brandLokalService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<BrandLokal> {
    return this.brandLokalService.findOne(id);
  }

  @Put(':id/:userId')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBrandLokalDto: UpdateBrandLokalDto
  ): Promise<BrandLokal> {
    return this.brandLokalService.update(id, userId, updateBrandLokalDto, file?.filename);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.brandLokalService.remove(id);
  }
}