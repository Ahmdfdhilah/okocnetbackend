import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { DonasiService } from './donasi.service';
import { Donasi } from 'src/entities/donasi.entity';
import { QueryDto } from 'src/lib/query.dto';
import { CreateDonasiDto } from './dto/create-donasi.dto';
import { UpdateDonasiDto } from './dto/update-donasi.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as fs from 'fs';

const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'public/upload/donasis';
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');
    cb(null, `${uuidv4()}${extname(file.originalname)}`);
  },
});

@Controller('donasis')
export class DonasiController {
  constructor(private readonly donasiService: DonasiService) {}

  @Post(':userId')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async create(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createDonasiDto: CreateDonasiDto
  ): Promise<Donasi> {
    return this.donasiService.create(createDonasiDto, userId, file.filename);
  }

  @Get()
  async findAll(@Query() query: QueryDto): Promise<{ donasis: Donasi[], total: number }> {
    return this.donasiService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Donasi> {
    return this.donasiService.findOne(id);
  }

  @Put(':id/:userId')
  @UseInterceptors(FileInterceptor('file', { storage }))
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDonasiDto: UpdateDonasiDto
  ): Promise<Donasi> {
    return this.donasiService.update(id, userId, updateDonasiDto, file?.filename);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.donasiService.remove(id);
  }
}