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

@Module({
    imports: [
        ConfigModule.forRoot(),
        // ThrottlerModule.forRoot([{
        //     ttl: 10,
        //     limit: 10,
        // }]),
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
        SeederModule,
        AuthModule,
    ],
    controllers: [],
    providers: [
        MailService,
        // {
        //     provide: APP_GUARD,
        //     useClass: ThrottlerGuard,
        // },
        // RateLimiterMiddleware,
    ],
})
export class AppModule {
    constructor(private readonly seederService: SeederService) {}

    async onModuleInit() {
        await this.seederService.seedAdminUser();
    }
    // configure(consumer: MiddlewareConsumer) {
    //     consumer
    //         .apply(RateLimiterMiddleware)
    //         .forRoutes('auth/login');
    // }
}
