import { Controller, Post, Body, Get, Put, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { DeskripsiService } from './deskripsi.service';
import { DeskripsiDTO } from './dto/deskripsi.dto';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@ApiTags('deskripsi')
@Controller('deskripsi')
export class DeskripsiController {
    constructor(private readonly deskripsiService: DeskripsiService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post()
    @ApiOperation({ summary: 'Create or Update Deskripsi' })
    @ApiBearerAuth()
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