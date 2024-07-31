import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SyaratTrainerController } from './syarat-trainer.controller';
import { SyaratTrainerService } from './syarat-trainer.service';
import { SyaratTrainer } from 'src/entities/syarat-trainer.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([SyaratTrainer]), AuthModule
    ],
    controllers: [SyaratTrainerController],
    providers: [SyaratTrainerService],
})
export class SyaratTrainerModule { }