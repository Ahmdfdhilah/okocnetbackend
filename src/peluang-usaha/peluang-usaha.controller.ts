import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { PeluangUsahaService } from './peluang-usaha.service';
import { PeluangUsaha } from 'src/entities/peluang-usaha.entity';
import { CreatePeluangUsahaDto } from './dto/create-peluang-usaha.dto';
import { UpdatePeluangUsahaDto } from './dto/update-peluang-usaha.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('peluang-usahas')
@ApiTags('peluang-usahas')
export class PeluangUsahaController {
    constructor(private readonly peluangUsahaService: PeluangUsahaService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('peluang-usahas')))
    @ApiOperation({ summary: 'Create a new Peluang Usaha' })
    @ApiBody({ type: CreatePeluangUsahaDto })
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
    @ApiParam({ name: 'id', description: 'Peluang Usaha ID' })
    @ApiBody({ type: UpdatePeluangUsahaDto })
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
