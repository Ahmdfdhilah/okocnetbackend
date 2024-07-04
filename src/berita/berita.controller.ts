import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { BeritaService } from './berita.service';
import { Berita } from 'src/entities/berita.entity';
import { QueryDto } from 'src/lib/query.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { CreateBeritaDto } from './dto/create-berita.dto';
import { UpdateBeritaDto } from './dto/update-berita.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('beritas')
@ApiTags('beritas')
export class BeritaController {
  constructor(private readonly beritaService: BeritaService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new Berita' })
  @ApiBody({ type: CreateBeritaDto })
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('beritas')))
  async create(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createBeritaDto: CreateBeritaDto,
  ): Promise<Berita> {
    const imgSrc = getFileUrl('beritas', file);
    return this.beritaService.create(createBeritaDto, userId, imgSrc);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Beritas' })
  @ApiResponse({ status: 200, description: 'Returns all Beritas' })
  async findAll(@Query() query: QueryDto): Promise<{ data: Berita[], total: number }> {
    return this.beritaService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Berita by ID' })
  @ApiParam({ name: 'id', description: 'Berita ID' })
  @ApiResponse({ status: 200, description: 'Returns the Berita' })
  async findOne(@Param('id') id: string): Promise<Berita> {
    return this.beritaService.findOne(id);
  }

  @Put(':id/:userId')
  @ApiOperation({ summary: 'Update a Berita by ID' })
  @ApiParam({ name: 'id', description: 'Berita ID' })
  @ApiBody({ type: UpdateBeritaDto })
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('beritas')))
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBeritaDto: UpdateBeritaDto,
  ): Promise<Berita> {
    const imgSrc = getFileUrl('beritas', file);
    return this.beritaService.update(id, userId, updateBeritaDto, imgSrc);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Berita by ID' })
  @ApiParam({ name: 'id', description: 'Berita ID' })
  @ApiResponse({ status: 204, description: 'Berita successfully deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.beritaService.remove(id);
  }
}
