import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { EmakKece } from 'src/entities/emak-kece.entity';
import { EmakKeceService } from './emak-kece.service';
import { EmakKeceController } from './emak-kece.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([EmakKece]),
        AuthModule
    ],
    providers: [EmakKeceService],
    controllers: [EmakKeceController],
})
export class EmakKeceModule { }
