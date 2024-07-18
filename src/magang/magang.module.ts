import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Magang } from '../entities/magang.entity';
import { MagangService } from './magang.service';
import { MagangController } from './magang.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Magang]), AuthModule],
  controllers: [MagangController],
  providers: [MagangService],
})
export class MagangModule {}