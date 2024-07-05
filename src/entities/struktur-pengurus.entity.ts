import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('struktur_penguruses')
export class StrukturPengurus {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    nama: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    jabatan: string;

    @Column({ type: 'text', nullable: true })
    foto: string;

    @Column({ type: 'enum', enum: ['founder', 'eksekutif', 'harian', 'kurasi', 'pembina', 'direktorat'], nullable: false })
    tipe: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    publishedAt: Date;

    @ManyToOne(() => User, { nullable: true })
    createdBy: User;

    @ManyToOne(() => User, { nullable: true })
    updatedBy: User;
}
