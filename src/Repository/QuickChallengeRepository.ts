import { User } from '../Model/User.js'
import { createQueryBuilder, EntityRepository, getCustomRepository, In, Repository} from 'typeorm'
import { QuickChallenge } from '../Model/QuickChallenge.js'
import { Team } from '../Model/Team.js'
import { TeamUser } from '../Model/TeamUser.js'



export class QuickChallengeRepository {
    async insert(quickChallenge: QuickChallenge, team: Team, teamUser: TeamUser) {
        const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository)
        const teamRep = getCustomRepository(TORMTeamRepository)
        const teamUserRep = getCustomRepository(TORMTeamUserRepository)

        const createdQuickChallenge = await quickChallengeRep.save(quickChallenge)
        const createdTeam = await teamRep.save(team)
        const createdTeamUser = await teamUserRep.save(teamUser)
        const newTeam = new Team(createdTeam.id, createdTeam.name, createdTeam.quickChallengeId, createdTeam.owner, [createdTeamUser])

        return new QuickChallenge(createdQuickChallenge.id, createdQuickChallenge.name, createdQuickChallenge.invitationCode, createdQuickChallenge.type, createdQuickChallenge.goal, createdQuickChallenge.goalMeasure, createdQuickChallenge.finished, createdQuickChallenge.ownerId, undefined, [newTeam])
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
}

@EntityRepository(QuickChallenge)
class TORMQuickChallengeRepository extends Repository<QuickChallenge> {}

@EntityRepository(Team)
class TORMTeamRepository extends Repository<Team> {}

@EntityRepository(TeamUser)
class TORMTeamUserRepository extends Repository<TeamUser> {}