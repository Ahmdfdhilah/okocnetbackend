import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';


@Entity('sosmeds')
export class Sosmed {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', nullable: false })
    link: string;

    @Column({ type: 'varchar', nullable: false })
    foto: string;

    @Column({ type: 'enum', enum: ['whatsapp', 'instagram', 'twitter', 'facebook', 'tiktok', 'youtube'], nullable: false, unique: true })
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
