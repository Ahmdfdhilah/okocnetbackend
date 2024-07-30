import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SyaratMasterMentor } from 'src/entities/syarat-master-mentor.entity';
import { SyaratMasterMentorController } from './syarat-master-mentor.controller';
import { SyaratMasterMentorService } from './syarat-master-mentor.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([SyaratMasterMentor]), AuthModule
    ],
    controllers: [SyaratMasterMentorController],
    providers: [SyaratMasterMentorService],
})
export class SyaratMasterMentorModule {}