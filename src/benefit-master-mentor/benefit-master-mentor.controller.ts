import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { BenefitMasterMentorService } from './benefit-master-mentor.service';
import { BenefitMasterMentor } from 'src/entities/benefit-master-mentor.entity';
import { CreateBemefitMasterMentorDto } from './dto/create-benefit-master-mentor.dto';
import { UpdateBenefitMasterMentorDto } from './dto/update-benefit-master-mentor.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('benefit-master-mentors')
@ApiTags('benefit-master-mentors')
export class BenefitMasterMentorController {
  constructor(private readonly masterMentorService: BenefitMasterMentorService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('master-mentors')))
  @ApiOperation({ summary: 'Create a new MasterMentor' })
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['file', 'judul', 'deskripsi'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
          description: 'Image upload',
          example: 'image.jpg',
        },
        judul: {
          type: 'string',
          description: 'Title',
          example: 'Mentor Title',
        },
        deskripsi: {
          type: 'string',
          description: 'Description',
          example: 'Description of the mentor',
        },
      },
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createMasterMentorDto: CreateBemefitMasterMentorDto,
  ): Promise<BenefitMasterMentor> {
    const imgSrc = getFileUrl('master-mentors', file);
    return this.masterMentorService.create(createMasterMentorDto, imgSrc);
  }

  @Get()
  @ApiOperation({ summary: 'Get all MasterMentors' })
  @ApiResponse({ status: 200, description: 'Returns all MasterMentors' })
  async findAll(@Query() query: QueryDto): Promise<{ data: BenefitMasterMentor[], total: number }> {
    return this.masterMentorService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a MasterMentor by ID' })
  @ApiParam({ name: 'id', description: 'MasterMentor ID' })
  @ApiResponse({ status: 200, description: 'Returns the MasterMentor' })
  async findOne(@Param('id') id: string): Promise<BenefitMasterMentor> {
    return this.masterMentorService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('master-mentors')))
  @ApiOperation({ summary: 'Update a MasterMentor by ID' })
  @ApiParam({ name: 'id', description: 'MasterMentor ID' })
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
        judul: {
          type: 'string',
          description: 'Title',
          example: 'Mentor Title',
        },
        deskripsi: {
          type: 'string',
          description: 'Description',
          example: 'Description of the mentor',
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateMasterMentorDto: UpdateBenefitMasterMentorDto,
  ): Promise<BenefitMasterMentor> {
    const imgSrc = file ? getFileUrl('master-mentors', file) : undefined;
    return this.masterMentorService.update(id, updateMasterMentorDto, imgSrc);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a MasterMentor by ID' })
  @ApiParam({ name: 'id', description: 'MasterMentor ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'MasterMentor successfully deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.masterMentorService.remove(id);
  }
}
