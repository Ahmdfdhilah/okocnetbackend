import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PenggerakOkoce } from 'src/entities/penggerak-okoce.entity';
import { PenggerakOkoceController } from './penggerak-okoce.controller';
import { PenggerakOkoceService } from './penggerak-okoce.service';
import { AuthModule } from 'src/auth/auth.module';
@Module({
  imports: [TypeOrmModule.forFeature([PenggerakOkoce]), AuthModule],
  controllers: [PenggerakOkoceController],
  providers: [PenggerakOkoceService],
})
export class PenggerakOkoceModule {}
