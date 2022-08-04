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

    @Column({ name: 'user_id', nullable: true, type: 'uuid' })
    userId: string
  
    @ManyToOne(() => Team, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'team_id' })
    team: Team;

    @Column({ name: 'team_id', nullable: false, type: 'uuid' })
    teamId: string

    @Column({ nullable: false, type: 'float' })
    score: number

    @Column({ nullable: true, type: 'timestamp'})
    beginDate: Date

    @Column({ nullable: true, type: 'varchar'})
    botPicture: string

    @CreateDateColumn({ name: "created_At" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_At" })
    updatedAt: Date

    constructor(id: string, team: Team, score: number, user?: User, beginDate?: Date, createdAt?: Date, updatedAt?: Date, botPicture?: string) {
        this.id = id
        this.team = team
        this.score = score

        if(botPicture) {
            this.botPicture = botPicture
        }
        if(user) {
            this.user = user
        }
        if(createdAt) {
            this.createdAt = createdAt
        }
        if(updatedAt) {
            this.updatedAt = updatedAt
        }
        if(beginDate) {
            this.beginDate = beginDate
        }
    }
}