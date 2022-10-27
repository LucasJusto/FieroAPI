import { User } from "../Model/User.js";
import {
  EntityRepository,
  getCustomRepository,
  Repository,
  getManager,
} from "typeorm";
import { VerificationCode } from "../Model/VerificationCode.js";
import variables from "../config/EnviromentVariables.js";
import { QuickChallengeRepository } from "./QuickChallengeRepository.js";
import { Team } from "../Model/Team.js";
import { QuickChallenge } from "../Model/QuickChallenge.js";

export class UserRepository {
  async insert(user: User) {
    const userRep = getCustomRepository(TORMUserRepository);
    const createdUser = await userRep.save(user);
    return new User(
      createdUser.id,
      createdUser.email,
      createdUser.name,
      undefined,
      undefined,
      createdUser.createdAt,
      createdUser.updatedAt
    );
  }

  async getUserByEmail(email: string) {
    const userRep = getCustomRepository(TORMUserRepository);
    const userFromDB = await userRep
            .createQueryBuilder('user')
            .select('user.password')
            .addSelect('user.salt')
            .addSelect('user.email')
            .addSelect('user.name')
            .addSelect('user.id')
            .addSelect('user.createdAt')
            .addSelect('user.updatedAt')
            .where('user.email = :email', { email })
            .getOne()
    const user = new User(
      userFromDB?.id || "",
      userFromDB?.email || "",
      userFromDB?.name || "",
      userFromDB?.password,
      userFromDB?.salt,
      userFromDB?.createdAt,
      userFromDB?.updatedAt
    );

    return user;
  }

  async deleteVerificationCodeByUserId(userId: string) {
    const verificationCodeRep = getCustomRepository(TORMVerificationCodeRepository)
    return verificationCodeRep
      .createQueryBuilder()
      .delete()
      .from(VerificationCode)
      .where("owner_id = :id", { id: userId })
      .execute();
  }

  async update(user: User) {
    const userRep = getCustomRepository(TORMUserRepository)
    return await userRep.save(user)
  }

  async getVerificationCodeById(id: string) {
    const verificationCodeRep = getCustomRepository(TORMVerificationCodeRepository)
    return await verificationCodeRep.findOne(id)
  }

  async insertVerificationCodeForUser(verificationCode: VerificationCode) {
    const verificationCodeRep = getCustomRepository(TORMVerificationCodeRepository)
    return await verificationCodeRep.save(verificationCode)
  }

  async getUserById(id: string) {
    const userRep = getCustomRepository(TORMUserRepository);
    const userFromDB = await userRep.findOne({ where: { id: id } });

    const user = new User(
      userFromDB?.id || "",
      userFromDB?.email || "",
      userFromDB?.name || "",
      undefined,
      undefined,
      userFromDB?.createdAt,
      userFromDB?.updatedAt
    );

    return user;
  }

  async deleteVerificationCode(verificationCode: VerificationCode) {
    const verificationCodeRep = getCustomRepository(TORMVerificationCodeRepository)

    await verificationCodeRep.remove(verificationCode);
  }

