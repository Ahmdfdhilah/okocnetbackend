import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Total } from 'src/entities/total.entity';
import { User } from 'src/entities/user.entity';
import { TotalController } from './total.controller';
import { TotalService } from './total.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Total]), User, AuthModule],
  controllers: [TotalController],
  providers: [TotalService]
})
export class TotalModule {}