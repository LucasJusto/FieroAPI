import { QuickChallenge } from '../Model/QuickChallenge.js'
import { Team } from '../Model/Team.js'
import { TeamUser } from '../Model/TeamUser.js'
import { QuickChallengeRepository } from '../Repository/QuickChallengeRepository.js'
import { UserRepository } from '../Repository/UserRepository.js'
import uuidV4 from '../utils/uuidv4Generator.js'

const quickChallengeRepository = new QuickChallengeRepository
const userRepository = new UserRepository()

export class QuickChallengeService {
    async createQuickChallenge(quickChallenge: QuickChallenge) {
        const owner = await userRepository.getUserById(quickChallenge.ownerId)
        const team = new Team(uuidV4(), owner.name, quickChallenge.id, owner)
        const teamUser = new TeamUser(uuidV4(), owner, team, 0)
        return await quickChallengeRepository.insert(quickChallenge, team, teamUser)
    }
}