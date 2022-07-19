import { Entity, Column, PrimaryColumn, UpdateDateColumn, CreateDateColumn, ManyToOne, ManyToMany, JoinTable, OneToMany, JoinColumn } from "typeorm"
import { QuickChallenge } from "./QuickChallenge.js";
import { TeamUser } from "./TeamUser.js";
import { User } from "./User.js";

@Entity()
export class Team {
    @PrimaryColumn({ type: 'uuid' })
    id: string

    @Column({ nullable: false, type: 'varchar' })
    name: string

    @ManyToOne(() => QuickChallenge)
    @JoinColumn({ name: 'quickChallenge_id' })
    quickChallenge: QuickChallenge

    @Column({ name: 'quickChallenge_id', nullable: false, type: 'uuid' })
    quickChallengeId: string

    @ManyToOne(() => User, { eager: true })
    @JoinColumn({ name: 'owner_id' })
    owner: User

    @Column({ name: 'owner_id', nullable: false, type: 'uuid' })
    ownerId: string

    @OneToMany(() => TeamUser, teamUser => teamUser.user)
    @JoinColumn({ name: 'user_id' })
    members: TeamUser[]

    @CreateDateColumn({ name: "created_At" })
    createdAt: Date

    @UpdateDateColumn({ name: "updated_At" })
    updatedAt: Date

    constructor(id: string, name: string, quickChallengeId: string, owner: User, members?: TeamUser[], createdAt?: Date, updatedAt?: Date) {
        this.id = id
        this.name = name
        this.owner = owner
        this.quickChallengeId = quickChallengeId

        if(members) {
            this.members = members
        }
        if(createdAt) {
            this.createdAt = createdAt
        }
        if(updatedAt) {
            this.updatedAt = updatedAt
        }
    }
}