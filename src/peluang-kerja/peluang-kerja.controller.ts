import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { PeluangKerjaService } from './peluang-kerja.service';
import { PeluangKerja } from 'src/entities/peluang-kerja.entity';
import { CreatePeluangKerjaDto } from './dto/create-peluang-kerja.dto';
import { UpdatePeluangKerjaDto } from './dto/update-peluang-kerja.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('peluang-kerjas')
@ApiTags('peluang-kerjas')
export class PeluangKerjaController {
    constructor(private readonly peluangKerjaService: PeluangKerjaService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('peluang-kerjas')))
    @ApiOperation({ summary: 'Create a new Peluang Kerja' })
    @ApiBody({ type: CreatePeluangKerjaDto })
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

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('peluang-kerjas')))
    @ApiOperation({ summary: 'Update a Peluang Kerja by ID' })
    @ApiParam({ name: 'id', description: 'Peluang Kerja ID' })
    @ApiBody({ type: UpdatePeluangKerjaDto })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updatePeluangKerjaDto: UpdatePeluangKerjaDto,
    ): Promise<PeluangKerja> {
        const imgSrc = getFileUrl('peluang-kerjas', file);
        return this.peluangKerjaService.update(id, userId, updatePeluangKerjaDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Peluang Kerja by ID' })
    @ApiParam({ name: 'id', description: 'Peluang Kerja ID' })
    @ApiResponse({ status: 204, description: 'Peluang Kerja successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.peluangKerjaService.remove(id);
    }
}