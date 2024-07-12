import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { Teks } from './teks.entity';

@Entity('events')  
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id: string; 

    @Column({ type: 'varchar', length: 255, nullable: false })
    judulEvent: string;

    @Column({ type: 'date', nullable: false })
    tanggalEvent: string;

    @Column({ type: 'int', nullable: false })
    hargaEvent: number;

    @Column({ type: 'int', nullable: false })
    pointEvent: number;

    @Column({ type: 'varchar', nullable: false })
    fotoEvent: string;

    @Column({ type: 'text', nullable: false })
    urlPendaftaran: string;

    @OneToMany(() => Teks, teks => teks.event, { cascade: true })
    deskripsiEvent: Teks[];

    @Column({ type: 'text', nullable: false })
    tempatEvent: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    quotaEvent: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    durasiEvent: string;

    @Column({ type: 'text', nullable: false })
    narasumber: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    contactPerson: string;

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
