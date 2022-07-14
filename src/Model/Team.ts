import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn, ManyToOne, ManyToMany, JoinTable } from "typeorm"
import { QuickChallenge } from "./QuickChallenge.js";
import { User } from "./User.js";

@Entity()
export class Team {
    @PrimaryColumn({ type: 'uuid' })
    id: string

    @Column({ nullable: false, type: 'varchar' })
    name: string

    @ManyToOne(() => QuickChallenge, (quickChallenge) => quickChallenge.teams)
    quickChallenge: QuickChallenge

    @ManyToMany(() => User)
    @JoinTable()
    users: User[]

    @CreateDateColumn({ name: "created_At" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_At" })
    updatedAt: Date

    constructor(id: string, name: string, quickChallenge: QuickChallenge, createdAt?: Date, updatedAt?: Date) {
        this.id = id
        this.name = name
        this.quickChallenge = quickChallenge
        if(createdAt) {
            this.createdAt = createdAt
        }
        if(updatedAt) {
            this.updatedAt = updatedAt
        }
    }
}