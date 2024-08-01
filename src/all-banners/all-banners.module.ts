import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { AllBanner } from 'src/entities/all-banner.entity';
import { AllBannerService } from './all-banners.service';
import { AllBannerController } from './all-banners.controller';

@Module({
    imports: [TypeOrmModule.forFeature([AllBanner]), AuthModule],
    providers: [AllBannerService],
    controllers: [AllBannerController],
})
export class AllBannerModule { }