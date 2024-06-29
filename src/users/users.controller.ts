import { Controller, Get, Delete, Param, Query, UseGuards, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from 'src/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guards';
import { Roles } from 'src/auth/decorators/roles.decorators';
import { QueryDto, QuerySchema } from 'src/query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<User | undefined> {
    return this.usersService.findOne(id);
  }
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  async findAll(@Query() query: any): Promise<{ users: User[], total: number }> {
    if (query.page) {
      query.page = Number(query.page);
    }
    if (query.limit) {
      query.limit = Number(query.limit);
    }

    const result = QuerySchema.safeParse(query);
    if (!result.success) {
      throw new BadRequestException(result.error.errors);
    }
    return this.usersService.findAll(result.data as QueryDto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
