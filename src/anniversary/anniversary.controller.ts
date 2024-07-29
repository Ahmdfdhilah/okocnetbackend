import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseGuards } from '@nestjs/common';
import { AnniversaryService } from './anniversary.service';
import { Anniversary } from 'src/entities/anniversary.entity';
import { QueryDto } from 'src/lib/query.dto';
import { CreateAnniversaryDto } from './dto/create-anniversary.dto';
import { UpdateAnniversaryDto } from './dto/update-anniversary.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';

@Controller('anniversaries')
@ApiTags('anniversaries')
export class AnniversaryController {
    constructor(private readonly anniversaryService: AnniversaryService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @ApiOperation({ summary: 'Create a new Anniversary' })
    @ApiBearerAuth()
    @ApiBody({
        schema: {
            type: 'object',
            required: ['judul', 'deskripsi', 'videoLink'],
            properties: {
                judul: {
                    type: 'string',
                    description: 'Title of the Anniversary',
                    example: 'Anniversary Celebration 2024',
                },
                year: {
                    type: 'number',
                    description: 'Year of the Anniversary',
                    example: '2024',
                },
                deskripsi: {
                    type: 'string',
                    description: 'Description of the Anniversary',
                    example: 'Celebrating the achievements and milestones of the year 2024.',
                },
                videoLink: {
                    type: 'string',
                    description: 'YouTube video link for the Anniversary',
                    example: 'https://www.youtube.com/watch?v=finalVideoId',
                },
            },
        },
    })
    async create(
        @Body() createAnniversaryDto: CreateAnniversaryDto
    ): Promise<Anniversary> {
        return this.anniversaryService.create(createAnniversaryDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Anniversaries' })
    @ApiResponse({ status: 200, description: 'Returns all Anniversaries' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Anniversary[], total: number }> {
        return this.anniversaryService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an Anniversary by ID' })
    @ApiParam({ name: 'id', description: 'Anniversary ID' })
    @ApiResponse({ status: 200, description: 'Returns the Anniversary' })
    async findOne(@Param('id') id: string): Promise<Anniversary> {
        return this.anniversaryService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    @ApiOperation({ summary: 'Update an Anniversary by ID' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'Anniversary ID' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                judul: {
                    type: 'string',
                    description: 'Title of the Anniversary',
                    example: 'Anniversary Celebration 2024',
                },
                year: {
                    type: 'number',
                    description: 'Year of the Anniversary',
                    example: '2024',
                },
                deskripsi: {
                    type: 'string',
                    description: 'Description of the Anniversary',
                    example: 'Celebrating the achievements and milestones of the year 2024.',
                },
                videoLink: {
                    type: 'string',
                    description: 'YouTube video link for the Anniversary',
                    example: 'https://www.youtube.com/watch?v=finalVideoId',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Body() updateAnniversaryDto: UpdateAnniversaryDto
    ): Promise<Anniversary> {
        return this.anniversaryService.update(id, updateAnniversaryDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete an Anniversary by ID' })
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'Anniversary ID' })
    @ApiResponse({ status: 204, description: 'Anniversary successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.anniversaryService.remove(id);
    }
}
