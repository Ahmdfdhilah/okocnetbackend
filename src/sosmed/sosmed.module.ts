import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sosmed } from 'src/entities/sosmed.entity';
import { User } from 'src/entities/user.entity';
import { SosmedController } from './sosmed.controller';
import { SosmedService } from './sosmed.service';

@Module({
  imports: [TypeOrmModule.forFeature([Sosmed]), User],
  controllers: [SosmedController],
  providers: [SosmedService]
})
export class SosmedModule {}