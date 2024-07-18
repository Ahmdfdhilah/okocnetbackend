import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { PeluangKerjaService } from './peluang-kerja.service';
import { PeluangKerja } from 'src/entities/peluang-kerja.entity';
import { CreatePeluangKerjaDto} from './dto/create-peluang-kerja.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { UpdatePeluangKerjaDto } from './dto/update-peluang-kerja.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';

@Controller('peluang-kerjas')
@ApiTags('peluang-kerjas')
export class PeluangKerjaController {
    constructor(private readonly peluangKerjaService: PeluangKerjaService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('peluang-kerjas')))
    @ApiOperation({ summary: 'Create a new Peluang Kerja' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'judulKerja', 'lokasiKerja', 'kategoriKerja', 'tentangProgram', 'benefitProgram', 'jobdescKerja', 'kriteriaPeserta', 'urlPendaftaran', 'sistemKerja', 'publishedAt', 'periodePendaftaran'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
                },
                judulKerja: {
                    type: 'string',
                    description: 'Judul Kerja',
                    example: 'Nama Kerja',
                },
                lokasiKerja: {
                    type: 'string',
                    description: 'Lokasi Kerja',
                    example: 'Jakarta',
                },
                kategoriKerja: {
                    type: 'string',
                    description: 'Kategori Kerja',
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
                jobdescKerja: {
                    type: 'string',
                    description: 'Jobdesc Kerja',
                    example: 'Tugas dan tanggung jawab',
                },
                kriteriaPeserta: {
                    type: 'string',
                    description: 'Kriteria Peserta',
                    example: 'Persyaratan yang dibutuhkan',
                },
                urlPendaftaran: {
                    type: 'string',
                    description: 'URL Pendaftaran',
                    example: 'https://pendaftaran-kerja.com',
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
        @Body() createPeluangKerjaDto: CreatePeluangKerjaDto,
    ): Promise<PeluangKerja> {
        const imgSrc = getFileUrl('peluang-kerjas', file);
        return this.peluangKerjaService.create(createPeluangKerjaDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Peluang Kerjas' })
    @ApiResponse({ status: 200, description: 'Returns all Peluang Kerjas' })
    async findAll(@Query() query: QueryDto): Promise<{ data: PeluangKerja[], total: number }> {
        return this.peluangKerjaService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Peluang Kerja by ID' })
    @ApiParam({ name: 'id', description: 'Peluang Kerja ID' })
    @ApiResponse({ status: 200, description: 'Returns the Peluang Kerja' })
    async findOne(@Param('id') id: string): Promise<PeluangKerja> {
        return this.peluangKerjaService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('peluang-kerjas')))
    @ApiOperation({ summary: 'Update a Peluang Kerja by ID' })
    @ApiConsumes('multipart/form-data')
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'Peluang Kerja ID' })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'judulKerja', 'lokasiKerja', 'kategoriKerja', 'tentangProgram', 'benefitProgram', 'jobdescKerja', 'kriteriaPeserta', 'urlPendaftaran', 'sistemKerja', 'publishedAt'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
                },
                judulKerja: {
                    type: 'string',
                    description: 'Judul Kerja',
                    example: 'Nama Kerja',
                },
                lokasiKerja: {
                    type: 'string',
                    description: 'Lokasi Kerja',
                    example: 'Jakarta',
                },
                kategoriKerja: {
                    type: 'string',
                    description: 'Kategori Kerja',
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
                jobdescKerja: {
                    type: 'string',
                    description: 'Jobdesc Kerja',
                    example: 'Tugas dan tanggung jawab',
                },
                kriteriaPeserta: {
                    type: 'string',
                    description: 'Kriteria Peserta',
                    example: 'Persyaratan yang dibutuhkan',
                },
                urlPendaftaran: {
                    type: 'string',
                    description: 'URL Pendaftaran',
                    example: 'https://pendaftaran-kerja.com',
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
        @Body() updatePeluangKerjaDto: UpdatePeluangKerjaDto,
    ): Promise<PeluangKerja> {
        const imgSrc = getFileUrl('peluang-kerjas', file);
        return this.peluangKerjaService.update(id, userId, updatePeluangKerjaDto, imgSrc);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Delete a Peluang Kerja by ID' })
    @ApiParam({ name: 'id', description: 'Peluang Kerja ID' })
    @ApiResponse({ status: 204, description: 'Peluang Kerja successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.peluangKerjaService.remove(id);
    }
}