import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Deskripsi } from 'src/entities/deskripsi.entity';
import { DeskripsiDTO } from './dto/deskripsi.dto';

@Injectable()
export class DeskripsiService {
    constructor(
        @InjectRepository(Deskripsi)
        private readonly deskripsiRepository: Repository<Deskripsi>,
    ) { }

    async create(deskripsiDto: DeskripsiDTO): Promise<Deskripsi> {
        const deskripsi = this.deskripsiRepository.create(deskripsiDto);
        return await this.deskripsiRepository.save(deskripsi);
    }

    async findOne(id: string): Promise<Deskripsi> {
        const deskripsi = await this.deskripsiRepository.findOne({ where: { id } });
        if (!deskripsi) {
            throw new NotFoundException('Deskripsi not found');
        }
        return deskripsi;
    }

    async update(deskripsiDto: DeskripsiDTO, id: string): Promise<Deskripsi> {
        const deskripsi = await this.deskripsiRepository.findOne({ where: { id } });
        if (!deskripsi) {
            throw new NotFoundException('Deskripsi not found');
        }

        const updatedDeskripsi = this.deskripsiRepository.merge(deskripsi, deskripsiDto);
        return await this.deskripsiRepository.save(updatedDeskripsi);
    }
}
