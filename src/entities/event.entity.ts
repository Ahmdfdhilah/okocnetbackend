import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from './user.entity';

@Entity('events')  
export class Event {
    @PrimaryGeneratedColumn("uuid")
    id: string; 

    @Column({ type: 'varchar', length: 255, nullable: false })
    judulEvent: string;

    @Column({ type: 'date', nullable: false })
    tanggalEvent: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    hargaEvent: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    pointEvent: string;

    @Column({ type: 'varchar', nullable: false })
    fotoEvent: string;

    @Column({ type: 'text', nullable: false })
    urlPendaftaran: string;

    @Column({ type: 'text', nullable: false })
    deskripsiEvent: string;

    @Column({ type: 'text', nullable: false })
    tempatEvent: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    quotaEvent: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    durasiEvent: string;

    @Column({ type: 'text', nullable: false })
    narasumber: string;

    @Column({ type: 'text', nullable: true })
    deskripsiEvent2: string;

    @Column({ type: 'text', nullable: true })
    deskripsiEvent3: string;

    @Column({ type: 'text', nullable: true })
    deskripsiEvent4: string;

    @Column({ type: 'text', nullable: true })
    deskripsiEvent5: string;

    @Column({ type: 'text', nullable: true })
    deskripsiEvent6: string;

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
