import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/entities/review.entity';
import { User } from 'src/entities/user.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), User, AuthModule],
  controllers: [ReviewController],
  providers: [ReviewService]
})
export class ReviewModule {}