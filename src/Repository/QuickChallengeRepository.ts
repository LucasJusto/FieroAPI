import { User } from '../Model/User.js'
import { createQueryBuilder, EntityRepository, getCustomRepository, In, Repository} from 'typeorm'
import { QuickChallenge } from '../Model/QuickChallenge.js'
import { Team } from '../Model/Team.js'
import { TeamUser } from '../Model/TeamUser.js'



export class QuickChallengeRepository {
    async insert(quickChallenge: QuickChallenge, teams: Team[], teamsUsers: TeamUser[]) {
        const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository)
        const teamRep = getCustomRepository(TORMTeamRepository)
        const teamUserRep = getCustomRepository(TORMTeamUserRepository)

        await quickChallengeRep.save(quickChallenge)
        await teamRep.save(teams)
        await teamUserRep.save(teamsUsers)
        const createdQuickChallenge = await quickChallengeRep.findByIds([quickChallenge.id])

        //return new QuickChallenge(createdQuickChallenge.id, createdQuickChallenge.name, createdQuickChallenge.invitationCode, createdQuickChallenge.type, createdQuickChallenge.goal, createdQuickChallenge.goalMeasure, createdQuickChallenge.finished, createdQuickChallenge.ownerId, createdQuickChallenge.online, createdQuickChallenge.alreadyBegin, createdQuickChallenge.maxTeams, undefined, createdTeams)
        return createdQuickChallenge
    }

    async getUserQuickChallengesById(userId: string) {
        const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository)

        const quickChallenges = await quickChallengeRep.find({relations: ["teams", "teams.members"], where: {ownerId: userId}})

        return quickChallenges
    }

    async getQuickChallengeById(id: string) {
        const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository)

        const quickChallenge = await quickChallengeRep.findOne({where: {id: id}})

        return quickChallenge
    }

    async deleteQuickChallenge(quickChallengeToDelete: QuickChallenge) {
        const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository)
        
        await quickChallengeRep.remove(quickChallengeToDelete)
    }

    async getTeamsFromQuickChallengeById(id: string) {
        const teamRep = getCustomRepository(TORMTeamRepository)

        const teams = await teamRep.find({where: {challengeId: id}})

        return teams
    }

    async getTeamUserById(id: string) {
        const teamUserRep = getCustomRepository(TORMTeamUserRepository)

        const teamUser = await teamUserRep.findOne({where: {id: id}})

        return teamUser
    }

    async getTeamById(id: string) {
        const teamRep = getCustomRepository(TORMTeamRepository)

        const team = await teamRep.findOne({where: {id: id}})

        return team
    }

    async updateTeamUser(teamUser: TeamUser) {
        const teamUserRep = getCustomRepository(TORMTeamUserRepository)

        await teamUserRep.update({
            id: teamUser.id
        },{
            score: teamUser.score
        })

        const updatedTeamUser = this.getTeamUserById(teamUser.id)
        return updatedTeamUser
    }

    async updateAlreadyBeginQuickChallenge(challenge: QuickChallenge) {
        const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository)

        await quickChallengeRep.update({
            id: challenge.id
        },{
            alreadyBegin: challenge.alreadyBegin
        })

        const updatedQuickChallenge = this.getQuickChallengeById(challenge.id)
        return updatedQuickChallenge
    }

    async updateFinishedQuickChallenge(challenge: QuickChallenge) {
        const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository)

        await quickChallengeRep.update({
            id: challenge.id
        },{
            finished: challenge.finished
        })

        const updatedQuickChallenge = this.getQuickChallengeById(challenge.id)
        return updatedQuickChallenge
    }
}

@EntityRepository(QuickChallenge)
class TORMQuickChallengeRepository extends Repository<QuickChallenge> {}

@EntityRepository(Team)
class TORMTeamRepository extends Repository<Team> {}

@EntityRepository(TeamUser)
class TORMTeamUserRepository extends Repository<TeamUser> {}