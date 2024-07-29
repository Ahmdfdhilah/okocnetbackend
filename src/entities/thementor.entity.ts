import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Teks } from './teks.entity';

@Entity('thementors')
export class Thementor {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    judul: string;

    @OneToMany(() => Teks, teks => teks.thementor, { cascade: true })
    deskripsi: Teks[];
  
    @Column({ type: 'simple-array', nullable: false })
    dokumentasi: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}