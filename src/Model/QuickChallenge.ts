import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn, OneToMany, JoinColumn, ManyToOne } from "typeorm"
import { Team } from "./Team.js"
import { User } from "./User.js"

@Entity()
export class QuickChallenge {
    @PrimaryColumn({ type: 'uuid' })
    id: string

    @Column({ nullable: false, type: 'varchar' })
    name: string

    @Column({ nullable: false, unique: true, type: 'uuid' })
    invitationCode: string

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'owner_id' })
    owner: User

    @Column({ name: 'owner_id', nullable: false, type: 'uuid' })
    ownerId: string

    @Column({ nullable: false, type: 'varchar' })
    type: string

    @Column({ nullable: false, type: 'float' })
    goal: number

    @Column({ nullable: false, type: 'varchar' })
    goalMeasure: string

    @Column({ nullable: false, type: 'boolean' })
    finished: boolean

    @OneToMany(() => Team, (team) => team.quickChallenge, {onDelete: 'CASCADE', onUpdate: 'CASCADE', eager: true})
    teams: Team[]

    @Column({ nullable: false, type: 'boolean', default: false })
    online: boolean

    @Column({ nullable: false, type: 'boolean', default: false })
    alreadyBegin: boolean

    @Column({ nullable: false, type: 'integer', default: 4 })
    maxTeams: number

    @CreateDateColumn({ name: "created_At" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_At" })
    updatedAt: Date

    constructor(id: string, name: string, invitationCode: string, type: string, goal: number, goalMeasure: string, finished: boolean, ownerId: string, online: boolean, alreadyBegin: boolean, maxTeams: number, owner?: User, teams?: Team[], createdAt?: Date, updatedAt?: Date) {
        this.id = id
        this.name = name
        this.invitationCode = invitationCode
        this.type = type
        this.goal = goal
        this.goalMeasure = goalMeasure
        this.finished = finished
        this.ownerId = ownerId
        this.online = online
        this.alreadyBegin = alreadyBegin
        this.maxTeams = maxTeams

        if(teams) {
            this.teams = teams
        }
        if(owner) {
            this.owner = owner
        }
        if(createdAt) {
            this.createdAt = createdAt
        }
        if(updatedAt) {
            this.updatedAt = updatedAt
        }
    }
}