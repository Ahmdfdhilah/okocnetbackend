import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Merchandise } from 'src/entities/merchandise.entity';
import { MerchandiseController } from './merchandise.controller';
import { MerchandiseService } from './merchandise.service';

@Module({
  imports: [TypeOrmModule.forFeature([Merchandise])],
  controllers: [MerchandiseController],
  providers: [MerchandiseService],
})
export class MerchandiseModule {}
