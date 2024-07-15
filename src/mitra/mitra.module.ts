import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Mitra } from 'src/entities/mitra.entity';
import { User } from 'src/entities/user.entity';
import { MitraController } from './mitra.controller';
import { MitraService } from './mitra.service';

@Module({
  imports: [TypeOrmModule.forFeature([Mitra]), User],
  controllers: [MitraController],
  providers: [MitraService]
})
export class MitraModule {}