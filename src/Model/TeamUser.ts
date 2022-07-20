import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn, ManyToOne, JoinColumn } from "typeorm"
import { Team } from "./Team.js"
import { User } from "./User.js"

@Entity()
export class TeamUser {
    @PrimaryColumn({ type: 'uuid' })
    id: string

    @ManyToOne(() => User, {onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id', nullable: false, type: 'uuid' })
    userId: string
  
    @ManyToOne(() => Team, { eager: true, onDelete: 'CASCADE', onUpdate: 'CASCADE'})
    @JoinColumn({ name: 'team_id' })
    team: Team;

    @Column({ name: 'team_id', nullable: false, type: 'uuid' })
    teamId: string

    @Column({ nullable: false, type: 'float' })
    score: number

    @CreateDateColumn({ name: "created_At" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_At" })
    updatedAt: Date

    constructor(id: string, user: User, team: Team, score: number, createdAt?: Date, updatedAt?: Date) {
        this.id = id
        this.user = user
        this.team = team
        this.score = score
        if(createdAt) {
            this.createdAt = createdAt
        }
        if(updatedAt) {
            this.updatedAt = updatedAt
        }
    }
}