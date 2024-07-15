import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('sosmeds')
export class Sosmed {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', nullable: false })
    ig: string
    
    @Column({ type: 'varchar', nullable: false })
    wa: string
    
    @Column({ type: 'varchar', nullable: false })
    fb: string
    
    @Column({ type: 'varchar', nullable: false })
    tw: string

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