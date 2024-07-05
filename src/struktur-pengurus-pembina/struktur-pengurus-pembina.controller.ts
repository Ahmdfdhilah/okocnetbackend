import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, HttpException, HttpStatus } from '@nestjs/common';
import { StrukturPengurusPembinaService } from './struktur-pengurus-pembina.service';
import { StrukturPengurusPembina } from 'src/entities/struktur-pengurus-pembina.entity';
import { CreateStrukturPengurusPembinaDto } from './dto/create-struktur-pengurus-pembina.dto';
import { UpdateStrukturPengurusPembinaDto } from './dto/update-struktur-pengurus-pembina.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('struktur-pengurus-pembinas')
@ApiTags('struktur-pengurus-pembinas')
export class StrukturPengurusPembinaController {
    constructor(private readonly strukturPengurusPembinaService: StrukturPengurusPembinaService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-pembinas')))
    @ApiOperation({ summary: 'Create a new StrukturPengurusPembina' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'namaPembina', 'jabatanPembina', 'publishedAt'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
                },
                namaPembina: {
                    type: 'string',
                    description: 'Nama Pembina',
                    example: 'Ami',
                },
                jabatanPembina: {
                    type: 'string',
                    description: 'Jabatan Pembina',
                    example: 'Dir',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Tanggal publikasi',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async create(
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() createStrukturPengurusPembinaDto: CreateStrukturPengurusPembinaDto,
    ): Promise<StrukturPengurusPembina> {
        if (!file) {
            throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }
        const imgSrc = getFileUrl('struktur-pengurus-pembinas', file);
        return this.strukturPengurusPembinaService.create(createStrukturPengurusPembinaDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all StrukturPengurusPembinas' })
    async findAll(@Query() query: QueryDto): Promise<{ data: StrukturPengurusPembina[], total: number }> {
        return this.strukturPengurusPembinaService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a StrukturPengurusPembina by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusPembina ID' })
    async findOne(@Param('id') id: string): Promise<StrukturPengurusPembina> {
        const strukturPengurusPembina = await this.strukturPengurusPembinaService.findOne(id);
        if (!strukturPengurusPembina) {
            throw new HttpException('StrukturPengurusPembina not found', HttpStatus.NOT_FOUND);
        }
        return strukturPengurusPembina;
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('struktur-pengurus-pembinas')))
    @ApiOperation({ summary: 'Update a StrukturPengurusPembina by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusPembina ID' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
                },
                namaPembina: {
                    type: 'string',
                    description: 'Nama Pembina',
                    example: 'Ami',
                },
                jabatanPembina: {
                    type: 'string',
                    description: 'Jabatan Pembina',
                    example: 'Dir',
                },
                publishedAt: {
                    type: 'string',
                    description: 'Tanggal publikasi',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateStrukturPengurusPembinaDto: UpdateStrukturPengurusPembinaDto,
    ): Promise<StrukturPengurusPembina> {
        if (!file) {
            throw new HttpException('File is required', HttpStatus.BAD_REQUEST);
        }
        const imgSrc = getFileUrl('strukturpenguruspembinas', file);
        const strukturPengurusPembina = await this.strukturPengurusPembinaService.update(id, userId, updateStrukturPengurusPembinaDto, imgSrc);
        if (!strukturPengurusPembina) {
            throw new HttpException('StrukturPengurusPembina not found', HttpStatus.NOT_FOUND);
        }
        return strukturPengurusPembina;
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a StrukturPengurusPembina by ID' })
    @ApiParam({ name: 'id', description: 'StrukturPengurusPembina ID' })
    async remove(@Param('id') id: string): Promise<void> {
        const result = await this.strukturPengurusPembinaService.remove(id);
    }
}
