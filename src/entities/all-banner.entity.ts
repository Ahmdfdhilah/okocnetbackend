import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('all-banners')
export class AllBanner {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: 'enum',
        enum: [
            'Sejarah',
            'Visi Misi',
            'Nilai Inti',
            'Struktur Pengurus',
            'Penggerak',
            'Anniversary',
            '7 Top',
            'Merchandise',
            'Peluang Usaha',
            'Peluang Kerja',
            'Magang',
            'Trainer',
            'Mentor',
            'Mitra Kerjasama',
            'Donasi',
            'Event',
            'Berita',
            'Brand Lokal',
            'Modal Berkah',
            'Emak Kece',
            'Masjid Pemberdaya',
            'Desapreneur',
            'The Mentor',
            'Master Mentor',
            'Testimoni'
        ],
        nullable: true
    })
    nama: string;

    @Column({ type: 'simple-array', nullable: true })
    foto: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}