import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';

@Entity('tujuanMasterMentors')
export class TujuanMasterMentor {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    judul: string;

    @Column({ type: 'text', nullable: false })
    deskripsi: string;

    @Column({ type: 'varchar', nullable: false })
    img: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

}
