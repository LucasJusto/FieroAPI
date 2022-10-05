import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { User } from "./User.js"

@Entity()
export class VerificationCode {
    @PrimaryColumn({ type: 'uuid' })
    id: string //the code itself

    @ManyToOne(() => User)
    @JoinColumn({ name: 'owner_id' })
    user: User

    @Column({ name: 'owner_id', nullable: false, type: 'uuid' })
    userId: string

    @CreateDateColumn({ name: "created_At" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_At" })
    updatedAt: Date

    constructor(id: string, userId: string, user?: User, createdAt?: Date, updatedAt?: Date) {
        this.id = id
        this.userId = userId

        if(user) {
            this.user = user
        }
        if(createdAt) {
            this.createdAt = createdAt
        }
        if(updatedAt) {
            this.updatedAt = updatedAt
        }
    }
}