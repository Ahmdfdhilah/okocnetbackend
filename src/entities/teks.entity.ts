import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Berita} from './berita.entity';
import { Event } from './event.entity';

@Entity('teks')
export class Teks {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text')
    str: string
    @ManyToOne(() => Berita, berita => berita.deskripsiBerita, {nullable: true, onDelete:"CASCADE"})
    berita: Berita;
    @ManyToOne(() => Event, event => event.deskripsiEvent, {nullable: true, onDelete:"CASCADE"})
    event: Event;
}
