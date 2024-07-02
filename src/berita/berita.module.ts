import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Berita } from 'src/entities/berita.entity';
import { BeritaService } from './berita.service';
import { BeritaController } from './berita.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Berita])],
  providers: [BeritaService],
  controllers: [BeritaController],
})
export class BeritaModule {}
