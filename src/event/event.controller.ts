import { Controller, Get, Post, Body, Param, Delete, Query, Put, UseInterceptors, UploadedFile } from '@nestjs/common';
import { EventService } from './event.service';
import { Event } from 'src/entities/event.entity';
import { QueryDto } from 'src/lib/query.dto';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileUploadOptions, getFileUrl } from 'src/lib/file-upload.util';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('events')
@ApiTags('events')
export class EventController {
  constructor(private readonly eventService: EventService) {}

  @Post(':userId')
  @ApiOperation({ summary: 'Create a new Event' })
  @ApiBody({ type: CreateEventDto })
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('events')))
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
  @ApiOperation({ summary: 'Update an Event by ID' })
  @ApiParam({ name: 'id', description: 'Event ID' })
  @ApiBody({ type: UpdateEventDto })
  @UseInterceptors(FileInterceptor('file', fileUploadOptions('events')))
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