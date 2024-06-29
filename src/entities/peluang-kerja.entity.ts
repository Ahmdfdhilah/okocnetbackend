import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('peluang_kerjas')
export class PeluangKerja {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    judulKerja: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    lokasiKerja: string;

    @Column({ type: 'text', nullable: false })
    fotoKerja: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    kategoriKerja: string;

    @Column({ type: 'text', nullable: false })
    tentangProgram: string;

    @Column({ type: 'text', nullable: false })
    benefitProgram: string;

    @Column({ type: 'text', nullable: false })
    jobdescKerja: string;

    @Column({ type: 'text', nullable: false })
    kriteriaPeserta: string;

    @Column({ type: 'text', nullable: false })
    urlPendaftaran: string;

    @Column({ type: 'enum', enum: ['Full-Time', 'Part-Time', 'Contract', 'Volunteer'], nullable: false })
    sistemKerja: string;

    @Column({ type: 'text', nullable: true })
    periodePendaftaran: string;

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
