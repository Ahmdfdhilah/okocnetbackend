import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { SosmedService } from './sosmed.service';
import { Sosmed } from 'src/entities/sosmed.entity';
import { CreateSosmedDto } from './dto/create-sosmed.dto';
import { UpdateSosmedDto } from './dto/update-sosmed.dto';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@ApiTags('sosmeds')
@Controller('sosmeds')
export class SosmedController {
    constructor(private readonly sosmedService: SosmedService) {}

    @Post(':userId')
    @ApiOperation({ summary: 'Create a new Sosmed' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['link', 'nama', 'publishedAt'],
            properties: {
                link: {
                    type: 'string',
                    description: 'Link URL for social media.',
                    example: 'https://twitter.com/johndoe',
                },
                nama: {
                    type: 'string',
                    description: 'Name of the social media platform.',
                    example: 'Twitter',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Date of publication for the social media entry.',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async create(
        @Param('userId') userId: string,
        @Body() createSosmedDto: CreateSosmedDto,
    ): Promise<Sosmed> {
        return this.sosmedService.create(createSosmedDto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Sosmeds' })
    @ApiResponse({ status: 200, description: 'Returns all Sosmeds' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Sosmed[], total: number }> {
        return this.sosmedService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Sosmed by ID' })
    @ApiParam({ name: 'id', description: 'Sosmed ID' })
    @ApiResponse({ status: 200, description: 'Returns the Sosmed' })
    async findOne(@Param('id') id: string): Promise<Sosmed> {
        return this.sosmedService.findOne(id);
    }

    @Put(':id/:userId')
    @ApiOperation({ summary: 'Update a Sosmed by ID' })
    @ApiParam({ name: 'id', description: 'Sosmed ID' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                link: {
                    type: 'string',
                    description: 'Link URL for social media.',
                    example: 'https://twitter.com/johndoe',
                },
                nama: {
                    type: 'string',
                    description: 'Name of the social media platform.',
                    example: 'Twitter',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Date of publication for the social media entry.',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @Body() updateSosmedDto: UpdateSosmedDto,
    ): Promise<Sosmed> {
        return this.sosmedService.update(id, userId, updateSosmedDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Sosmed by ID' })
    @ApiParam({ name: 'id', description: 'Sosmed ID' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.sosmedService.remove(id);
    }
}