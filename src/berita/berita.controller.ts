import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseInterceptors, UploadedFiles, HttpException, HttpStatus } from '@nestjs/common';
import { BeritaService } from './berita.service';
import { Berita } from 'src/entities/berita.entity';
import { QueryDto } from 'src/lib/query.dto';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { CreateBeritaDto } from './dto/create-berita.dto';
import { UpdateBeritaDto } from './dto/update-berita.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('beritas')
@ApiTags('beritas')
export class BeritaController {
  constructor(private readonly beritaService: BeritaService) { }

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new Berita' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'file2', 'judulBerita', 'deskripsiBerita', 'tanggalBerita', 'authorBerita', 'editorBerita', 'publishedAt'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File upload',
          example: 'file.jpg',
        },
        file2: {
          type: 'string',
          format: 'binary',
          description: 'File upload',
          example: 'file2.jpg',
        },
        judulBerita: { type: 'string', example: 'Judul Berita', description: 'Judul dari berita' },
        deskripsiBerita: { type: 'array', items: { type: 'string' }, example: ['Deskripsi 1', 'Deskripsi 2'], description: 'Deskripsi dari berita' },
        tanggalBerita: { type: 'string', example: '2024-07-03', description: 'Tanggal berita' },
        authorBerita: { type: 'string', example: 'John Doe', description: 'Penulis berita' },
        editorBerita: { type: 'string', example: 'Jane Doe', description: 'Editor berita' },
        publishedAt: { type: 'string', example: '2024-07-03T04:48:57.000Z', description: 'Tanggal dipublikasikan' },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([
    { name: "file" , maxCount:1},
    { name: "file2" , maxCount:1}
  ], fileUploadOptions('beritas')))
  async create(
    @Param('userId') userId: string,
    @UploadedFiles() files: {file: Express.Multer.File, file2: Express.Multer.File},
    @Body() createBeritaDto: CreateBeritaDto,
  ): Promise<Berita> {
    const fotoBerita = getFileUrl('beritas', files.file);
    const fotoContent = getFileUrl('beritas', files.file2);
    try {
      return this.beritaService.create(createBeritaDto, userId, fotoBerita, fotoContent);
    } catch (error) {
      console.error('Create Berita - Error:', error);
      throw new HttpException('Failed to create Berita', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all Beritas' })
  @ApiResponse({ status: 200, description: 'Returns all Beritas' })
  async findAll(@Query() query: QueryDto): Promise<{ data: Berita[], total: number }> {
    console.log('Find All Beritas - query:', query);
    return this.beritaService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Berita by ID' })
  @ApiParam({ name: 'id', description: 'Berita ID' })
  @ApiResponse({ status: 200, description: 'Returns the Berita' })
  async findOne(@Param('id') id: string): Promise<Berita> {
    console.log('Find One Berita - id:', id);
    return this.beritaService.findOne(id);
  }

  @Put(':id/:userId')
  @ApiOperation({ summary: 'Update a Berita by ID' })
  @ApiParam({ name: 'id', description: 'Berita ID' })
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
        file2: {
          type: 'string',
          format: 'binary',
          description: 'File upload',
          example: 'file2.jpg',
        },
        judulBerita: { type: 'string', example: 'Judul Berita', description: 'Judul dari berita' },
        deskripsiBerita: { type: 'array', items: { type: 'string' }, example: ['Deskripsi 1', 'Deskripsi 2'], description: 'Deskripsi dari berita' },
        tanggalBerita: { type: 'string', example: '2024-07-03', description: 'Tanggal berita' },
        authorBerita: { type: 'string', example: 'John Doe', description: 'Penulis berita' },
        editorBerita: { type: 'string', example: 'Jane Doe', description: 'Editor berita' },
        publishedAt: { type: 'string', example: '2024-07-03T04:48:57.000Z', description: 'Tanggal dipublikasikan' },
      },
    },
  })
  @UseInterceptors(FileFieldsInterceptor([
    { name: "file" , maxCount:1},
    { name: "file2" , maxCount:1}
  ], fileUploadOptions('beritas')))
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @UploadedFiles() files: {file: Express.Multer.File, file2: Express.Multer.File},
    @Body() updateBeritaDto: UpdateBeritaDto,
  ): Promise<Berita> {

    const fotoBerita = getFileUrl('beritas', files.file);
    const fotoContent = getFileUrl('beritas', files.file2);
    try {
      return this.beritaService.update(id, userId, updateBeritaDto, fotoBerita, fotoContent);
    } catch (error) {
      console.error('Update Berita - Error:', error);
      throw new HttpException('Failed to update Berita', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Berita by ID' })
  @ApiParam({ name: 'id', description: 'Berita ID' })
  @ApiResponse({ status: 204, description: 'Berita successfully deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    console.log('Delete Berita - id:', id);
    return this.beritaService.remove(id);
  }
}