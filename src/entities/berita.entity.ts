import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Teks } from './teks.entity';

@Entity('beritas')
export class Berita {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  judulBerita: string;

  @OneToMany(() => Teks, teks => teks.berita, { cascade: true })
  deskripsiBerita: Teks[];

  @Column({ type: 'date', nullable: false })
  tanggalBerita: string;

  @Column({ type: 'varchar', nullable: false })
  fotoBerita: string;

  @Column({ type: 'varchar', nullable: false })
  authorBerita: string;

  @Column({ type: 'varchar', nullable: false })
  editorBerita: string;

  @Column({ type: 'varchar', nullable: false })
  fotoContent: string;

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
