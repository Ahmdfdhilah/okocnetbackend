import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('totals')
export class Total {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({ type: 'int', nullable: false })
    totalUmkm: number;

    @Column({ type: 'int', nullable: false })
    totalPenggerak: number;

    @Column({ type: 'int', nullable: false })
    totalPelakuUsaha: number;

    @Column({ type: 'int', nullable: false })
    totalKerjaSamaSwasta: number;

    @Column({ type: 'int', nullable: false })
    totalKerjaSamaPemerintah: number;

    @Column({ type: 'int', nullable: false })
    totalKerjaSamaPendidikan: number;

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
