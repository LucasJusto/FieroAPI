import uuidV4 from "../utils/uuidv4Generator.js";
 import { HTTPCodes } from "../utils/HTTPEnum.js";
 import { Request, Response } from "express";
 import { QuickChallenge } from "../Model/QuickChallenge.js";
 import { QuickChallengeService } from "../Service/QuickChallengeService.js";
 import { QuickChallengeRepository } from "../Repository/QuickChallengeRepository.js";
import { param } from "express-validator";
import { UserService } from "../Service/UserService.js";
import { Team } from "../Model/Team.js";

 const quickChallengeService = new QuickChallengeService();
 const quickChallengeRepository = new QuickChallengeRepository();
 const userService = new UserService();
 const maxMaxTeams = 4;

 export class QuickChallengeController {
   async createChallenge(req: Request, res: Response) {
     const { name, type, goal, goalMeasure, userId, online, maxTeams } =
       req.body;
    if (online === false) {
      if (maxTeams > maxMaxTeams) {
        res.status(HTTPCodes.BadRequest).json({
          message: "Invalid maxTeams value. It cant exceed " + maxMaxTeams + " for offline challenges.",
        });
        return;
      }
    }
     
     if (!Object.values(QuickChallengeTypes).includes(type)) {
       res.status(HTTPCodes.BadRequest).json({
         message: "invalid quick challenge type",
         validTypes: Object.values(QuickChallengeTypes),
       });
       return;
     } 
     else if (
       type === QuickChallengeTypes.bestof &&
       (!Object.values(QuickChallengeBestofGoals).includes(goal) ||
         !Object.values(QuickChallengeBestofMeasures).includes(goalMeasure))
     ) {
       res.status(HTTPCodes.BadRequest).json({
         message: "invalid goal or goalMeasure for bestof type",
         validGoals: Object.values(QuickChallengeBestofGoals).filter(
           (value) => typeof value == "number"
         ),
         validMeasures: Object.values(QuickChallengeBestofMeasures),
       });
       return;
     } 
     else if (
       (type === QuickChallengeTypes.amount || type === QuickChallengeTypes.volleyball 
        || type === QuickChallengeTypes.truco) && !Object.values(QuickChallengeAmountMeasures).includes(goalMeasure)
     ) {
       res.status(HTTPCodes.BadRequest).json({
         message: "invalid goalMeasure for Amount type",
         validMeasures: Object.values(QuickChallengeAmountMeasures),
       });
       return;
     } 
     else if (
       type === QuickChallengeTypes.byTime &&
       !Object.values(QuickChallengeByTimeMeasures).includes(goalMeasure)
     ) {
       res.status(HTTPCodes.BadRequest).json({
         message: "invalid goalMeasure for ByTime type",
         validMeasures: Object.values(QuickChallengeByTimeMeasures),
       });
       return;
     } 
     else {
       const quickChallenge = new QuickChallenge(uuidV4(), name, type, goal, goalMeasure, false, userId, online, false, maxTeams)
       try {
         if (online === false) {
           const numberOfTeams = req.body["numberOfTeams"];
           if (numberOfTeams) {
             if (numberOfTeams > maxTeams) {
               res.status(HTTPCodes.BadRequest).json({
                 message: "numberOfTeams cant be higher than maxTeams.",
               });
               return;
             }
             if (Object.values(QuickChallengePossibleNumberOfTeams).filter((value) => typeof value == "number").includes(numberOfTeams)) {
               const createdQuickChallenge = await quickChallengeService.createQuickChallenge(quickChallenge, numberOfTeams);
               res.status(HTTPCodes.Created).json({ quickChallenge: createdQuickChallenge });
               return;
             } 
             else {
               res.status(HTTPCodes.BadRequest).json({
                 message: "Invalid numberOfTeams",
                 validNumberOfTeams: Object.values(
                   QuickChallengePossibleNumberOfTeams
                 ).filter((value) => typeof value == "number"),
               });
               return;
             }
           } 
           else {
             res.status(HTTPCodes.BadRequest).json({
               message:
                 "Offline challenges need to send the paramater numberOfTeams at body.",
             });
             return;
           }
         } 
         else {
           quickChallenge.invitationCode = await quickChallengeService.getValidInvitationCode()
           const createdQuickChallenge = await quickChallengeService.createQuickChallenge(quickChallenge, 1);
           res.status(HTTPCodes.Created).json({ quickChallenge: createdQuickChallenge });
           return;
         }
       } catch (error) {
         res.status(HTTPCodes.InternalServerError).json({ error: error });
         return;
       }
     }
   }

   async getUserQuickChallengesById(req: Request, res: Response) {
     try {
       const quickChallenges =
         await quickChallengeService.getUserQuickChallengesById(req.body.userId);
       res.status(HTTPCodes.Created).json({ quickChallenges: quickChallenges });
     } catch (error) {
       res.status(HTTPCodes.InternalServerError).json({ error: error });
     }
   }

   async getUserPlayingQuickChallengesById(req: Request, res: Response) {
    try {
      const quickChallenges = await quickChallengeService.getUserPlayingQuickChallengesById(req.body.userId);
      res.status(HTTPCodes.Created).json({ quickChallenges: quickChallenges });
    } catch (error) {
      res.status(HTTPCodes.InternalServerError).json({ error: error });
    }
  }

   async deleteQuickChallengesByOwnerId(req: Request, res: Response) {
     try {
       await quickChallengeService.deleteUserQuickChallengesById(req.params.id);
       res.writeContinue();
     } catch (error) {
       res.status(HTTPCodes.InternalServerError).json({ error: error });
     }
   }

   async deleteQuickChallenge(req: Request, res: Response) {
     try {
       const quickChallengeToDelete =
         await quickChallengeService.getQuickChallengeById(req.params.id);
       if (quickChallengeToDelete) {
         if (quickChallengeToDelete.ownerId === req.body.userId) {
           try {
             await quickChallengeService.deleteQuickChallenge(
               quickChallengeToDelete
             );
             res
               .status(HTTPCodes.Success)
               .json({ message: "successfully deleted." });
           } catch (error) {
             res.status(HTTPCodes.InternalServerError).json({ error: error });
             return;
           }
         } else {
           res.status(HTTPCodes.Forbidden).json({
             error:
               "this user cant delete this challenge because he is not the owner.",
           });
           return;
         }
       } else {
         res
           .status(HTTPCodes.NotFound)
           .json({ error: "quick challenge not found" });
         return;
       }
     } catch (error) {
       res.status(HTTPCodes.InternalServerError).json({ error: error });
     }
   }

   async patchScore(req: Request, res: Response) {
     try {
       const { score, userId } = req.body
       const { quickChallengeId, teamId, teamMemberId } = req.params

       const teamUser = await quickChallengeRepository.getTeamUserById(teamMemberId)
       const team = await quickChallengeRepository.getTeamById(teamId)
       const challenge = await quickChallengeRepository.getQuickChallengeById(quickChallengeId)
       if(challenge) {
           if(!challenge.alreadyBegin) {
             res.status(HTTPCodes.BadRequest).json({ message: 'This challenge didnt begin yet' })
             return
           }
           if(challenge.finished) {
             res.status(HTTPCodes.BadRequest).json({ message: 'This challenge already finished' })
             return
           }
           if(!challenge.teams.some(team => team.id === teamId)) {
            res.status(HTTPCodes.BadRequest).json({ message: 'This team isnt playing this challenge' })
            return
           }
           
       }
       else {
         res.status(HTTPCodes.NotFound).json({ message: 'Challenge not found' })
         return
       }
       //the member to be updated needs to exist.
       if (teamUser) {
         //if the member has an userId, it is a real player. Else it is from someone without account in the offline mode.
         if (teamUser.userId) {
           if (userId !== teamUser.userId) {
             res.status(HTTPCodes.Unauthorized).json({ message: 'This user cant write in this area' })
             return
           }
         }
         else {
           if (team) {
             //if it is without userId, we need to check at least if it is coming from the device of the challenge owner.
             if (challenge?.ownerId !== userId) {
               res.status(HTTPCodes.Unauthorized).json({ message: 'This user cant write in this area' })
               return
             }
             if (team.quickChallengeId !== quickChallengeId) {
               res.status(HTTPCodes.BadRequest).json({ message: 'This team isnt from the challenge specified' })
               return
             }
           }
           else {
             res.status(HTTPCodes.NotFound).json({ message: 'Team not found' })
             return
           }
         }

         if (teamId !== teamUser.teamId) {
           res.status(HTTPCodes.BadRequest).json({ message: 'This team member isnt from the team specified' })
           return
         }
       }
       else {
         res.status(HTTPCodes.NotFound).json({ message: 'Team member not found' })
         return
       }
       const member = await quickChallengeService.patchScore(score, teamUser)
       res.status(HTTPCodes.Success).json({ member: member })
     } catch(error) {
       res.status(HTTPCodes.InternalServerError).json({ error: error })
     }
   }

   async patchAlreadyBegin(req: Request, res: Response) {
     try {
       const { alreadyBegin, userId } = req.body;
       const quickChallengeId = req.params.quickChallengeId;

       const quickChallenge = await quickChallengeRepository.getQuickChallengeById(quickChallengeId);

       if (quickChallenge) {
         if (quickChallenge.ownerId !== userId) {
           res
             .status(HTTPCodes.Unauthorized)
             .json({ message: "this user cant begin this challenge" });
           return;
         }
         const updatedQuickChallenge = await quickChallengeService.patchAlreadyBegin(alreadyBegin, quickChallenge);
         res
           .status(HTTPCodes.Success)
           .json({ quickChallenge: updatedQuickChallenge });
         return;
       }
     } catch (error) {
       res.status(HTTPCodes.InternalServerError).json({ error: error });
       return;
     }
   }

   async patchFinished(req: Request, res: Response) {
     try {
       const { finished, userId } = req.body
       const quickChallengeId = req.params.quickChallengeId

       const quickChallenge = await quickChallengeRepository.getQuickChallengeById(quickChallengeId)
       
       if (quickChallenge) {
        //not owner can actually finish it when getting max points
          //  if (quickChallenge.ownerId !== userId) {
          //      res.status(HTTPCodes.Unauthorized).json({ message: 'this user cant finish this challenge' })
          //      return
          //  }
           if (!quickChallenge.alreadyBegin) {
               res.status(HTTPCodes.BadRequest).json({ message: 'cant finish a challenge that didnt begin' })
               return
           }
           const updatedQuickChallenge = await quickChallengeService.patchFinished(finished, quickChallenge)
           res.status(HTTPCodes.Success).json({ quickChallenge: updatedQuickChallenge })
           return
       }
     } catch (error) {
       res.status(HTTPCodes.InternalServerError).json({ error: error });
       return;
     }
   }

    async joinByInvitationCode(req: Request, res: Response) {
      const { userId, invitationCode } = req.body
      try {
        const quickChallenge = await quickChallengeRepository.getQuickChallengeByInvitationCode(invitationCode)
        if (quickChallenge.length < 1) {
          res.status(HTTPCodes.NotFound).json({ message: 'QuickChallenge not found' });
          return;
        }
        if(quickChallenge[0].teams.filter(team => team.ownerId == userId).length > 0) {
          res.status(HTTPCodes.Conflict).json({ message: 'This user is already playing this QuickChallenge' });
          return;
        }
        const quickChallengeWithNewTeam = await quickChallengeService.insertTeam(quickChallenge[0], userId)
        res.status(HTTPCodes.Created).json({ quickChallenge: quickChallengeWithNewTeam });
        return;
      }
      catch(error) {
        res.status(HTTPCodes.InternalServerError).json({ error: error });
        return;
      }
    }

    async getQuickChallengeById(req: Request, res: Response) {
      const quickChallengeId = req.params.quickChallengeId
      const userId = req.body.userId

      try {
        const quickChallenge = await quickChallengeService.getQuickChallengeById(quickChallengeId)

        if(!quickChallenge) {
          res.status(HTTPCodes.NotFound).json({ message: "Challenge not found" })
          return
        }

        var userIsNotInChallenge = true
        //checks if userId is in the challenge
        quickChallenge?.teams.forEach(function(team) {
            team.members.forEach(function(member) {
              if(member.userId === userId) {
                /*if the userIsNotInChallenge is removed, the return is ignored (dont know why) and the
                API crashes at the res.status(HTTPCodes.Unauthorized)... for: "Error [ERR_HTTP_HEADERS_SENT]: 
                Cannot set headers after they are sent to the client"*/
                userIsNotInChallenge = false
                res.status(HTTPCodes.Success).json({ quickChallenge: quickChallenge })
                return
              }
            })
        })
        if (userIsNotInChallenge) {
          res.status(HTTPCodes.Unauthorized).json({ message: "This user is not at this challenge" })
          return
        }
      }
      catch(error) {
        res.status(HTTPCodes.InternalServerError).json({ error: error });
        return;
      }
    }

    async exitFromChallengeById(req: Request, res: Response) {
      const userId = req.body.userId
      const quickChallengeId = req.params.quickChallengeId
      try {
        const user = await userService.getUserById(userId)
        if(!user) {
          res.status(HTTPCodes.NotFound).json({ message: "User Not found" });
          return;
        }

        const quickChallenge = await quickChallengeService.getQuickChallengeById(quickChallengeId)
        if(!quickChallenge) {
          res.status(HTTPCodes.NotFound).json({ message: "QuickChallenge Not found" });
          return;
        }

        var usersTeam
        var isMemberInThisChallenge: boolean = false
        quickChallenge.teams.forEach(function(team) {
          team.members.forEach(function(member) {
            if(member.userId === userId) {
              isMemberInThisChallenge = true
              usersTeam = team
              return
            }
          })
          if(isMemberInThisChallenge) {
            return
          }
        })
        if(isMemberInThisChallenge) {
          if (usersTeam) {
            await quickChallengeService.exitChallenge(quickChallenge, usersTeam as Team, user)
            res.status(HTTPCodes.Success).json({ message: "Exited successfully" });
            return;
          }
          else {
            res.status(HTTPCodes.InternalServerError).json({ message: "An unexpected error happened" });
            return;
          }
        }
        else {
          res.status(HTTPCodes.BadRequest).json({ message: "This user isnt playing this challenge" });
          return;
        }
      }
      catch(error){
        res.status(HTTPCodes.InternalServerError).json({ error: error });
        return;
      }
    }

    async removeParticipantById(req: Request, res: Response) {
      const { userId, userToDeleteId } = req.body
      const quickChallengeId = req.params.quickChallengeId

      try {
        const owner = await userService.getUserById(userId)

        if(!owner) {
          res.status(HTTPCodes.NotFound).json({ message: 'User with id ' + userId + 'not found.' });
          return;
        }

        const quickChallenge = await quickChallengeService.getQuickChallengeById(quickChallengeId)

        if(!quickChallenge) {
          res.status(HTTPCodes.NotFound).json({ message: 'QuickChallenge not found.' });
          return;
        }

        const userToBeRemoved = await userService.getUserById(userToDeleteId)

        if(!userToBeRemoved) {
          res.status(HTTPCodes.NotFound).json({ message: 'User with id ' + userToDeleteId + 'not found.' });
          return;
        }

        if(userToBeRemoved.id === owner.id) {
          res.status(HTTPCodes.BadRequest).json({ message: 'You cant remove yourself.' })
          return;
        }

        if(quickChallenge.ownerId != owner.id) {
          res.status(HTTPCodes.Unauthorized).json({ message: 'Only the owner have permission to remove participants from a quick challenge.' })
          return
        }
        var isUserToDeleteInChallenge = false

        quickChallenge.teams.forEach(function(team) {
          team.members.forEach(function(member) {
            if(member.userId === userToBeRemoved.id) {
              isUserToDeleteInChallenge = true
              return
            }
          })
          if(isUserToDeleteInChallenge) {
            return
          }
        })

        if(isUserToDeleteInChallenge) {
          await quickChallengeService.removeParticipant(quickChallenge, userToBeRemoved)
          const quickChallengeWithoutRemovedUser = await quickChallengeService.getQuickChallengeById(quickChallenge.id)
          res.status(HTTPCodes.Success).json({ quickChallenge: quickChallengeWithoutRemovedUser })
          return
        }
        else {
          res.status(HTTPCodes.BadRequest).json({ message: 'The user to be removed is not at this challenge' })
          return
        }
      }
      catch(error) {
        res.status(HTTPCodes.InternalServerError).json({ error: error });
        return;
      }
    }
 }

 export enum QuickChallengeTypes {
   amount = "amount",
   byTime = "byTime",
   bestof = "bestof",
   volleyball = "volleyball",
   truco = "truco"
 }

 export enum QuickChallengeAmountMeasures {
   unity = "unity",
 }

 export enum QuickChallengeByTimeMeasures {
   minutes = "minutes",
   seconds = "seconds",
 }

 export enum QuickChallengeBestofMeasures {
   rounds = "rounds",
 }

 export enum QuickChallengeBestofGoals {
   five = 5,
   three = 3,
 }

 export enum QuickChallengePossibleNumberOfTeams {
   two = 2,
   three = 3,
   four = 4,
 }