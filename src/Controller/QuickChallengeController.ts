import uuidV4 from '../utils/uuidv4Generator.js'
import { HTTPCodes } from '../utils/HTTPEnum.js'
import { Request, Response } from 'express'
import { QuickChallenge } from '../Model/QuickChallenge.js'
import { QuickChallengeService } from '../Service/QuickChallengeService.js'

const quickChallengeService = new QuickChallengeService()

export class QuickChallengeController {
    async createChallenge(req: Request, res: Response) {
        const { name, type, goal, goalMeasure, userId } = req.body
        if (!Object.keys(QuickChallengeTypes).includes(type)) {
            res.status(HTTPCodes.BadRequest).json({ message: 'invalid quick challenge type', validTypes: Object.keys(QuickChallengeTypes) })
            return
        }
        else if (type === QuickChallengeTypes.bestof && (!Object.values(QuickChallengeBestofGoals).includes(goal) || !Object.values(QuickChallengeBestofMeasures).includes(goalMeasure))) {
            res.status(HTTPCodes.BadRequest).json({ message: 'invalid goal or goalMeasure for bestof type', validGoals: Object.keys(QuickChallengeBestofGoals), validMeasures: Object.keys(QuickChallengeBestofMeasures) })
            return
        }
        else if (type === QuickChallengeTypes.quickest && !Object.keys(QuickChallengeQuickestMeasures).includes(goalMeasure)) {
            res.status(HTTPCodes.BadRequest).json({ message: 'invalid goalMeasure for quickest type', validMeasures: Object.keys(QuickChallengeQuickestMeasures) })
            return
        }
        else if (type === QuickChallengeTypes.highest && !Object.values(QuickChallengeHighestMeasures).includes(goalMeasure)) {
            res.status(HTTPCodes.BadRequest).json({ message: 'invalid goalMeasure for highest type', validMeasures: Object.keys(QuickChallengeHighestMeasures) })
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
}

export enum QuickChallengeTypes {
    quickest = 'quickest',
    highest = 'highest',
    bestof = 'bestof'
}

export enum QuickChallengeQuickestMeasures {
    unity = 'unity'
}

export enum QuickChallengeHighestMeasures {
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