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
