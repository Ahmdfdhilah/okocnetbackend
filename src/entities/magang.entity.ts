import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Teks } from './teks.entity';

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

    @OneToMany(() => Teks, teks => teks.deskripsiMagang, { cascade: true })
    deskripsiMagang: Teks[];

    @Column({ type: 'text', nullable: false })
    benefitMagang: string;

    @OneToMany(() => Teks, teks => teks.kriteriaPeserta, { cascade: true })
    kriteriaPeserta: Teks[];

    @Column({ type: 'text', nullable: false })
    urlMsib: string;

    @OneToMany(() => Teks, teks => teks.kompetensi, { cascade: true })
    kompetensi: Teks[];

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
