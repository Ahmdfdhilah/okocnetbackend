import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Thementor } from 'src/entities/thementor.entity';
import { ThementorController } from './thementor.controller';
import { ThementorService } from './thementor.service';
import { Teks } from 'src/entities/teks.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Thementor]), AuthModule, Teks],
  controllers: [ThementorController],
  providers: [ThementorService],
})
export class ThementorModule {}
