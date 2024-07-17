import { Controller, Post, Body, Get, Put, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiConsumes } from '@nestjs/swagger';
import { DeskripsiService } from './deskripsi.service';
import { DeskripsiDTO } from './dto/deskripsi.dto';

@ApiTags('deskripsi')
@Controller('deskripsi')
export class DeskripsiController {
    constructor(private readonly deskripsiService: DeskripsiService) { }

    @Post()
    @ApiOperation({ summary: 'Create or Update Deskripsi' })
    @ApiConsumes('application/json')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                title: {
                    type: 'string',
                    example: 'Deskripsi Title',
                },
                deskripsi: {
                    type: 'string',
                    example: 'Deskripsi content.',
                },
            },
            required: ['title', 'deskripsi'],
        },
    })
    async createOrUpdate(@Body() deskripsiDto: DeskripsiDTO): Promise<any> {
        return await this.deskripsiService.createOrUpdate(deskripsiDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get a Deskripsi by ID' })
    async findOne(): Promise<any> {
        return await this.deskripsiService.findOne();
    }
}