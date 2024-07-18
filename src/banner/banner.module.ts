import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Banner } from 'src/entities/banner.entity';
import { User } from 'src/entities/user.entity';
import { BannerController } from './banner.controller';
import { BannerService } from './banner.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Banner]), User, AuthModule],
  controllers: [BannerController],
  providers: [BannerService]

})
export class BannerModule {}