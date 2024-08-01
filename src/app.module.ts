import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RateLimiterMiddleware } from './security/rate-limiter.middleware';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { UsersModule } from './users/users.module';
import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';
import { AuthModule } from './auth/auth.module';
import { MailService } from './mails/mail.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BackupService } from './backup/backup.service';
import { BeritaModule } from './berita/berita.module';
import { MagangModule } from './magang/magang.module';
import { BrandLokalModule } from './brand-lokal/brand-lokal.module';
import { DonasiModule } from './donasi/donasi.module';
import { EventModule } from './event/event.module';
import { BenefitMasterMentorModule } from './benefit-master-mentor/benefit-master-mentor.module';
import { MerchandiseModule } from './merchandise/merchandise.module';
import { PeluangKerjaModule } from './peluang-kerja/peluang-kerja.module';
import { PeluangUsahaModule } from './peluang-usaha/peluang-usaha.module';
import { PenggerakOkoceModule } from './penggerak-okoce/penggerak-okoce.module';
import { StrukturPengurusModule } from './struktur-pengurus/struktur-pengurus.module';
import { SosmedModule } from './sosmed/sosmed.module';
import { MitraModule } from './mitra/mitra.module';
import { ReviewModule } from './review/review.module';
import { TotalModule } from './total/total.module';
import { DeskripsiModule } from './deskripsi/deskripsi.module';
import { BannerModule } from './banner/banner.module';
import { ProfileModule } from './profile/profile.module';
import { ThrottlerExceptionFilter } from './security/throttler-exception.filter';
import { AnniversaryModule } from './anniversary/anniversary.module';
import { ThementorModule } from './thementor/thementor.module';
import { TujuanMasterMentorModule } from './tujuan-master-mentor/tujuan-master-mentor.module';
import { SyaratMasterMentorModule } from './syarat-master-mentor/syarat-master-mentor.module';
import { BenefitTrainerModule } from './benefit-trainer/benefit-trainer-module';
import { LogoModule } from './logo/logo.module';
import { EmakKeceModule } from './emak-kece/emak-kece.module';
import { SyaratTrainerModule } from './syarat-trainer/syarat-trainer.module';
import { AllBannerModule } from './all-banners/all-banners.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot([{
            ttl: 10,
            limit: 10,
        }]),
        ScheduleModule.forRoot(),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: +process.env.DB_PORT,
            username: process.env.DB_USERNAME,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true
        }),
        UsersModule,
        BeritaModule,
        AnniversaryModule,
        MagangModule,
        DonasiModule,
        BenefitMasterMentorModule,
        BenefitTrainerModule,
        TujuanMasterMentorModule,
        SyaratMasterMentorModule,
        SyaratTrainerModule,
        BrandLokalModule,
        MerchandiseModule,
        PeluangKerjaModule,
        EventModule,
        PeluangUsahaModule,
        StrukturPengurusModule,
        ThementorModule,
        AllBannerModule,
        PenggerakOkoceModule,
        MitraModule,
        TotalModule,
        DeskripsiModule,
        BannerModule,
        SosmedModule,
        EmakKeceModule,
        ProfileModule,
        ReviewModule,
        LogoModule,
        SeederModule,
        AuthModule,
    ],
    providers: [
        MailService,
        BackupService,
        RateLimiterMiddleware,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        {
            provide: APP_FILTER,
            useClass: ThrottlerExceptionFilter,
        }
    ],
})
export class AppModule {
    constructor(private readonly seederService: SeederService) { }

    async onModuleInit() {
        await this.seederService.seedAdminUser();
    }
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RateLimiterMiddleware)
            .forRoutes('auth/login');
    }
}