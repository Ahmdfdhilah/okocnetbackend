import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { EmakKeceService } from './emak-kece.service';
import { EmakKece } from 'src/entities/emak-kece.entity';
import { CreateEmakKeceDto, CreateEmakKeceDtoSchema } from './dto/create-emak-kece.dto';
import { UpdateEmakKeceDto, UpdateEmakKeceDtoSchema } from './dto/update-emak-kece.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { QueryDto } from 'src/lib/query.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('emak-keces')
@ApiTags('emak-keces')
export class EmakKeceController {
    constructor(private readonly emakKeceService: EmakKeceService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('emak-keces')))
    @ApiOperation({ summary: 'Create a new EmakKece' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'nama'],
            properties: {
                nama: {
                    type: 'string',
                    format: 'text',
                    description: 'Name of the EmakKece',
                    example: 'Emak Kece Name',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'emak-kece.jpg',
                },
            },
        },
    })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createEmakKeceDto: CreateEmakKeceDto,
    ): Promise<EmakKece> {
        const imgSrc = getFileUrl('emak-keces', file);
        return this.emakKeceService.create(createEmakKeceDto, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all EmakKeces' })
    @ApiResponse({ status: 200, description: 'Returns all EmakKeces' })
    async findAll(@Query() query: QueryDto): Promise<{ data: EmakKece[], total: number }> {
        return this.emakKeceService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an EmakKece by ID' })
    @ApiParam({ name: 'id', description: 'EmakKece ID' })
    @ApiResponse({ status: 200, description: 'Returns the EmakKece' })
    async findOne(@Param('id') id: string): Promise<EmakKece> {
        return this.emakKeceService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('emak-keces')))
    @ApiOperation({ summary: 'Update an EmakKece by ID' })
    @ApiParam({ name: 'id', description: 'EmakKece ID' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nama: {
                    type: 'string',
                    format: 'text',
                    description: 'Name of the EmakKece',
                    example: 'Updated Emak Kece Name',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'updated-emak-kece.jpg',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateEmakKeceDto: UpdateEmakKeceDto,
    ): Promise<EmakKece> {
        const imgSrc = getFileUrl('emak-keces', file);
        return this.emakKeceService.update(id, updateEmakKeceDto, imgSrc);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete an EmakKece by ID' })
    @ApiParam({ name: 'id', description: 'EmakKece ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'EmakKece successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.emakKeceService.remove(id);
    }
}
