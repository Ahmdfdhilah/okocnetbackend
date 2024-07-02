import { Controller, Get, Post, Body, Param, Delete, Put, Query } from '@nestjs/common';
import { MasterMentorService } from './master-mentor.service';
import { MasterMentor } from 'src/entities/master-mentor.entity';
import { CreateMasterMentorDto } from './dto/create-master-mentor.dto';
import { UpdateMasterMentorDto } from './dto/update-master-mentor.dto';
import { QueryDto } from 'src/lib/query.dto';

@Controller('master-mentors')
export class MasterMentorController {
    constructor(private readonly masterMentorService: MasterMentorService) { }

    @Post(':userId')
    async create(
        @Param('userId') userId: string,
        @Body() createMasterMentorDto: CreateMasterMentorDto,
    ): Promise<MasterMentor> {
        return this.masterMentorService.create(createMasterMentorDto, userId);
    }

    @Get()
    async findAll(@Query() query: QueryDto): Promise<{masterMentors: MasterMentor[], total: number }> {
        return this.masterMentorService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string): Promise<MasterMentor> {
        return this.masterMentorService.findOne(id);
    }

    @Put(':id/:userId')
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @Body() updateMasterMentorDto: UpdateMasterMentorDto,
    ): Promise<MasterMentor> {
        return this.masterMentorService.update(id, updateMasterMentorDto, userId);
    }

    @Delete(':id')
    async remove(@Param('id') id: string): Promise<void> {
        return this.masterMentorService.remove(id);
    }
}