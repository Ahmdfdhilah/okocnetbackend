import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { TujuanMasterMentorController } from './tujuan-master-mentor.controller';
import { TujuanMasterMentorService } from './tujuan-master-mentor.service';
import { TujuanMasterMentor } from 'src/entities/tujuan-master-mentor.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([TujuanMasterMentor]), AuthModule
    ],
    controllers: [TujuanMasterMentorController],
    providers: [TujuanMasterMentorService],
})
export class TujuanMasterMentorModule {}