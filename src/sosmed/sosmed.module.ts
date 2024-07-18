import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sosmed } from 'src/entities/sosmed.entity';
import { User } from 'src/entities/user.entity';
import { SosmedController } from './sosmed.controller';
import { SosmedService } from './sosmed.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Sosmed]), User, AuthModule],
  controllers: [SosmedController],
  providers: [SosmedService]
})
export class SosmedModule {}