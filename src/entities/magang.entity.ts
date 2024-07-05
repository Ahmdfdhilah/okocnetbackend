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

    @Column({  type: 'simple-array', nullable: false })
    kriteriaPeserta: string[];

    @Column({ type: 'text', nullable: false })
    urlMsib: string;

    @Column({  type: 'simple-array', nullable: true })
    kompetensi: string[];

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
