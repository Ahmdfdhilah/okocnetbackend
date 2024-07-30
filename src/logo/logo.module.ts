import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogoService } from './logo.service';
import { LogoController } from './logo.controller';
import { Logo } from 'src/entities/logo.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Logo]),
        AuthModule
    ],
    providers: [LogoService],
    controllers: [LogoController],
})
export class LogoModule { }
