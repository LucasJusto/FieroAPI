import uuidV4 from '../utils/uuidv4Generator.js'
import { HTTPCodes } from '../utils/HTTPEnum.js'
import { Request, Response } from 'express'
import { QuickChallenge } from '../Model/QuickChallenge.js'
import { QuickChallengeService } from '../Service/QuickChallengeService.js'
import { InsertValuesMissingError } from 'typeorm'

const quickChallengeService = new QuickChallengeService()

export class QuickChallengeController {
    async createChallenge(req: Request, res: Response) {
        const { name, type, goal, goalMeasure, userId } = req.body
        if (!Object.values(QuickChallengeTypes).includes(type)) {
            res.status(HTTPCodes.BadRequest).json({ message: 'invalid quick challenge type', validTypes: Object.values(QuickChallengeTypes) })
            return
        }
        else if (type === QuickChallengeTypes.bestof && (!Object.values(QuickChallengeBestofGoals).includes(goal) || !Object.values(QuickChallengeBestofMeasures).includes(goalMeasure))) {
            res.status(HTTPCodes.BadRequest).json({ message: 'invalid goal or goalMeasure for bestof type', validGoals: Object.values(QuickChallengeBestofGoals).filter(value => typeof(value)=='number'), validMeasures: Object.values(QuickChallengeBestofMeasures) })
            return
        }
        else if (type === QuickChallengeTypes.amount && !Object.values(QuickChallengeAmountMeasures).includes(goalMeasure)) {
            res.status(HTTPCodes.BadRequest).json({ message: 'invalid goalMeasure for Amount type', validMeasures: Object.values(QuickChallengeAmountMeasures) })
            return
        }
        else if (type === QuickChallengeTypes.byTime && !Object.values(QuickChallengeByTimeMeasures).includes(goalMeasure)) {
            res.status(HTTPCodes.BadRequest).json({ message: 'invalid goalMeasure for ByTime type', validMeasures: Object.values(QuickChallengeByTimeMeasures) })
            return
        }
        else {
            const quickChallenge = new QuickChallenge(uuidV4(), name, uuidV4(), type, goal, goalMeasure, false, userId)
            try {
                const createdQuickChallenge = await quickChallengeService.createQuickChallenge(quickChallenge)
                res.status(HTTPCodes.Created).json({ quickChallenge: createdQuickChallenge })
            } catch(error) {
                res.status(HTTPCodes.InternalServerError).json({ error: error })
            }
            
        }
    }

    async getUserQuickChallengesById(req: Request, res: Response) {
        try {
            const quickChallenges = await quickChallengeService.getUserQuickChallengesById(req.body.userId)
            res.status(HTTPCodes.Created).json({ quickChallenges: quickChallenges })
        } catch(error) {
            res.status(HTTPCodes.InternalServerError).json({ error: error })
        }
    }

    async deleteQuickChallenge(req: Request, res: Response) {
        try {
            const quickChallengeToDelete = await quickChallengeService.getQuickChallengeById(req.params.id)
            if (quickChallengeToDelete) {
                if (quickChallengeToDelete.ownerId === req.body.userId) {
                    try {
                        await quickChallengeService.deleteQuickChallenge(quickChallengeToDelete)
                        res.status(HTTPCodes.Success).json({ message: 'successfully deleted.' })
                    } catch(error) {
                        res.status(HTTPCodes.InternalServerError).json({ error: error })
                        return
                    }
                }
                else {
                    res.status(HTTPCodes.Forbidden).json({ error: 'this user cant delete this challenge because he is not the owner.' })
                    return
                }
            }
            else {
                res.status(HTTPCodes.NotFound).json({ error: 'quick challenge not found' })
                return
            }
        }
        catch(error) {
            res.status(HTTPCodes.InternalServerError).json({ error: error })
        }
    }
}

export enum QuickChallengeTypes {
    amount = 'amount',
    byTime = 'byTime',
    bestof = 'bestof'
}

export enum QuickChallengeAmountMeasures {
    unity = 'unity'
}

export enum QuickChallengeByTimeMeasures {
    minutes = 'minutes',
    seconds = 'seconds'
}

export enum QuickChallengeBestofMeasures {
    rounds = 'rounds'
}

export enum QuickChallengeBestofGoals {
    five = 5,
    three = 3
}