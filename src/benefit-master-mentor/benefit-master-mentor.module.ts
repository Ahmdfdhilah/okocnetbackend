import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BenefitMasterMentor } from 'src/entities/benefit-master-mentor.entity';
import { BenefitMasterMentorController } from './benefit-master-mentor.controller';
import { BenefitMasterMentorService } from './benefit-master-mentor.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([BenefitMasterMentor]), AuthModule
    ],
    controllers: [BenefitMasterMentorController],
    providers: [BenefitMasterMentorService],
})
export class BenefitMasterMentorModule {}