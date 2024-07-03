import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { MerchandiseService } from './merchandise.service';
import { Merchandise } from 'src/entities/merchandise.entity';
import { CreateMerchandiseDto } from './dto/create-merchandise.dto';
import { UpdateMerchandiseDto } from './dto/update-merchandise.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('merchandises')
@ApiTags('merchandises')
export class MerchandiseController {
    constructor(private readonly merchandiseService: MerchandiseService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('merchandises')))
    @ApiOperation({ summary: 'Create a new Merchandise' })
    @ApiBody({ type: CreateMerchandiseDto })
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createMerchandiseDto: CreateMerchandiseDto,
    ): Promise<Merchandise> {
        const imgSrc = getFileUrl('merchandises', file);
        return this.merchandiseService.create(createMerchandiseDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Merchandises' })
    @ApiResponse({ status: 200, description: 'Returns all Merchandises' })
    async findAll(@Query() query: QueryDto): Promise<{ merchandises: Merchandise[], total: number }> {
        return this.merchandiseService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Merchandise by ID' })
    @ApiParam({ name: 'id', description: 'Merchandise ID' })
    @ApiResponse({ status: 200, description: 'Returns the Merchandise' })
    async findOne(@Param('id') id: string): Promise<Merchandise> {
        return this.merchandiseService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('merchandises')))
    @ApiOperation({ summary: 'Update a Merchandise by ID' })
    @ApiParam({ name: 'id', description: 'Merchandise ID' })
    @ApiBody({ type: UpdateMerchandiseDto })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateMerchandiseDto: UpdateMerchandiseDto,
    ): Promise<Merchandise> {
        const imgSrc = getFileUrl('merchandises', file);
        return this.merchandiseService.update(id, updateMerchandiseDto, userId, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Merchandise by ID' })
    @ApiParam({ name: 'id', description: 'Merchandise ID' })
    @ApiResponse({ status: 204, description: 'Merchandise successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.merchandiseService.remove(id);
    }
}