import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { PengurusService } from './pengurus.service';
import { Pengurus } from 'src/entities/pengurus.entity';
import { CreatePengurusDto } from './dto/create-pengurus.dto';
import { UpdatePengurusDto } from './dto/update-pengurus.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('penguruses')
@ApiTags('penguruses')
export class PengurusController {
    constructor(private readonly pengurusService: PengurusService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('penguruses')))
    @ApiOperation({ summary: 'Create a new Pengurus' })
    @ApiBody({ type: CreatePengurusDto })
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createPengurusDto: CreatePengurusDto,
    ): Promise<Pengurus> {
        const imgSrc = getFileUrl('penguruses', file);
        return this.pengurusService.create(createPengurusDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Penguruses' })
    @ApiResponse({ status: 200, description: 'Returns all Penguruses' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Pengurus[], total: number }> {
        return this.pengurusService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Pengurus by ID' })
    @ApiParam({ name: 'id', description: 'Pengurus ID' })
    @ApiResponse({ status: 200, description: 'Returns the Pengurus' })
    async findOne(@Param('id') id: string): Promise<Pengurus> {
        return this.pengurusService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('penguruses')))
    @ApiOperation({ summary: 'Update a Pengurus by ID' })
    @ApiParam({ name: 'id', description: 'Pengurus ID' })
    @ApiBody({ type: UpdatePengurusDto })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updatePengurusDto: UpdatePengurusDto,
    ): Promise<Pengurus> {
        const imgSrc = getFileUrl('penguruses', file);
        return this.pengurusService.update(id, userId, updatePengurusDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Pengurus by ID' })
    @ApiParam({ name: 'id', description: 'Pengurus ID' })
    @ApiResponse({ status: 204, description: 'Pengurus successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.pengurusService.remove(id);
    }
}