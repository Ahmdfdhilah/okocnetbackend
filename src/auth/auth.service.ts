import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthPayloadDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDtoType } from 'src/users/dto/create-user.dto';
import { UpdateUserDtoType } from 'src/users/dto/update-user.dto';
import { randomBytes } from 'crypto';
import { MailService } from 'src/mails/mail.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
    private mailService: MailService, 
  ) { }

  decodeToken(token: string): any {
    try {
      return this.jwtService.decode(token);
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }

  getUserIdFromToken(token: string): string {
    const decodedToken = this.decodeToken(token);
    return decodedToken?.sub;
  }

  async getUserRole(userId: string): Promise<string> {
    try {
      const user = await this.userService.findOne(userId);
      return user.role;
    } catch (error) {
      console.error('Error fetching user role:', error);
      throw new UnauthorizedException('Failed to fetch user role');
    }
  }

  async validateUser({ email, password }: AuthPayloadDto): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      this.logger.log(`User not found: ${email}`);
      return null;
    }

    if (await bcrypt.compare(password, user.password)) {
      return {
        ...user,
        password: undefined,
      };
    }

    this.logger.log("Password comparison failed");
    return null;
  }

  getJwtToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async createUser(createUserDto: CreateUserDtoType): Promise<any> {
    const { email, username, password, ...userData } = createUserDto;

    const existingUser = await this.userService.findByUsernameOrEmail(username, email);
    if (existingUser) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      } else if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
    }

    const confirmationToken = randomBytes(20).toString('hex');

    const user = await this.userService.create({
      ...userData,
      username,
      email,
      password,
      confirmationToken,
    });

    const confirmEmailSubject = 'Confirm Your Email';
    const confirmEmailTitle = 'Confirm Email';
    const confirmEmailBody = 'Please click the link below to confirm your email address.';
    const confirmEmailActionUrl = `http://localhost:3000/auth/email/confirm-email/${confirmationToken}`;
    const confirmEmailActionText = 'Confirm Email';

    await this.mailService.sendTemplateMail(
      user.email,
      confirmEmailSubject,
      confirmEmailTitle,
      confirmEmailBody,
      confirmEmailActionUrl,
      confirmEmailActionText,
    );

    return { user };
  }

  
  async updateUser(id: string, updateUserDto: UpdateUserDtoType): Promise<any> {
    const { username, email, ...updateData } = updateUserDto;
    const existingUser = await this.userService.findByUsernameOrEmail(username, email);

    if (existingUser && existingUser.id !== id) {
      if (existingUser.email === email) {
        throw new ConflictException('Email already exists');
      } else if (existingUser.username === username) {
        throw new ConflictException('Username already exists');
      }
    }
    const updateUserData = {...updateData, username, email}
    const user = await this.userService.update(id, updateUserData);
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { user, accessToken };
  }

  async confirmEmail(confirmationToken: string): Promise<any> {
    const user = await this.userService.findByConfirmationToken(confirmationToken);
    if (!confirmationToken) {
      throw new UnauthorizedException('No token provided for confirmation');
    }
    if (!user) {
      throw new UnauthorizedException('Invalid confirmation token');
    }

    user.confirmed = true;
    user.confirmationToken = null;

    await this.userService.save(user);

    return { message: 'Email confirmed successfully' };
  }

  async initiatePasswordReset(email: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const resetPasswordToken = randomBytes(20).toString('hex');

    user.resetPasswordToken = resetPasswordToken;

    await this.userService.save(user);
    const resetPasswordSubject = 'Reset Your Password';
    const resetPasswordTitle = 'Reset Password';
    const resetPasswordBody = 'Please click the link below to reset your password.';
    const resetPasswordActionUrl = `http://nanti-ke-frontend-biar-user-ketik new password?token=${resetPasswordToken}`;
    const resetPasswordActionText = 'Reset Password';

    await this.mailService.sendTemplateMail(
      user.email,
      resetPasswordSubject,
      resetPasswordTitle,
      resetPasswordBody,
      resetPasswordActionUrl,
      resetPasswordActionText,
    );

    return { message: 'Password reset initiated successfully',
      token: resetPasswordToken
     };
  }

  async resendConfirmationEmail(email: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const confirmationToken = randomBytes(20).toString('hex');
    user.confirmationToken = confirmationToken;

    await this.userService.save(user);

    const confirmEmailSubject = 'Confirm Your Email';
    const confirmEmailTitle = 'Confirm Email';
    const confirmEmailBody = 'Please click the link below to confirm your email address.';
    const confirmEmailActionUrl = `http://localhost:3000/auth/email/confirm-email/${confirmationToken}`;
    const confirmEmailActionText = 'Confirm Email';

    await this.mailService.sendTemplateMail(
      user.email,
      confirmEmailSubject,
      confirmEmailTitle,
      confirmEmailBody,
      confirmEmailActionUrl,
      confirmEmailActionText,
    );

    return { message: 'Confirmation email resent successfully' };
  }

  async resendResetPassword(email: string): Promise<any> {
    const user = await this.userService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const resetPasswordToken = randomBytes(20).toString('hex');
    user.resetPasswordToken = resetPasswordToken;

    await this.userService.save(user);

    const resetPasswordSubject = 'Reset Your Password';
    const resetPasswordTitle = 'Reset Password';
    const resetPasswordBody = 'Please click the link below to reset your password.';
    const resetPasswordActionUrl = `http://nanti-ke-frontend-biar-user-ketik new password?token=${resetPasswordToken}`;
    const resetPasswordActionText = 'Reset Password';

    await this.mailService.sendTemplateMail(
      user.email,
      resetPasswordSubject,
      resetPasswordTitle,
      resetPasswordBody,
      resetPasswordActionUrl,
      resetPasswordActionText,
    );

    return { message: 'Reset password email resent successfully' };
  }

  async resetPassword(resetPasswordToken: string, newPassword: string): Promise<any> {
    const user = await this.userService.findByResetPasswordToken(resetPasswordToken);

    if (!user) {
      throw new UnauthorizedException('Invalid reset password token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;

    await this.userService.save(user);

    return { message: 'Password reset successful' };
  }
}
