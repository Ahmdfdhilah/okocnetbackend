import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { BenefitTrainerService } from './benefit-trainer.service';
import { BenefitTrainer } from 'src/entities/benefit-trainer.entity';
import { CreateBenefitTrainerDto } from './dto/create-benefit-trainer.dto';
import { UpdateBenefitTrainerDto } from './dto/update-benefit-trainer.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('benefit-trainers')
@ApiTags('benefit-trainers')
export class BenefitTrainerController {
  constructor(private readonly benefitTrainerService: BenefitTrainerService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('benefit-trainers')))
  @ApiOperation({ summary: 'Create a new BenefitTrainer' })
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
          example: 'Trainer Title',
        },
        deskripsi: {
          type: 'string',
          description: 'Description',
          example: 'Description of the trainer',
        },
      },
    },
  })
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createBenefitTrainerDto: CreateBenefitTrainerDto,
  ): Promise<BenefitTrainer> {
    const imgSrc = getFileUrl('benefit-trainers', file);
    return this.benefitTrainerService.create(createBenefitTrainerDto, imgSrc);
  }

  @Get()
  @ApiOperation({ summary: 'Get all BenefitTrainers' })
  @ApiResponse({ status: 200, description: 'Returns all BenefitTrainers' })
  async findAll(@Query() query: QueryDto): Promise<{ data: BenefitTrainer[], total: number }> {
    return this.benefitTrainerService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a BenefitTrainer by ID' })
  @ApiParam({ name: 'id', description: 'BenefitTrainer ID' })
  @ApiResponse({ status: 200, description: 'Returns the BenefitTrainer' })
  async findOne(@Param('id') id: string): Promise<BenefitTrainer> {
    return this.benefitTrainerService.findOne(id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('benefit-trainers')))
  @ApiOperation({ summary: 'Update a BenefitTrainer by ID' })
  @ApiParam({ name: 'id', description: 'BenefitTrainer ID' })
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
          example: 'Trainer Title',
        },
        deskripsi: {
          type: 'string',
          description: 'Description',
          example: 'Description of the trainer',
        },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() updateBenefitTrainerDto: UpdateBenefitTrainerDto,
  ): Promise<BenefitTrainer> {
    const imgSrc = file ? getFileUrl('benefit-trainers', file) : undefined;
    return this.benefitTrainerService.update(id, updateBenefitTrainerDto, imgSrc);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a BenefitTrainer by ID' })
  @ApiParam({ name: 'id', description: 'BenefitTrainer ID' })
  @ApiBearerAuth()
  @ApiResponse({ status: 204, description: 'BenefitTrainer successfully deleted' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.benefitTrainerService.remove(id);
  }
}