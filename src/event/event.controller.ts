import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from 'src/entities/event.entity';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('events')
@ApiTags('events')
export class EventController {
    constructor(private readonly eventService: EventService) { }

    @Post(':userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('events')))
    @ApiOperation({ summary: 'Create a new Event' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: [
                'file', 'judulEvent', 'tanggalEvent', 'hargaEvent', 'pointEvent',
                'urlPendaftaran', 'deskripsiEvent', 'tempatEvent', 'quotaEvent', 'durasiEvent',
                'narasumber', 'contactPerson', 'publishedAt'
            ],
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                    description: 'File upload',
                    example: 'file.jpg',
                },
                judulEvent: {
                    type: 'string',
                    description: 'Judul Event',
                    example: 'Nama Event',
                },
                tanggalEvent: {
                    type: 'string',
                    description: 'Tanggal Event',
                    example: '2024-07-10',
                },
                hargaEvent: {
                    type: 'string',
                    description: 'Harga Event',
                    example: 'Rp 100.000',
                },
                pointEvent: {
                    type: 'string',
                    description: 'Point Event',
                    example: '10',
                },
                urlPendaftaran: {
                    type: 'string',
                    description: 'URL Pendaftaran',
                    example: 'http://url-pendaftaran.com',
                },
                deskripsiEvent: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Deskripsi Event',
                    example: ['Deskripsi singkat tentang event'],
                },
                tempatEvent: {
                    type: 'string',
                    description: 'Tempat Event',
                    example: 'Jakarta',
                },
                quotaEvent: {
                    type: 'string',
                    description: 'Quota Event',
                    example: '100',
                },
                durasiEvent: {
                    type: 'string',
                    description: 'Durasi Event',
                    example: '2 hours',
                },
                narasumber: {
                    type: 'string',
                    description: 'Narasumber',
                    example: 'John Doe',
                },
                contactPerson: {
                    type: 'string',
                    description: 'Contact Person',
                    example: '08123456789',
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
        @Body() createEventDto: CreateEventDto,
    ): Promise<Event> {
        const imgSrc = getFileUrl('events', file);
        return this.eventService.create(createEventDto, userId, imgSrc);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Events' })
    @ApiResponse({ status: 200, description: 'Returns all Events' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Event[], total: number }> {
        return this.eventService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an Event by ID' })
    @ApiParam({ name: 'id', description: 'Event ID' })
    @ApiResponse({ status: 200, description: 'Returns the Event' })
    async findOne(@Param('id') id: string): Promise<Event> {
        return this.eventService.findOne(id);
    }

    @Put(':id/:userId')
    @UseInterceptors(FileInterceptor('file', fileUploadOptions('events')))
    @ApiOperation({ summary: 'Update an Event by ID' })
    @ApiConsumes('multipart/form-data')
    @ApiParam({ name: 'id', description: 'Event ID' })
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
                judulEvent: {
                    type: 'string',
                    description: 'Judul Event',
                    example: 'Nama Event',
                },
                tanggalEvent: {
                    type: 'string',
                    description: 'Tanggal Event',
                    example: '2024-07-10',
                },
                hargaEvent: {
                    type: 'string',
                    description: 'Harga Event',
                    example: 'Rp 100.000',
                },
                pointEvent: {
                    type: 'string',
                    description: 'Point Event',
                    example: '10',
                },
                fotoEvent: {
                    type: 'string',
                    description: 'Foto Event',
                    example: 'path/to/foto.jpg',
                },
                urlPendaftaran: {
                    type: 'string',
                    description: 'URL Pendaftaran',
                    example: 'http://url-pendaftaran.com',
                },
                deskripsiEvent: {
                    type: 'array',
                    items: { type: 'string' },
                    description: 'Deskripsi Event',
                    example: ['Deskripsi singkat tentang event'],
                },
                tempatEvent: {
                    type: 'string',
                    description: 'Tempat Event',
                    example: 'Jakarta',
                },
                quotaEvent: {
                    type: 'string',
                    description: 'Quota Event',
                    example: '100',
                },
                durasiEvent: {
                    type: 'string',
                    description: 'Durasi Event',
                    example: '2 hours',
                },
                narasumber: {
                    type: 'string',
                    description: 'Narasumber',
                    example: 'John Doe',
                },
                contactPerson: {
                    type: 'string',
                    description: 'Contact Person',
                    example: '08123456789',
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
        @Body() updateEventDto: UpdateEventDto,
    ): Promise<Event> {
        const imgSrc = getFileUrl('events', file);
        return this.eventService.update(id, userId, updateEventDto, imgSrc);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete an Event by ID' })
    @ApiParam({ name: 'id', description: 'Event ID' })
    @ApiResponse({ status: 204, description: 'Event successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.eventService.remove(id);
    }
}