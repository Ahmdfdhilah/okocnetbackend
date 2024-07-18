import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { DonasiService } from './donasi.service';
import { Donasi } from 'src/entities/donasi.entity';
import { QueryDto } from 'src/lib/query.dto';
import { CreateDonasiDto } from './dto/create-donasi.dto';
import { UpdateDonasiDto } from './dto/update-donasi.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('donasis')
@ApiTags('donasis')
export class DonasiController {
  constructor(private readonly donasiService: DonasiService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post(':userId')
  @ApiOperation({ summary: 'Create a new Donasi' })
  @ApiConsumes('multipart/form-data')
  @ApiBearerAuth()
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'judulDonasi', 'deskripsiDonasi', 'publishedAt'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'File upload',
          example: 'file.jpg',
        },
        judulDonasi: {
          type: 'string',
          description: 'Judul Donasi',
          example: 'Bantuan Bencana',
        },
        deskripsiDonasi: {
          type: 'string',
          description: 'Deskripsi Donasi',
          example: 'Bantuan untuk korban bencana alam',
        },
        publishedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Tanggal publikasi',
          example: '2024-07-03T04:48:57.000Z',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('donasis')))
  async create(
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() createDonasiDto: CreateDonasiDto
  ): Promise<Donasi> {
    const imgSrc = getFileUrl('donasis', file);
    return this.donasiService.create(createDonasiDto, userId, imgSrc);
  }

  @Get()
  @ApiOperation({ summary: 'Get all Donasis' })
  @ApiResponse({ status: 200, description: 'Returns all Donasis' })
  async findAll(@Query() query: QueryDto): Promise<{ data: Donasi[], total: number }> {
    return this.donasiService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a Donasi by ID' })
  @ApiParam({ name: 'id', description: 'Donasi ID' })
  @ApiResponse({ status: 200, description: 'Returns the Donasi' })
  async findOne(@Param('id') id: string): Promise<Donasi> {
    return this.donasiService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id/:userId')
  @ApiOperation({ summary: 'Update a Donasi by ID' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiParam({ name: 'id', description: 'Donasi ID' })
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
        judulDonasi: {
          type: 'string',
          description: 'Judul Donasi',
          example: 'Bantuan Bencana',
        },
        deskripsiDonasi: {
          type: 'string',
          description: 'Deskripsi Donasi',
          example: 'Bantuan untuk korban bencana alam',
        },
        publishedAt: {
          type: 'string',
          format: 'date-time',
          description: 'Tanggal publikasi',
          example: '2024-07-03T04:48:57.000Z',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('donasis')))
  async update(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDonasiDto: UpdateDonasiDto
  ): Promise<Donasi> {
    const imgSrc = getFileUrl('donasis', file);
    return this.donasiService.update(id, userId, updateDonasiDto, imgSrc);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a Donasi by ID' })
  @ApiBearerAuth()
  @ApiParam({ name: 'id', description: 'Donasi ID' })
  @ApiResponse({ status: 204, description: 'Donasi successfully deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.donasiService.remove(id);
  }
}