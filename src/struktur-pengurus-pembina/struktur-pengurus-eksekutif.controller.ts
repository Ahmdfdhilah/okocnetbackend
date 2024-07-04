import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { StrukturPengurusPembinaService } from './struktur-pengurus-eksekutif.service';
import { StrukturPengurusPembina } from 'src/entities/struktur-pengurus-pembina.entity';
import { CreateStrukturPengurusPembinaDto } from './dto/create-struktur-pengurus-pembina.dto';
import { UpdateStrukturPengurusPembinaDto } from './dto/update-struktur-pengurus-pembina.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger'; 

@Controller('struktur-pengurus-pembinas')
@ApiTags('struktur-pengurus-pembinas') 
export class StrukturPengurusPembinaController {
    constructor(private readonly strukturPengurusPembinaService: StrukturPengurusPembinaService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-pembinas')))
    @ApiOperation({ summary: 'Create a new StrukturPengurusPembina' })
    @ApiBody({ type: CreateStrukturPengurusPembinaDto })
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createStrukturPengurusPembinaDto: CreateStrukturPengurusPembinaDto,
    ): Promise<StrukturPengurusPembina> {
        const imgSrc = getFileUrl('struktur-pengurus-pembinas', file);
        return this.strukturPengurusPembinaService.create(createStrukturPengurusPembinaDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all StrukturPengurusPembinas' })
    @ApiResponse({ status: 200, description: 'Returns all StrukturPengurusPembinas' })
    async findAll(@Query() query: QueryDto): Promise<{ data: StrukturPengurusPembina[], total: number }> {
        return this.strukturPengurusPembinaService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a StrukturPengurusPembina by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusPembina ID' })
    @ApiResponse({ status: 200, description: 'Returns the StrukturPengurusPembina' })
    async findOne(@Param('id') id: string): Promise<StrukturPengurusPembina> {
        return this.strukturPengurusPembinaService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-pembinas')))
    @ApiOperation({ summary: 'Update a StrukturPengurusPembina by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusPembina ID' })
    @ApiBody({ type: UpdateStrukturPengurusPembinaDto })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateStrukturPengurusPembinaDto: UpdateStrukturPengurusPembinaDto,
    ): Promise<StrukturPengurusPembina> {
        const imgSrc = getFileUrl('strukturpenguruspembinas', file);
        return this.strukturPengurusPembinaService.update(id, userId, updateStrukturPengurusPembinaDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a StrukturPengurusPembina by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusPembina ID' })
    @ApiResponse({ status: 204, description: 'StrukturPengurusPembina successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.strukturPengurusPembinaService.remove(id);
    }
}
