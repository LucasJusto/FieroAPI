import { QuickChallenge } from '../Model/QuickChallenge.js'
import { Team } from '../Model/Team.js'
import { TeamUser } from '../Model/TeamUser.js'
import { QuickChallengeRepository } from '../Repository/QuickChallengeRepository.js'
import { UserRepository } from '../Repository/UserRepository.js'
import uuidV4 from '../utils/uuidv4Generator.js'

const quickChallengeRepository = new QuickChallengeRepository
const userRepository = new UserRepository()

const possibleBotPictures = ['picture1', 'picture2', 'picture3', 'picture4']

export class QuickChallengeService {
    async createQuickChallenge(quickChallenge: QuickChallenge, numberOfTeams: number) {
        if(quickChallenge.online) {
            const owner = await userRepository.getUserById(quickChallenge.ownerId)
            const team = new Team(uuidV4(), owner.name, quickChallenge.id, owner)
            const teamUser = new TeamUser(uuidV4(), team, 0, owner)

            return await quickChallengeRepository.insert(quickChallenge, [team], [teamUser])
        }
        else {
            const owner = await userRepository.getUserById(quickChallenge.ownerId)
            const team = new Team(uuidV4(), owner.name, quickChallenge.id, owner)
            const teamUser = new TeamUser(uuidV4(), team, 0, owner)
            let teams: Team[] = [team]
            let teamsUsers: TeamUser[] = [teamUser]
            for (let i = 1; i < numberOfTeams; i++) {
               const teamBot = new Team(uuidV4(), possibleBotPictures[i], quickChallenge.id)
               const teamUserBot = new TeamUser(uuidV4(), teamBot, 0, undefined, undefined, undefined, undefined, possibleBotPictures[i])
               teams.push(teamBot)
               teamsUsers.push(teamUserBot)
            }
            return await quickChallengeRepository.insert(quickChallenge, teams, teamsUsers)
        }
        
    }

    async getUserQuickChallengesById(userId: string) {
        return await quickChallengeRepository.getUserQuickChallengesById(userId)
    }

    async getQuickChallengeById(id: string) {
        return await quickChallengeRepository.getQuickChallengeById(id)
    }

    async deleteQuickChallenge(quickChallengeToDelete: QuickChallenge) {
        return await quickChallengeRepository.deleteQuickChallenge(quickChallengeToDelete)
    }

    async patchScore(score: number, teamUser: TeamUser) {
        teamUser.score = score
        return await quickChallengeRepository.updateTeamUser(teamUser)
    }
}