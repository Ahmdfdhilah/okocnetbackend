import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Anniversary } from 'src/entities/anniversary.entity';
import { AnniversaryService } from './anniversary.service';
import { AnniversaryController } from './anniversary.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Anniversary]), AuthModule],
    providers: [AnniversaryService],
    controllers: [AnniversaryController],
})
export class AnniversaryModule { }