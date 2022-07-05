import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { HTTPCodes } from './HTTPEnum.js'
// can be reused by many routes

// parallel processing
export const validate = (validations: ValidationChain[]) => {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)))

        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }

        res.status(HTTPCodes.BadRequest).json({ errors: errors.array() })
    }
}