import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('merchandises')
export class Merchandise {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    judulMerchandise: string;

    @Column({ type: 'text', nullable: true })
    deskripsiMerchandise: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    hargaMerchandise: string;

    @Column({ type: 'text', nullable: false })
    fotoMerchandise: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    stockMerchandise: string;

    @Column({ type: 'text', nullable: false })
    linkMerchandise: string;

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
