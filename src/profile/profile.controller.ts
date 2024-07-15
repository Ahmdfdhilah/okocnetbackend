import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { Profile } from 'src/entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('profiles')
@ApiTags('profiles')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('profiles')))
    @ApiOperation({ summary: 'Create a new Profile' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['file', 'nama', 'posisi', 'publishedAt'],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
                },
                nama: {
                    type: 'string',
                    description: 'Nama',
                    example: 'John Doe',
                },
                posisi: {
                    type: 'string',
                    description: 'Posisi',
                    example: 'Manager',
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
        @Body() createProfileDto: CreateProfileDto,
    ): Promise<Profile> {
        const imgSrc = getFileUrl('profiles', file);
        return this.profileService.create(createProfileDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Profiles' })
    @ApiResponse({ status: 200, description: 'Returns all Profiles' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Profile[], total: number }> {
        return this.profileService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Profile by ID' })
    @ApiParam({ name: 'id', description: 'Profile ID' })
    @ApiResponse({ status: 200, description: 'Returns the Profile' })
    async findOne(@Param('id') id: string): Promise<Profile> {
        return this.profileService.findOne(id);
    }
        
    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('profiles')))
    @ApiOperation({ summary: 'Update a Profile by ID' })
    @ApiParam({ name: 'id', description: 'Profile ID' })
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
                nama: {
                    type: 'string',
                    description: 'Nama',
                    example: 'John Doe',
                },
                posisi: {
                    type: 'string',
                    description: 'Posisi',
                    example: 'Manager',
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
        @Body() updateProfileDto: UpdateProfileDto,
    ): Promise<Profile> {
        const imgSrc = getFileUrl('profiles', file);
        return this.profileService.update(id, userId, updateProfileDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Profile by ID' })
    @ApiParam({ name: 'id', description: 'Profile ID' })
    @ApiResponse({ status: 204, description: 'Profile successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.profileService.remove(id);
    }
}