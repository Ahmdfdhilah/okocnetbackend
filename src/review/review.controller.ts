import { Controller, Get, Post, Body, Param, Delete, Put, UseInterceptors, UploadedFile, Query } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from 'src/entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryDto } from 'src/lib/query.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiConsumes } from '@nestjs/swagger';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
    constructor(private readonly reviewService: ReviewService) {}

    @Post(':userId')
    @ApiOperation({ summary: 'Create a new Review' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            required: ['deskripsi', 'nama', 'posisi', 'publishedAt'],
            properties: {
                deskripsi: {
                    type: 'string',
                    description: 'Deskripsi dari review.',
                    example: 'Excellent service and quality.',
                },
                nama: {
                    type: 'string',
                    description: 'Nama dari reviewer.',
                    example: 'John Doe',
                },
                posisi: {
                    type: 'string',
                    description: 'Posisi dari reviewer.',
                    example: 'Manager',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Tanggal publikasi dari review.',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async create(
        @Param('userId') userId: string,
        @Body() createReviewDto: CreateReviewDto,
    ): Promise<Review> {
        return this.reviewService.create(createReviewDto, userId);
    }

    @Get()
    @ApiOperation({ summary: 'Get all Reviews' })
    @ApiResponse({ status: 200, description: 'Returns all Reviews' })
    async findAll(@Query() query: QueryDto): Promise<{ data: Review[], total: number }> {
        return this.reviewService.findAll(query);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a Review by ID' })
    @ApiParam({ name: 'id', description: 'Review ID' })
    @ApiResponse({ status: 200, description: 'Returns the Review' })
    async findOne(@Param('id') id: string): Promise<Review> {
        return this.reviewService.findOne(id);
    }

    @Put(':id/:userId')
    @ApiOperation({ summary: 'Update a Review by ID' })
    @ApiParam({ name: 'id', description: 'Review ID' })
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                deskripsi: {
                    type: 'string',
                    description: 'Deskripsi dari review.',
                    example: 'Excellent service and quality.',
                },
                nama: {
                    type: 'string',
                    description: 'Nama dari reviewer.',
                    example: 'John Doe',
                },
                posisi: {
                    type: 'string',
                    description: 'Posisi dari reviewer.',
                    example: 'Manager',
                },
                publishedAt: {
                    type: 'string',
                    format: 'date-time',
                    description: 'Tanggal publikasi dari review.',
                    example: '2024-07-03T04:48:57.000Z',
                },
            },
        },
    })
    async update(
        @Param('id') id: string,
        @Param('userId') userId: string,
        @Body() updateReviewDto: UpdateReviewDto,
    ): Promise<Review> {
        return this.reviewService.update(id, userId, updateReviewDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a Review by ID' })
    @ApiParam({ name: 'id', description: 'Review ID' })
    @ApiResponse({ status: 204, description: 'Review successfully deleted' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.reviewService.remove(id);
    }
}