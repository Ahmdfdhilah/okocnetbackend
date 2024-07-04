import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { StrukturPengurusDirektoratService } from './struktur-pengurus-direktorat.service';
import { StrukturPengurusDirektorat } from 'src/entities/struktur-pengurus-direktorat.entity';
import { CreateStrukturPengurusDirektoratDto } from './dto/create-struktur-pengurus-direktorat.dto';
import { UpdateStrukturPengurusDirektoratDto } from './dto/update-struktur-pengurus-direktorat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('struktur-pengurus-direktorats')
@ApiTags('struktur-pengurus-direktorats')
export class StrukturPengurusDirektoratController {
    constructor(private readonly strukturPengurusDirektoratService: StrukturPengurusDirektoratService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-direktorats')))
    @ApiOperation({ summary: 'Create a new StrukturPengurusDirektorat' })
    @ApiBody({ type: CreateStrukturPengurusDirektoratDto })
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createStrukturPengurusDirektoratDto: CreateStrukturPengurusDirektoratDto,
    ): Promise<StrukturPengurusDirektorat> {
        const imgSrc = getFileUrl('struktur-pengurus-direktorats', file);
        return this.strukturPengurusDirektoratService.create(createStrukturPengurusDirektoratDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all StrukturPengurusDirektorat' })
    @ApiResponse({ status: 200, description: 'Returns all StrukturPengurusDirektorat' })
    async findAll(@Query() query: QueryDto): Promise<{ data: StrukturPengurusDirektorat[], total: number }> {
        return this.strukturPengurusDirektoratService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a StrukturPengurusDirektorat by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusDirektorat ID' })
    @ApiResponse({ status: 200, description: 'Returns the StrukturPengurusDirektorat' })
    async findOne(@Param('id') id: string): Promise<StrukturPengurusDirektorat> {
        return this.strukturPengurusDirektoratService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-direktorats')))
    @ApiOperation({ summary: 'Update a StrukturPengurusDirektorat by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusDirektorat ID' })
    @ApiBody({ type: UpdateStrukturPengurusDirektoratDto })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateStrukturPengurusDirektoratDto: UpdateStrukturPengurusDirektoratDto,
    ): Promise<StrukturPengurusDirektorat> {
        const imgSrc = getFileUrl('struktur-pengurus-direktorats', file);
        return this.strukturPengurusDirektoratService.update(id, userId, updateStrukturPengurusDirektoratDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a StrukturPengurusDirektorat by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusDirektorat ID' })
    @ApiResponse({ status: 204, description: 'StrukturPengurusDirektorat successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.strukturPengurusDirektoratService.remove(id);
    }
}