import { Body, Controller, Get, Param, Post, Put, Req, UnauthorizedException, UseGuards, Headers } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalGuard } from './guards/local.guards';
import { JwtAuthGuard } from './guards/jwt.guards';
import { RolesGuard } from './guards/roles.guards';
import { Roles } from './decorators/roles.decorators';
import { UpdateUserDtoType } from 'src/users/dto/update-user.dto';
import { CreateUserDtoType } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(JwtAuthGuard)
    @Get('me')
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
    async login(@Req() req) {
        const user = req.user;
        console.log(user);
        if (!user.confirmed) {
          throw new UnauthorizedException('User not confirmed');
      }
        return { accessToken: this.authService.getJwtToken(user) };
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Put(':id')
    async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDtoType) {
        return this.authService.updateUser(id, updateUserDto);
    }

    @Post('register')
    async register(@Body() createUserDto: CreateUserDtoType) {
        return this.authService.createUser(createUserDto);
    }


    @UseGuards(JwtAuthGuard)
    @Post('forgot-password')
    async forgotPassword(@Body('email') email: string) {
        return this.authService.initiatePasswordReset(email);
    }

    @UseGuards(JwtAuthGuard)
    @Post('reset-password')
    async resetPassword(@Body('resetPasswordToken') resetPasswordToken: string, @Body('newPassword') newPassword: string) {
        return this.authService.resetPassword(resetPasswordToken, newPassword);
    }

    @UseGuards(JwtAuthGuard)
    @Post('resend-reset-password')
    async resendResetPassword(@Body('email') email: string) {
        return this.authService.resendResetPassword(email);
    }

    @UseGuards(JwtAuthGuard)
    @Get('validate-token')
    async validateToken(@Req() req) {
        const user = req.user;
        return { message: 'Token is valid', user };
    }
}
