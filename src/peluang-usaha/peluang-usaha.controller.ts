import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { PeluangUsahaService } from './peluang-usaha.service';
import { PeluangUsaha } from 'src/entities/peluang-usaha.entity';
import { CreatePeluangUsahaDto } from './dto/create-peluang-usaha.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';
import { UpdatePeluangUsahaDto } from './dto/update-peluang-usaha.dto';

@Controller('peluang-usahas')
@ApiTags('peluang-usahas')
export class PeluangUsahaController {
    constructor(private readonly peluangUsahaService: PeluangUsahaService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('peluang-usahas')))
    @ApiOperation({ summary: 'Create a new Peluang Usaha' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'judulUsaha', 'lokasiUsaha', 'kategoriUsaha', 'tentangProgram', 'benefitProgram', 'periodePendaftaran', 'jobdescUsaha', 'kriteriaUsaha', 'urlPendaftaran', 'sistemKerja', 'publishedAt'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
                },
                judulUsaha: {
                    type: 'string',
                    description: 'Judul Usaha',
                    example: 'Nama Usaha',
                },
                lokasiUsaha: {
                    type: 'string',
                    description: 'Lokasi Usaha',
                    example: 'Jakarta',
                },
                kategoriUsaha: {
                    type: 'string',
                    description: 'Kategori Usaha',
                    example: 'Teknologi',
                },
                tentangProgram: {
                    type: 'string',
                    description: 'Tentang Program',
                    example: 'Deskripsi singkat tentang program',
                },
                benefitProgram: {
                    type: 'string',
                    description: 'Benefit Program',
                    example: 'Manfaat dari program',
                },
                jobdescUsaha: {
                    type: 'string',
                    description: 'Jobdesc Usaha',
                    example: 'Tugas dan tanggung jawab',
                },
                kriteriaUsaha: {
                    type: 'string',
                    description: 'Kriteria Usaha',
                    example: 'Persyaratan yang dibutuhkan',
                },
                urlPendaftaran: {
                    type: 'string',
                    description: 'URL Pendaftaran',
                    example: 'https://pendaftaran-usaha.com',
                },
                sistemKerja: {
                    type: 'string',
                    enum: ['Full-Time', 'Part-Time', 'Contract', 'Volunteer'],
                    description: 'Sistem Kerja',
                    example: 'Full-Time',
                },
                periodePendaftaran: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Periode Pendaftaran (optional)',
                    example: '2024-07-03T04:48:57.000Z',
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
        @Body() createPeluangUsahaDto: CreatePeluangUsahaDto,
    ): Promise<PeluangUsaha> {
        const imgSrc = getFileUrl('peluang-usahas', file);
        return this.peluangUsahaService.create(createPeluangUsahaDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Peluang Usahas' })
    @ApiResponse({ status: 200, description: 'Returns all Peluang Usahas' })
    async findAll(@Query() query: QueryDto): Promise<{ data: PeluangUsaha[], total: number }> {
        return this.peluangUsahaService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Peluang Usaha by ID' })
    @ApiParam({ name: 'id', description: 'Peluang Usaha ID' })
    @ApiResponse({ status: 200, description: 'Returns the Peluang Usaha' })
    async findOne(@Param('id') id: string): Promise<PeluangUsaha> {
        return this.peluangUsahaService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('peluang-usahas')))
    @ApiOperation({ summary: 'Update a Peluang Usaha by ID' })
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id', description: 'Peluang Usaha ID' })
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
                judulUsaha: {
                    type: 'string',
                    description: 'Judul Usaha',
                    example: 'Nama Usaha',
                },
                lokasiUsaha: {
                    type: 'string',
                    description: 'Lokasi Usaha',
                    example: 'Jakarta',
                },
                kategoriUsaha: {
                    type: 'string',
                    description: 'Kategori Usaha',
                    example: 'Teknologi',
                },
                tentangProgram: {
                    type: 'string',
                    description: 'Tentang Program',
                    example: 'Deskripsi singkat tentang program',
                },
                benefitProgram: {
                    type: 'string',
                    description: 'Benefit Program',
                    example: 'Manfaat dari program',
                },
                jobdescUsaha: {
                    type: 'string',
                    description: 'Jobdesc Usaha',
                    example: 'Tugas dan tanggung jawab',
                },
                kriteriaUsaha: {
                    type: 'string',
                    description: 'Kriteria Usaha',
                    example: 'Persyaratan yang dibutuhkan',
                },
                urlPendaftaran: {
                    type: 'string',
                    description: 'URL Pendaftaran',
                    example: 'https://pendaftaran-usaha.com',
                },
                sistemKerja: {
                    type: 'string',
                    enum: ['Full-Time', 'Part-Time', 'Contract', 'Volunteer'],
                    description: 'Sistem Kerja',
                    example: 'Full-Time',
                },
                periodePendaftaran: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Periode Pendaftaran (optional)',
                    example: '2024-07-03T04:48:57.000Z',
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
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updatePeluangUsahaDto: UpdatePeluangUsahaDto,
    ): Promise<PeluangUsaha> {
        const imgSrc = getFileUrl('peluang-usahas', file);
        return this.peluangUsahaService.update(id, userId, updatePeluangUsahaDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Peluang Usaha by ID' })
    @ApiParam({ name: 'id', description: 'Peluang Usaha ID' })
    @ApiResponse({ status: 204, description: 'Peluang Usaha successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.peluangUsahaService.remove(id);
    }
}
