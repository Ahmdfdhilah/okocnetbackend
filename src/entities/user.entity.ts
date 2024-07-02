import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({unique: true})
    username: string;

    @Column({ unique: true })
    email: string;

    @Column()
    @Exclude({ toPlainOnly: true }) 
    password: string;

    @Column({ nullable: true })
    resetPasswordToken: string;

    @Column()
    role: string;
}