  async handleAccountDeletion(user: User) {
    const quickChallengeRepository = new QuickChallengeRepository()

    //[DELETE]getting all offline challenges created by the user
    const offlineChallengesIDs: string[] = await quickChallengeRepository.getOfflineChallenges(user.id)

    //[DELETE]getting all challenges that are not started yet and where the user is the owner
    const notStartedOwnedOnlineChallengesIDs: string[] = await quickChallengeRepository.getNotStartedOwnedOnlineChallenges(user.id)

    //[DELETE]getting all teams where the user is playing, is the owner and the challenge didnt start yet
    const notStartedOnlineTeamsOwnedIDs: string[] = await quickChallengeRepository.getTeamsIdsFromNotStartedOnlineChallenges(user.id)

    //[CHANGE OWNER]getting all teams with more than one player from ongoing online challenges
    const ongoingOwnedTeamsWithMoreThanOnePlayer: Team[] = (await quickChallengeRepository.getOngoingOwnedTeams(user.id)).filter(team => team.members.length > 1)

    //[CHANGE OWNER]getting all challenges where the user is the owner and the challenge is ongoing (alreadyBegin but not finished)
    const ongoingOwnedOnlineChallenges: QuickChallenge[] = await quickChallengeRepository.getOngoingOwnedOnlineChallenges(user.id)

    const ongoingOwnedOnlineChallengesWithMoreThanOnePlayer: QuickChallenge[] = ongoingOwnedOnlineChallenges.filter(challenge => challenge.teams.length > 1)
    
    //[DELETE]
    const ongoingOwnedOnlineChallengesToDeleteIDs: string[] = ongoingOwnedOnlineChallenges.filter(challenge => challenge.teams.length <= 1).map(challenge => challenge.id)

    //changing owners from ongoing online challenges with more than one player
    ongoingOwnedOnlineChallengesWithMoreThanOnePlayer.forEach(function(challenge) {
      var i = 0
      var newOwnerId = challenge.ownerId
      while (newOwnerId === challenge.ownerId) {
        newOwnerId = challenge.teams[i++].ownerId
      }
      challenge.ownerId = newOwnerId
    })

    ongoingOwnedTeamsWithMoreThanOnePlayer.forEach(function(team) {
      var i = 0
      var newOwnerId = team.ownerId
      while (newOwnerId === team.ownerId) {
        newOwnerId = team.members[i++].userId
      }
      team.ownerId = newOwnerId
    })

    await getManager().transaction(async transactionalEntityManager => { 
      //deleting online but not started and offline challenges
      transactionalEntityManager.getCustomRepository(TORMQuickChallengeRepository)
        .createQueryBuilder()
        .delete()
        .whereInIds(offlineChallengesIDs.concat(notStartedOwnedOnlineChallengesIDs).concat(ongoingOwnedOnlineChallengesToDeleteIDs))
        .execute()

      //deleting teams where the user is owner and the challenge didnt start yet
      transactionalEntityManager.getCustomRepository(TORMTeamRepository)
        .createQueryBuilder()
        .delete()
        .whereInIds(notStartedOnlineTeamsOwnedIDs)
        .execute()

      //changing team owners from teams that are on ongoing challenges and have more than one player
      ongoingOwnedTeamsWithMoreThanOnePlayer.forEach(function(team) {
        transactionalEntityManager.getCustomRepository(TORMTeamRepository)
          .createQueryBuilder()
          .update()
          .set({ ownerId: team.ownerId })
          .where("id = :id", { id: team.id })
          .execute()
      })

      //changing ongoing online challenges owners where there are more than one player
      ongoingOwnedOnlineChallengesWithMoreThanOnePlayer.forEach(function(challenge) {
        transactionalEntityManager.getCustomRepository(TORMQuickChallengeRepository)
          .createQueryBuilder()
          .update()
          .set({ ownerId: challenge.ownerId })
          .where("id = :id", { id: challenge.id })
          .execute()
      })

      //wipeUserData
      transactionalEntityManager.getCustomRepository(TORMUserRepository)
        .createQueryBuilder()
        .update()
        .set( { name: "Fiero User" + user.id.substring(0,5), email: user.id + "@fiero.com", password: variables.DEFAULT_PASSWORD_FOR_DELETED_ACCOUNTS, inactivated: true } )
        .where("id = :id", { id: user.id })
        .execute()
   });
  }
}

@EntityRepository(User)
class TORMUserRepository extends Repository<User> {}

@EntityRepository(VerificationCode)
class TORMVerificationCodeRepository extends Repository<VerificationCode> {}

@EntityRepository(QuickChallenge)
class TORMQuickChallengeRepository extends Repository<QuickChallenge> {}

@EntityRepository(Team)
class TORMTeamRepository extends Repository<Team> {}
