import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn, OneToMany } from "typeorm"
import { Team } from "./Team.js"

@Entity()
export class QuickChallenge {
    @PrimaryColumn({ type: 'uuid' })
    id: string

    @Column({ nullable: false, type: 'varchar' })
    name: string

    @Column({ nullable: false, unique: true, type: 'uuid' })
    invitationCode: string

    @Column({ nullable: false, type: 'varchar' })
    type: string

    @Column({ nullable: false, type: 'float' })
    goal: number

    @Column({ nullable: false, type: 'varchar' })
    goalMeasure: string

    @Column({ nullable: false, type: 'boolean' })
    finished: boolean

    @OneToMany(() => Team, (team) => team.quickChallenge)
    teams: Team[]

    @CreateDateColumn({ name: "created_At" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_At" })
    updatedAt: Date

    constructor(id: string, name: string, invitationCode: string, type: string, goal: number, goalMeasure: string, finished: boolean, createdAt?: Date, updatedAt?: Date) {
        this.id = id
        this.name = name
        this.invitationCode = invitationCode
        this.type = type
        this.goal = goal
        this.goalMeasure = goalMeasure
        this.finished = finished
        if(createdAt) {
            this.createdAt = createdAt
        }
        if(updatedAt) {
            this.updatedAt = updatedAt
        }
    }
}