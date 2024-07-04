import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { MasterMentorService } from './master-mentor.service';
import { MasterMentor } from 'src/entities/master-mentor.entity';
import { CreateMasterMentorDto } from './dto/create-master-mentor.dto';
import { UpdateMasterMentorDto } from './dto/update-master-mentor.dto';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';

@Controller('master-mentors')
@ApiTags('master-mentors')
export class MasterMentorController {
    constructor(private readonly masterMentorService: MasterMentorService) { }

    @Post(':userId')
    @ApiOperation({ summary: 'Create a new Master Mentor' })
    @ApiBody({ type: CreateMasterMentorDto })
    async create(
        @Param('userId') userId: string,
        @Body() createMasterMentorDto: CreateMasterMentorDto,
    ): Promise<MasterMentor> {
        return this.masterMentorService.create(createMasterMentorDto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Master Mentors' })
    @ApiResponse({ status: 200, description: 'Returns all Master Mentors' })
    async findAll(@Query() query: QueryDto): Promise<{ data: MasterMentor[], total: number }> {
        return this.masterMentorService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Master Mentor by ID' })
    @ApiParam({ name: 'id', description: 'Master Mentor ID' })
    @ApiResponse({ status: 200, description: 'Returns the Master Mentor' })
    async findOne(@Param('id') id: string): Promise<MasterMentor> {
        return this.masterMentorService.findOne(id);
    }

    @Put(':id/:userId')
    @ApiOperation({ summary: 'Update a Master Mentor by ID' })
    @ApiParam({ name: 'id', description: 'Master Mentor ID' })
    @ApiBody({ type: UpdateMasterMentorDto })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @Body() updateMasterMentorDto: UpdateMasterMentorDto,
    ): Promise<MasterMentor> {
        return this.masterMentorService.update(id, updateMasterMentorDto, userId);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Master Mentor by ID' })
    @ApiParam({ name: 'id', description: 'Master Mentor ID' })
    @ApiResponse({ status: 204, description: 'Master Mentor successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.masterMentorService.remove(id);
    }
}