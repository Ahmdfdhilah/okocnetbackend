import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('mitras')
export class Mitra {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column({ type: 'varchar', nullable: true })
    nama: string;

    @Column({ type: 'varchar', nullable: true })
    foto: string;

    @Column({ type: 'enum', enum: ['swasta', 'pendidikan', 'pemerintah'], nullable: true })
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