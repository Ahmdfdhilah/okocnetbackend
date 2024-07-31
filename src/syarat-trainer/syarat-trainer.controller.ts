import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { SyaratTrainerService } from './syarat-trainer.service';
import { SyaratTrainer } from 'src/entities/syarat-trainer.entity';
import { QueryDto } from 'src/lib/query.dto';
import { CreateSyaratTrainerDto } from './dto/create-syarat-trainer.dto';
import { UpdateSyaratTrainerDto } from './dto/update-syarat-trainer.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('syarat-trainers')
@ApiTags('syarat-trainers')
export class SyaratTrainerController {
    constructor(private readonly syaratTrainerService: SyaratTrainerService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @ApiOperation({ summary: 'Create a new SyaratTrainer' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            required: ['judul', 'deskripsi'],
            properties: {
                judul: {
                    type: 'string',
                    description: 'Title of the SyaratTrainer',
                    example: 'Syarat Trainer 2024',
                },
                deskripsi: {
                    type: 'string',
                    description: 'Description of the SyaratTrainer',
                    example: 'Requirements and criteria for the trainer in 2024.',
                },
            },
        },
    })
    async create(
        @Body() createSyaratTrainerDto: CreateSyaratTrainerDto
    ): Promise<SyaratTrainer> {
        return this.syaratTrainerService.create(createSyaratTrainerDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all SyaratTrainers' })
    @ApiResponse({ status: 200, description: 'Returns all SyaratTrainers' })
    async findAll(@Query() query: QueryDto): Promise<{ data: SyaratTrainer[], total: number }> {
        return this.syaratTrainerService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a SyaratTrainer by ID' })
    @ApiParam({ name: 'id', description: 'SyaratTrainer ID' })
    @ApiResponse({ status: 200, description: 'Returns the SyaratTrainer' })
    async findOne(@Param('id') id: string): Promise<SyaratTrainer> {
        return this.syaratTrainerService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    @ApiOperation({ summary: 'Update a SyaratTrainer by ID' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'SyaratTrainer ID' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                judul: {
                    type: 'string',
                    description: 'Title of the SyaratTrainer',
                    example: 'Syarat Trainer 2024',
                },
                deskripsi: {
                    type: 'string',
                    description: 'Description of the SyaratTrainer',
                    example: 'Requirements and criteria for the trainer in 2024.',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Body() updateSyaratTrainerDto: UpdateSyaratTrainerDto
    ): Promise<SyaratTrainer> {
        return this.syaratTrainerService.update(id, updateSyaratTrainerDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a SyaratTrainer by ID' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'SyaratTrainer ID' })
    @ApiResponse({ status: 204, description: 'SyaratTrainer successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.syaratTrainerService.remove(id);
    }
}