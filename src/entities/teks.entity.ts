import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Berita } from './berita.entity';
import { Event } from './event.entity';
import { Magang } from './magang.entity';
import { Thementor } from './thementor.entity';

@Entity('teks')
export class Teks {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column('text')
    str: string
    @Column('int')
    order: number;
    @ManyToOne(() => Berita, berita => berita.deskripsiBerita, { nullable: true, onDelete: "CASCADE" })
    berita: Berita;
    @ManyToOne(() => Event, event => event.deskripsiEvent, { nullable: true, onDelete: "CASCADE" })
    event: Event;
    @ManyToOne(() => Magang, event => event.deskripsiMagang, { nullable: true, onDelete: "CASCADE" })
    deskripsiMagang: Magang;
    @ManyToOne(() => Magang, event => event.kompetensi, { nullable: true, onDelete: "CASCADE" })
    kompetensi: Magang;
    @ManyToOne(() => Thementor, thementor => thementor.deskripsi, { nullable: true, onDelete: "CASCADE" }) 
    thementor: Thementor;
    @ManyToOne(() => Magang, event => event.kriteriaPeserta, { nullable: true, onDelete: "CASCADE" })
    kriteriaPeserta: Magang;
}
