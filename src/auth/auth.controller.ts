import { Body, Controller, Get, Param, Post, Put, Req, UnauthorizedException, UseGuards, Headers } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody, ApiHeader } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guards';
import { JwtAuthGuard } from './guards/jwt.guards';
import { RolesGuard } from './guards/roles.guards';
import { Roles } from './decorators/roles.decorators';
import { UpdateUserDto } from 'src/users/dto/update-user.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import { AuthPayloadDto } from './dto/auth.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ForgotPasswordTokenDto } from './dto/forgot-password-token.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
    @ApiOperation({ summary: 'Get current user information' })
    @ApiHeader({ name: 'Authorization', description: 'Bearer token', required: true })
    @ApiResponse({ status: 200, description: 'User information retrieved', type: User })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    getMe(@Headers('Authorization') authorization: string) {
        if (!authorization) {
            throw new UnauthorizedException('No token provided');
        }

        const token = authorization.replace('Bearer ', '');
        const userId = this.authService.getUserIdFromToken(token);
        return { userId };
    }

    @UseGuards(LocalGuard)
    @Post('login')
    @ApiOperation({ summary: 'Login user' })
    @ApiBody({ type: AuthPayloadDto })
    @ApiResponse({ status: 201, description: 'Returns JWT token.' })
    async login(@Body() authPayloadDto: AuthPayloadDto, @Req() req) {
        const user = req.user;
        return { accessToken: this.authService.getJwtToken(user) };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    @ApiOperation({ summary: 'Update user information' })
    @ApiParam({ name: 'id', description: 'User ID', required: true })
    @ApiBody({ type: UpdateUserDto, description: 'User update data' })
    @ApiResponse({ status: 200, description: 'User updated successfully', type: User })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.authService.updateUser(id, updateUserDto);
    }

    @Post('register')
    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: CreateUserDto, description: 'New user registration data' })
    @ApiResponse({ status: 201, description: 'User registered successfully', type: User })
    @ApiResponse({ status: 400, description: 'Bad request' })
    async register(@Body() createUserDto: CreateUserDto) {
        return this.authService.createUser(createUserDto);
    }

    @Post('forgot-password')
    @ApiOperation({ summary: 'Initiate password reset' })
    @ApiBody({type: ForgotPasswordDto, description: 'Email User', required:true})
    @ApiResponse({ status: 200, description: 'Password reset initiated' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    async forgotPassword(@Body('email') email: string) {
        return this.authService.initiatePasswordReset(email);
    }

    @Post('reset-password')
    @ApiOperation({ summary: 'Reset password' })
    @ApiBody({ type: ForgotPasswordTokenDto, description: 'Reset password token and new password', required: true })
    @ApiResponse({ status: 200, description: 'Password reset successfully' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    async resetPassword(@Body('resetPasswordToken') resetPasswordToken: string, @Body('newPassword') newPassword: string) {
        return this.authService.resetPassword(resetPasswordToken, newPassword);
    }

    @Post('resend-reset-password')
    @ApiOperation({ summary: 'Resend password reset email' })
    @ApiBody({ description: 'User email', required: true })
    @ApiResponse({ status: 200, description: 'Password reset email resent' })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    async resendResetPassword(@Body('email') email: string) {
        return this.authService.resendResetPassword(email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('validate-token')
    @ApiOperation({ summary: 'Validate JWT token' })
    @ApiHeader({ name: 'Authorization', description: 'Bearer token', required: true })
    @ApiResponse({ status: 200, description: 'Token is valid', type: User })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiBearerAuth()
    async validateToken(@Req() req) {
        const user = req.user;
        return { message: 'Token is valid', user };
    }
}