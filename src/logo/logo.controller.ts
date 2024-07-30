import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query, UseGuards } from '@nestjs/common';
import { LogoService } from './logo.service';
import { Logo } from 'src/entities/logo.entity';
import { CreateLogoDto } from './dto/create-logo.dto';
import { UpdateLogoDto } from './dto/update-logo.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { QueryDto } from 'src/lib/query.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@Controller('logos')
@ApiTags('logos')
export class LogoController {
    constructor(private readonly logoService: LogoService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('logos')))
    @ApiOperation({ summary: 'Create a new Logo' })
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
                    description: 'Name of the logo',
                    example: 'Company Logo',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'logo.jpg',
                },
            },
        },
    })
    async create(
        @UploadedFile() file: Express.Multer.File,
        @Body() createLogoDto: CreateLogoDto,
    ): Promise<Logo> {
        const imgSrc = getFileUrl('logos', file);
        return this.logoService.create(createLogoDto, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Logos' })
    @ApiResponse({ status: 200, description: 'Returns all Logos' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Logo[], total: number }> {
        return this.logoService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Logo by ID' })
    @ApiParam({ name: 'id', description: 'Logo ID' })
    @ApiResponse({ status: 200, description: 'Returns the Logo' })
    async findOne(@Param('id') id: string): Promise<Logo> {
        return this.logoService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('logos')))
    @ApiOperation({ summary: 'Update a Logo by ID' })
    @ApiParam({ name: 'id', description: 'Logo ID' })
    @ApiBearerAuth()
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                nama: {
                    type: 'string',
                    format: 'text',
                    description: 'Name of the logo',
                    example: 'Updated Company Logo',
                },
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'updated-logo.jpg',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @UploadedFile() file: Express.Multer.File,
        @Body() updateLogoDto: UpdateLogoDto,
    ): Promise<Logo> {
        const imgSrc = getFileUrl('logos', file);
        return this.logoService.update(id, updateLogoDto, imgSrc);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Logo by ID' })
    @ApiParam({ name: 'id', description: 'Logo ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'Logo successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.logoService.remove(id);
    }
}
