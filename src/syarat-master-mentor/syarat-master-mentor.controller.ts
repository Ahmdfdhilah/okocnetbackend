import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { SyaratMasterMentorService } from './syarat-master-mentor.service';
import { SyaratMasterMentor } from 'src/entities/syarat-master-mentor.entity';
import { CreateSyaratMasterMentorDto } from './dto/create-syarat-master-mentor.dto';
import { UpdateSyaratMasterMentorDto } from './dto/update-syarat-master-mentor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('syarat-master-mentors')
@ApiTags('syarat-master-mentors')
export class SyaratMasterMentorController {
  constructor(private readonly syaratMasterMentorService: SyaratMasterMentorService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('syarat-master-mentors')))
  @ApiOperation({ summary: 'Create a new SyaratMasterMentor' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'deskripsi'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image upload',
          example: 'image.jpg',
        },
        deskripsi: {
          type: 'string',
          description: 'Description',
          example: 'Description of the requirement',
        },
      },
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateSyaratMasterMentorDto,
  ): Promise<SyaratMasterMentor> {
    const imgSrc = getFileUrl('syarat-master-mentors', file);
    return this.syaratMasterMentorService.create(createDto, imgSrc);
  }

  @Get()
  @ApiOperation({ summary: 'Get all SyaratMasterMentors' })
  @ApiResponse({ status: 200, description: 'Returns all SyaratMasterMentors' })
  async findAll(@Query() query: QueryDto): Promise<{ data: SyaratMasterMentor[], total: number }> {
    return this.syaratMasterMentorService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a SyaratMasterMentor by ID' })
  @ApiParam({ name: 'id', description: 'SyaratMasterMentor ID' })
  @ApiResponse({ status: 200, description: 'Returns the SyaratMasterMentor' })
  async findOne(@Param('id') id: string): Promise<SyaratMasterMentor> {
    return this.syaratMasterMentorService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('syarat-master-mentors')))
  @ApiOperation({ summary: 'Update a SyaratMasterMentor by ID' })
  @ApiParam({ name: 'id', description: 'SyaratMasterMentor ID' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image upload',
          example: 'image.jpg',
        },
        deskripsi: {
          type: 'string',
          description: 'Description',
          example: 'Updated description of the requirement',
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateDto: UpdateSyaratMasterMentorDto,
  ): Promise<SyaratMasterMentor> {
    const imgSrc = file ? getFileUrl('syarat-master-mentors', file) : undefined;
    return this.syaratMasterMentorService.update(id, updateDto, imgSrc);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a SyaratMasterMentor by ID' })
  @ApiParam({ name: 'id', description: 'SyaratMasterMentor ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'SyaratMasterMentor successfully deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.syaratMasterMentorService.remove(id);
  }
}
