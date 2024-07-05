import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('beritas')
export class Berita {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  judulBerita: string;

  @Column({ type: 'simple-array', nullable: false })
  deskripsiBerita: string[];

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
