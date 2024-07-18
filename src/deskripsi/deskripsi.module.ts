import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Deskripsi } from 'src/entities/deskripsi.entity';
import { User } from 'src/entities/user.entity';
import { DeskripsiController } from './deskripsi.controller';
import { DeskripsiService } from './deskripsi.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Deskripsi]), User, AuthModule],
  controllers: [DeskripsiController],
  providers: [DeskripsiService]
})
export class DeskripsiModule {}