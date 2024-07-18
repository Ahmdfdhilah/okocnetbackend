import { Controller, Get, Post, Body, Param, Delete, Put, Query, UseGuards } from '@nestjs/common';
import { TotalService } from './total.service';
import { Total } from 'src/entities/total.entity';
import { CreateTotalDto } from './dto/create-total.dto';
import { UpdateTotalDto } from './dto/update-total.dto';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';

@ApiTags('totals')
@Controller('totals')
export class TotalController {
    constructor(private readonly totalService: TotalService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Post(':userId')
    @ApiOperation({ summary: 'Create a new Total' })
    @ApiBearerAuth()
    @ApiConsumes('application/json')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['total', 'nama'],
            properties: {
                total: {
                    type: 'integer',
                    description: 'Total value.',
                    example: 100,
                },
                nama: {
                    type: 'string',
                    enum: ['umkm', 'penggerak', 'usaha', 'swasta', 'pemerintah', 'pendidikan'],
                    description: 'Name of the social media platform.',
                    example: 'umkm',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Published date of the total.',
                    example: '2024-07-15T12:00:00Z',
                },
            },
        },
    })
    @ApiResponse({ status: 201, description: 'The Total has been successfully created', type: Total })
    async create(
        @Param('userId') userId: string,
        @Body() createTotalDto: CreateTotalDto,
    ): Promise<Total> {
        console.log(createTotalDto);
        return this.totalService.create(createTotalDto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Totals' })
    @ApiResponse({ status: 200, description: 'Returns all Totals', type: Total, isArray: true })
    async findAll(@Query() query: QueryDto): Promise<{ data: Total[], total: number }> {
        return this.totalService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Total by ID' })
    @ApiParam({ name: 'id', description: 'Total ID' })
    @ApiResponse({ status: 200, description: 'Returns the Total', type: Total })
    async findOne(@Param('id') id: string): Promise<Total> {
        return this.totalService.findOne(id);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id/:userId')
    @ApiOperation({ summary: 'Update a Total by ID' })
    @ApiParam({ name: 'id', description: 'Total ID' })
    @ApiBearerAuth()
    @ApiConsumes('application/json')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                total: {
                    type: 'integer',
                    description: 'Total value.',
                    example: 150,
                },
                nama: {
                    type: 'string',
                    enum: ['umkm', 'penggerak', 'usaha', 'swasta', 'pemerintah', 'pendidikan'],
                    description: 'Name of the social media platform.',
                    example: 'umkm',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Published date of the total.',
                    example: '2024-07-15T12:00:00Z',
                },
            },
        },
    })
    @ApiResponse({ status: 200, description: 'The Total has been successfully updated', type: Total })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @Body() updateTotalDto: UpdateTotalDto,
    ): Promise<Total> {
        return this.totalService.update(id, userId, updateTotalDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Total by ID' })
    @ApiParam({ name: 'id', description: 'Total ID' })
    @ApiBearerAuth()
    @ApiResponse({ status: 204, description: 'The Total has been successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.totalService.remove(id);
    }
}
