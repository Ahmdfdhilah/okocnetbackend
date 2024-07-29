import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('anniversaries')
export class Anniversary {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    judul: string;

    @Column({ type: 'int', nullable: false })
    year: number;

    @Column({ type: 'text', nullable: false })
    deskripsi: string;

    @Column({ type: 'varchar', nullable: false })
    videoLink: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    publishedAt: Date;
}
