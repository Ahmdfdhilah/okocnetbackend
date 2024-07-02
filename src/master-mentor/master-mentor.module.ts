import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MasterMentor } from 'src/entities/master-mentor.entity';
import { MasterMentorController } from './master-mentor.controller';
import { MasterMentorService } from './master-mentor.service';

@Module({
  imports: [TypeOrmModule.forFeature([MasterMentor])],
  controllers: [MasterMentorController],
  providers: [MasterMentorService],
})
export class MasterMentorModule {}
