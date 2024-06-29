import { Exclude } from 'class-transformer';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({unique: true})
    username: string;

    @Column({ unique: true })
    email: string;

    @Column({nullable:true})
    provider: string;

    @Column()
    @Exclude({ toPlainOnly: true }) 
    password: string;

    @Column({ nullable: true })
    resetPasswordToken: string;

    @Column({ nullable: true })
    confirmationToken: string;

    @Column({ default: false })
    confirmed: boolean;

    @Column({ default: false })
    blocked: boolean;

    @Column()
    role: string;
}
