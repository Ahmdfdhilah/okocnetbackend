import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('peluang_usahas')
export class PeluangUsaha {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    judulUsaha: string;

    @Column({ type: 'text', nullable: false })
    fotoUsaha: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    lokasiUsaha: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    kategoriUsaha: string;

    @Column({ type: 'text', nullable: false })
    tentangProgram: string;

    @Column({ type: 'text', nullable: false })
    benefitProgram: string;

    @Column({ type: 'text', nullable: false })
    jobdescUsaha: string;

    @Column({ type: 'text', nullable: false })
    kriteriaUsaha: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
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
