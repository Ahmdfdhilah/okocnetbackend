import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { BenefitTrainer } from 'src/entities/benefit-trainer.entity';
import { BenefitTrainerController } from './benefit-trainer-controller';
import { BenefitTrainerService } from './benefit-trainer.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([BenefitTrainer]),
        AuthModule,
    ],
    controllers: [BenefitTrainerController],
    providers: [BenefitTrainerService], 
})
export class BenefitTrainerModule {}
