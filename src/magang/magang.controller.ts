import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { MagangService } from './magang.service';
import { Magang } from 'src/entities/magang.entity';
import { QueryDto } from 'src/lib/query.dto';
import { CreateMagangDto } from './dto/create-magang.dto';
import { UpdateMagangDto } from './dto/update-magang.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('magangs')
@ApiTags('magangs')
export class MagangController {
  constructor(private readonly magangService: MagangService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new Magang' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'judulMagang', 'lokasiMagang', 'durasiMagang', 'jenisMagang', 'tentangProgram', 'benefitMagang', 'kriteriaPeserta', 'urlMsib', 'publishedAt'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File upload',
          example: 'file.jpg',
        },
        judulMagang: {
          type: 'string',
          description: 'Judul Magang',
          example: 'Nama Magang',
        },
        lokasiMagang: {
          type: 'string',
          description: 'Lokasi Magang',
          example: 'Jakarta',
        },
        durasiMagang: {
          type: 'string',
          description: 'Durasi Magang',
          example: '3 months',
        },
        jenisMagang: {
          type: 'string',
          enum: ['Hybrid', 'WFO (Work From Office)', 'WFH (Work From Home)'],
          description: 'Jenis Magang',
          example: 'Hybrid',
        },
        tentangProgram: {
          type: 'string',
          description: 'Tentang Program',
          example: 'This is a great internship program.',
        },
        benefitMagang: {
          type: 'string',
          description: 'Benefit Magang',
          example: 'Competitive salary, Flexible hours',
        },
        kriteriaPeserta: {
          type: 'string',
          description: 'Kriteria Peserta',
          example: 'Final year student, GPA > 3.0',
        },
        urlMsib: {
          type: 'string',
          description: 'URL MSIB',
          example: 'http://url-msib.com',
        },
        kompetensi1: {
          type: 'string',
          nullable: true,
          description: 'Kompetensi 1',
          example: 'JavaScript',
        },
        kompetensi2: {
          type: 'string',
          nullable: true,
          description: 'Kompetensi 2',
          example: 'Node.js',
        },
        kompetensi3: {
          type: 'string',
          nullable: true,
          description: 'Kompetensi 3',
          example: 'React.js',
        },
        kompetensi4: {
          type: 'string',
          nullable: true,
          description: 'Kompetensi 4',
          example: 'TypeScript',
        },
        kompetensi5: {
          type: 'string',
          nullable: true,
          description: 'Kompetensi 5',
          example: 'GraphQL',
        },
        kriteriaPeserta1: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 1',
          example: 'Experience with web development',
        },
        kriteriaPeserta2: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 2',
          example: 'Good communication skills',
        },
        kriteriaPeserta3: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 3',
          example: 'Ability to work in a team',
        },
        kriteriaPeserta4: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 4',
          example: 'Problem-solving skills',
        },
        kriteriaPeserta5: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 5',
          example: 'Adaptability',
        },
        kriteriaPeserta6: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 6',
          example: 'Self-motivation',
        },
        kriteriaPeserta7: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 7',
          example: 'Time management',
        },
        kriteriaPeserta8: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 8',
          example: 'Attention to detail',
        },
        kriteriaPeserta9: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 9',
          example: 'Positive attitude',
        },
        kriteriaPeserta10: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 10',
          example: 'Leadership skills',
        },
        publishedAt: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          description: 'Tanggal publikasi',
          example: '2024-07-03T04:48:57.000Z',
        },
      },
    },
  })
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
  async findAll(@Query() query: QueryDto): Promise<{ data: Magang[], total: number }> {
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
        judulMagang: {
          type: 'string',
          description: 'Judul Magang',
          example: 'Nama Magang',
        },
        lokasiMagang: {
          type: 'string',
          description: 'Lokasi Magang',
          example: 'Jakarta',
        },
        durasiMagang: {
          type: 'string',
          description: 'Durasi Magang',
          example: '3 months',
        },
        jenisMagang: {
          type: 'string',
          enum: ['Hybrid', 'WFO (Work From Office)', 'WFH (Work From Home)'],
          description: 'Jenis Magang',
          example: 'Hybrid',
        },
        tentangProgram: {
          type: 'string',
          description: 'Tentang Program',
          example: 'This is a great internship program.',
        },
        benefitMagang: {
          type: 'string',
          description: 'Benefit Magang',
          example: 'Competitive salary, Flexible hours',
        },
        kriteriaPeserta: {
          type: 'string',
          description: 'Kriteria Peserta',
          example: 'Final year student, GPA > 3.0',
        },
        urlMsib: {
          type: 'string',
          description: 'URL MSIB',
          example: 'http://url-msib.com',
        },
        kompetensi1: {
          type: 'string',
          nullable: true,
          description: 'Kompetensi 1',
          example: 'JavaScript',
        },
        kompetensi2: {
          type: 'string',
          nullable: true,
          description: 'Kompetensi 2',
          example: 'Node.js',
        },
        kompetensi3: {
          type: 'string',
          nullable: true,
          description: 'Kompetensi 3',
          example: 'React.js',
        },
        kompetensi4: {
          type: 'string',
          nullable: true,
          description: 'Kompetensi 4',
          example: 'TypeScript',
        },
        kompetensi5: {
          type: 'string',
          nullable: true,
          description: 'Kompetensi 5',
          example: 'GraphQL',
        },
        kriteriaPeserta1: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 1',
          example: 'Experience with web development',
        },
        kriteriaPeserta2: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 2',
          example: 'Good communication skills',
        },
        kriteriaPeserta3: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 3',
          example: 'Ability to work in a team',
        },
        kriteriaPeserta4: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 4',
          example: 'Problem-solving skills',
        },
        kriteriaPeserta5: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 5',
          example: 'Adaptability',
        },
        kriteriaPeserta6: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 6',
          example: 'Self-motivation',
        },
        kriteriaPeserta7: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 7',
          example: 'Time management',
        },
        kriteriaPeserta8: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 8',
          example: 'Attention to detail',
        },
        kriteriaPeserta9: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 9',
          example: 'Positive attitude',
        },
        kriteriaPeserta10: {
          type: 'string',
          nullable: true,
          description: 'Kriteria Peserta 10',
          example: 'Leadership skills',
        },
        publishedAt: {
          type: 'string',
          format: 'date-time',
          nullable: true,
          description: 'Tanggal publikasi',
          example: '2024-07-03T04:48:57.000Z',
        },
      },
    },
  })
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
