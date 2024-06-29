import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('magangs')
export class Magang {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    judulMagang: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    lokasiMagang: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    durasiMagang: string;

    @Column({ type: 'enum', enum: ['Hybrid', 'WFO (Work From Office)', 'WFH (Work From Home)'], nullable: false })
    jenisMagang: string;

    @Column({ type: 'varchar', nullable: false })
    fotoMagang: string;

    @Column({ type: 'text', nullable: false })
    tentangProgram: string;

    @Column({ type: 'text', nullable: false })
    benefitMagang: string;

    @Column({ type: 'text', nullable: false })
    kriteriaPeserta: string;

    @Column({ type: 'text', nullable: false })
    urlMsib: string;

    @Column({ type: 'text', nullable: false })
    kompetensi1: string;

    @Column({ type: 'text', nullable: false })
    kompetensi2: string;

    @Column({ type: 'text', nullable: false })
    kompetensi3: string;

    @Column({ type: 'text', nullable: false })
    kompetensi4: string;

    @Column({ type: 'text', nullable: false })
    kompetensi5: string;

    @Column({ type: 'text', nullable: true })
    kriteriaPeserta1: string;

    @Column({ type: 'text', nullable: true })
    kriteriaPeserta2: string;

    @Column({ type: 'text', nullable: true })
    kriteriaPeserta3: string;

    @Column({ type: 'text', nullable: true })
    kriteriaPeserta4: string;

    @Column({ type: 'varchar', nullable: true })
    kriteriaPeserta5: string;

    @Column({ type: 'text', nullable: true })
    kriteriaPeserta6: string;

    @Column({ type: 'text', nullable: true })
    kriteriaPeserta7: string;

    @Column({ type: 'text', nullable: true })
    kriteriaPeserta8: string;

    @Column({ type: 'text', nullable: true })
    kriteriaPeserta9: string;

    @Column({ type: 'text', nullable: true })
    kriteriaPeserta10: string;

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
