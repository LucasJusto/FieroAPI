import { User } from "../Model/User.js";
import {
  createQueryBuilder,
  EntityRepository,
  getCustomRepository,
  getManager,
  In,
  Repository,
} from "typeorm";
import { QuickChallenge } from "../Model/QuickChallenge.js";
import { Team } from "../Model/Team.js";
import { TeamUser } from "../Model/TeamUser.js";

export class QuickChallengeRepository {
  async insert(
    quickChallenge: QuickChallenge,
    teams: Team[],
    teamsUsers: TeamUser[]
  ) {
    const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository);
    const teamRep = getCustomRepository(TORMTeamRepository);
    const teamUserRep = getCustomRepository(TORMTeamUserRepository);

    await quickChallengeRep.save(quickChallenge);
    await teamRep.save(teams);
    await teamUserRep.save(teamsUsers);
    const createdQuickChallenge = await quickChallengeRep.findByIds([
      quickChallenge.id,
    ]);

    return createdQuickChallenge;
  }

  async getUserQuickChallengesById(userId: string) {
    const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository);

    const quickChallenges = await quickChallengeRep.find({
      relations: ["teams", "teams.members"],
      where: { ownerId: userId },
    });

    return quickChallenges;
  }

  async getUserPlayingQuickChallengesById(userId: string) {
    const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository);

    const quickChallenges = await createQueryBuilder('QuickChallenge')
      .leftJoinAndSelect('QuickChallenge.teams', 'teams')
      .leftJoinAndSelect('teams.members', 'members')
      .where('members.userId = :userId', { userId: userId })
      .getMany()

    const quickChallengesIDs = []
    
    for(var i = 0; i < quickChallenges.length; i++) {
      quickChallengesIDs.push((quickChallenges[i] as QuickChallenge).id)
    }

    const completeQuickChallenges = quickChallengeRep.findByIds(quickChallengesIDs)

    return completeQuickChallenges;
  }

  async deleteUserQuickChallengesById(userId: string) {
    const repository = getCustomRepository(TORMQuickChallengeRepository);
    return repository
      .createQueryBuilder()
      .delete()
      .from(QuickChallenge)
      .where("owner_id = :id", { id: userId })
      .execute();
  }

  async getQuickChallengeById(id: string) {
    const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository);

    const quickChallenge = await quickChallengeRep.findOne({
      where: { id: id },
    });

    return quickChallenge;
  }

  async deleteQuickChallenge(quickChallengeToDelete: QuickChallenge) {
    const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository);

    await quickChallengeRep.remove(quickChallengeToDelete);
  }

  async getQuickChallengeByInvitationCode(invitationCode: string) {
    const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository);

    return await quickChallengeRep.find({ where: { invitationCode: invitationCode } });
  }

  async getTeamsFromQuickChallengeById(id: string) {
    const teamRep = getCustomRepository(TORMTeamRepository);

    const teams = await teamRep.find({ where: { challengeId: id } });

    return teams;
  }

  async getTeamUserById(id: string) {
    const teamUserRep = getCustomRepository(TORMTeamUserRepository);

    const teamUser = await teamUserRep.findOne({ where: { id: id } });

    return teamUser;
  }

  async getTeamById(id: string) {
    const teamRep = getCustomRepository(TORMTeamRepository);

    const team = await teamRep.findOne({ where: { id: id } });

    return team;
  }

  async updateTeamUser(teamUser: TeamUser) {
    const teamUserRep = getCustomRepository(TORMTeamUserRepository);

    await teamUserRep.update(
      {
        id: teamUser.id,
      },
      {
        score: teamUser.score,
      }
    );

    const updatedTeamUser = this.getTeamUserById(teamUser.id);
    return updatedTeamUser;
  }

  async updateAlreadyBeginQuickChallenge(challenge: QuickChallenge) {
    const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository);

    await quickChallengeRep.update(
      {
        id: challenge.id,
      },
      {
        alreadyBegin: challenge.alreadyBegin,
      }
    );

    const updatedQuickChallenge = this.getQuickChallengeById(challenge.id);
    return updatedQuickChallenge;
  }

  async updateFinishedQuickChallenge(challenge: QuickChallenge) {
    const quickChallengeRep = getCustomRepository(TORMQuickChallengeRepository);

    await quickChallengeRep.update(
      {
        id: challenge.id,
      },
      {
        finished: challenge.finished,
      }
    );

    const updatedQuickChallenge = this.getQuickChallengeById(challenge.id);
    return updatedQuickChallenge;
  }

  async insertTeam(team: Team, teamUser: TeamUser) {
    const teamRep = getCustomRepository(TORMTeamRepository);
    const teamUserRep = getCustomRepository(TORMTeamUserRepository)
    
    await teamRep.save(team)
    await teamUserRep.save(teamUser)
  }

  async getTeamsIdsFromNotStartedOnlineChallenges(userId: string) {
    const teams = await createQueryBuilder('Team')
    .leftJoinAndSelect('Team.quickChallenge', 'quickChallenge')
    .where('Team.ownerId = :userId AND quickChallenge.alreadyBegin = false AND quickChallenge.online = true', { userId: userId })
    .getMany()

    return teams.map(value => (value as Team).id)
  }

  async getOfflineChallenges(userId: string) {
    const challenges = await createQueryBuilder('QuickChallenge')
    .where('QuickChallenge.online = false')
    .getMany()

    return challenges.map(value => (value as QuickChallenge).id)
  }

  async getOngoingOwnedOnlineChallenges(userId: string) {
    const challenges = await createQueryBuilder('QuickChallenge')
    .leftJoinAndSelect('QuickChallenge.teams', 'teams')
    .where('QuickChallenge.ownerId = :userId AND QuickChallenge.alreadyBegin = true AND QuickChallenge.online = true AND QuickChallenge.finished = false', { userId: userId })
    .getMany()

    return (challenges as [QuickChallenge])
  }

  async getNotStartedOwnedOnlineChallenges(userId: String) {
    const challenges = await createQueryBuilder('QuickChallenge')
    .where('QuickChallenge.ownerId = :userId AND QuickChallenge.alreadyBegin = false AND QuickChallenge.online = true', { userId: userId })
    .getMany()

    return challenges.map(value => (value as QuickChallenge).id)
  }

  async getOngoingOwnedTeams(userId: string) {
    const teams = await createQueryBuilder('Team')
    .leftJoinAndSelect('Team.quickChallenge', 'quickChallenge')
    .leftJoinAndSelect('Team.members', 'members')
    .where('Team.ownerId = :userId AND quickChallenge.alreadyBegin = true AND quickChallenge.finished = false AND quickChallenge.online = true', { userId: userId })
    .getMany()

    return (teams as [Team])
  }

  async updateChallengeAndTeamOwner(quickChallenge: QuickChallenge, team: Team, newOwner: User) {
    await getManager().transaction(async transactionalEntityManager => {
      //update QuickChallenge Owner
      transactionalEntityManager.getCustomRepository(TORMQuickChallengeRepository)
      .createQueryBuilder()
      .update()
      .set({ ownerId: newOwner.id })
      .where("id = :id", { id: quickChallenge.id })
      .execute()

      //update Team Owner
      transactionalEntityManager.getCustomRepository(TORMTeamRepository)
      .createQueryBuilder()
      .update()
      .set({ ownerId: newOwner.id, name: newOwner.name })
      .where("id = :id", { id: team.id })
      .execute()
    })
  }

  async deleteTeamById(teamId: string) {
    await getCustomRepository(TORMTeamRepository)
    .createQueryBuilder()
    .delete()
    .where("id = :id", { id: teamId })
    .execute()
  }

  async removeMemberAndSetNewTeamOwner(team: Team, newOwner: TeamUser, user: User) {
    await getManager().transaction(async transactionalEntityManager => {
      //update team Owner
      transactionalEntityManager.getCustomRepository(TORMTeamRepository)
      .createQueryBuilder()
      .update()
      .set({ ownerId: newOwner.id })
      .where("id = :id", { id: team.id })
      .execute()

      //remove user
      transactionalEntityManager.getCustomRepository(TORMTeamUserRepository)
      .createQueryBuilder()
      .delete()
      .where("userId = :id", { id: user.id })
      .execute()
    })
  }

  async deleteTeamAndSetNewChallengeOwner(quickChallenge: QuickChallenge, team: Team, newChallengeOwnerId: string) {
    await getManager().transaction(async transactionalEntityManager => {
      //delete team
      transactionalEntityManager.getCustomRepository(TORMTeamRepository)
      .createQueryBuilder()
      .delete()
      .where("id = :id", { id: team.id })
      .execute()

      //set new challenge owner
      transactionalEntityManager.getCustomRepository(TORMQuickChallengeRepository)
      .createQueryBuilder()
      .update()
      .set({ ownerId: newChallengeOwnerId })
      .where("id = :id", { id: quickChallenge.id })
      .execute()
    })
  }

  async setNewTeamAndChallengeOwner(quickChallenge: QuickChallenge, team: Team, newTeamAndChallengeOwnerId: string) {
    await getManager().transaction(async transactionalEntityManager => {
      //set team owner
      transactionalEntityManager.getCustomRepository(TORMTeamRepository)
      .createQueryBuilder()
      .update()
      .set({ ownerId: newTeamAndChallengeOwnerId })
      .where("id = :id", { id: team.id })
      .execute()

      //set challenge owner
      transactionalEntityManager.getCustomRepository(TORMQuickChallengeRepository)
      .createQueryBuilder()
      .update()
      .set({ ownerId: newTeamAndChallengeOwnerId })
      .where("id = :id", { id: quickChallenge.id })
      .execute()
    })
  }

  async removeMemberFromTeam(memberToBeRemoved: User | TeamUser) {
    getCustomRepository(TORMTeamUserRepository)
    .createQueryBuilder()
    .delete()
    .where("userId = :id", { id: memberToBeRemoved.id })
    .execute()
  }
}

@EntityRepository(QuickChallenge)
class TORMQuickChallengeRepository extends Repository<QuickChallenge> {}

@EntityRepository(Team)
class TORMTeamRepository extends Repository<Team> {}

@EntityRepository(TeamUser)
class TORMTeamUserRepository extends Repository<TeamUser> {}
