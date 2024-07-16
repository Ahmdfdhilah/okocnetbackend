// src/deskripsi/deskripsi.controller.ts

import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { DeskripsiService } from './deskripsi.service';
import { DeskripsiDTO } from './dto/deskripsi.dto';

@ApiTags('deskripsi')
@Controller('deskripsi')
export class DeskripsiController {
    constructor(private readonly deskripsiService: DeskripsiService) {}

    @Post()
    @ApiOperation({ summary: 'Create a new Deskripsi' })
    @ApiConsumes('application/json')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    example: 'Deskripsi Title',
                },
                deskripsi: {
                    type: 'string',
                    example: 'Deskripsi content.',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    example: '2024-07-15T12:00:00Z',
                },
            },
            required: ['title', 'deskripsi'],
        },
    })
    async create(@Body() createDeskripsiDto: DeskripsiDTO): Promise<any> {
        return await this.deskripsiService.create(createDeskripsiDto);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Deskripsi by ID' })
    @ApiParam({ name: 'id', description: 'Deskripsi ID' })
    async findOne(@Param('id') id: string): Promise<any> {
        return await this.deskripsiService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a Deskripsi by ID' })
    @ApiConsumes('application/json')
    @ApiParam({ name: 'id', description: 'Deskripsi ID' })
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    example: 'Updated Deskripsi Title',
                },
                deskripsi: {
                    type: 'string',
                    example: 'Updated deskripsi content.',
                },
            },
        },
    })
    async update(@Param('id') id: string, @Body() updateDeskripsiDto: DeskripsiDTO): Promise<any> {
        return await this.deskripsiService.update(updateDeskripsiDto, id);
    }
}