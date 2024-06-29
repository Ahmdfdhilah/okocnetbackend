import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthPayloadDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { CreateUserDtoType } from 'src/users/dto/create-user.dto';
import { UpdateUserDtoType } from 'src/users/dto/update-user.dto';
import { randomBytes } from 'crypto'; // Import crypto for token generation

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
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
      }
    };

    this.logger.log("Password comparison failed");
    return null;
  }

  getJwtToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }

  async createUser(createUserDto: CreateUserDtoType): Promise<any> {
    const { password, ...userData } = createUserDto;

    // Generate confirmation token
    const confirmationToken = randomBytes(20).toString('hex');

    const user = await this.userService.create({
      ...userData,
      password,
      confirmationToken,
    });

    // nanti kirim email
    return { user };
  }

  async confirmEmail(confirmationToken: string): Promise<any> {
    const user = await this.userService.findByConfirmationToken(confirmationToken);
    if (!confirmationToken){
      throw new UnauthorizedException('No token provided for confirmation')
    } 
    if (!user) {
      throw new UnauthorizedException('Invalid or expired confirmation token');
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

    // implementasi kirim email nanti 
    return { message: 'Password reset initiated successfully' };
  }

  async resetPassword(resetPasswordToken: string, newPassword: string): Promise<any> {
    const user = await this.userService.findByResetPasswordToken(resetPasswordToken);

    if (!user) {
      throw new UnauthorizedException('Invalid or expired reset password token');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null; // Clear the reset password token after resetting password

    await this.userService.save(user);

    return { message: 'Password reset successful' };
  }

  async updateUser(id: string, updateUserDto: UpdateUserDtoType): Promise<any> {
    const user = await this.userService.update(id, updateUserDto);
    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);
    return { user, accessToken };
  }
}
