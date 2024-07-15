import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('totals')
export class Total {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    @Column({ type: 'int', nullable: false })
    total: number;

    @Column({ type: 'enum', enum: ['umkm', 'penggerak', 'usaha', 'swasta', 'pemerintah', 'pendidikan'], nullable: false })
    nama: string;

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
