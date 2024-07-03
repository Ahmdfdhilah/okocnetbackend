import { MiddlewareConsumer, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { RateLimiterMiddleware } from './security/rate-limiter.middleware';
import { APP_GUARD } from '@nestjs/core';
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
import { MasterMentorModule } from './master-mentor/master-mentor.module';
import { MerchandiseModule } from './merchandise/merchandise.module';
import { PeluangKerjaModule } from './peluang-kerja/peluang-kerja.module';
import { PeluangUsahaModule } from './peluang-usaha/peluang-usaha.module';
import { PenggerakOkoceModule } from './penggerak-okoce/penggerak-okoce.module';
import { PengurusModule } from './pengurus/pengurus.module';
import { StrukturPengurusDirektoratModule } from './struktur-pengurus-direktorat/struktur-pengurus-direktorat.module';
import { StrukturPengurusEksekutifModule } from './struktur-pengurus-eksekutif/struktur-pengurus-eksekutif.module';
import { StrukturPengurusKurasiModule } from './struktur-pengurus-kurasi/struktur-pengurus-eksekutif.module';
import { StrukturPengurusPembinaModule } from './struktur-pengurus-pembina/struktur-pengurus-eksekutif.module';

@Module({
    imports: [
        ConfigModule.forRoot(),
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
        MagangModule,
        DonasiModule,
        MasterMentorModule,
        BrandLokalModule,
        MerchandiseModule,
        PeluangKerjaModule,
        EventModule,
        PengurusModule,
        PeluangUsahaModule,
        StrukturPengurusDirektoratModule,
        PenggerakOkoceModule,
        StrukturPengurusEksekutifModule,
        StrukturPengurusKurasiModule,
        StrukturPengurusPembinaModule,
        SeederModule,
        AuthModule,
    ],
    providers: [
        MailService,
        BackupService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
        RateLimiterMiddleware,
    ],
})
export class AppModule {
    constructor(private readonly seederService: SeederService) {}

    async onModuleInit() {
        await this.seederService.seedAdminUser();
    }
    configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(RateLimiterMiddleware)
            .forRoutes('auth/login');
    }
}
