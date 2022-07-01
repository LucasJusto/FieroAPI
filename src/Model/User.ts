import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn } from "typeorm"

@Entity()
export class User {
    @PrimaryColumn({ type: 'uuid' })
    id: string

    @Column({ nullable: false, type: 'varchar' })
    name: string

    @Column({ nullable: false, unique: true, type: 'varchar' })
    email: string

    @Column({ nullable: false, type: 'varchar' })
    password: string

    @CreateDateColumn({ name: "created_At" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_At" })
    updatedAt: Date
}