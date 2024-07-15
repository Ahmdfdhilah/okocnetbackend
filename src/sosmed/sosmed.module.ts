import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sosmed } from 'src/entities/sosmed.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sosmed])],

})
export class SosmedModule {}