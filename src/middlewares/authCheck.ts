import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import UserModel from '../model/UserModel/userModel'
import ErrorHandler from '../utils/errorHandler'

export interface RequestUserType extends Request {
    user: string | null
}

interface JwtPayload {
    id: string
}

export const isAuthenticatedUser = async (
    req: RequestUserType,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const bearerHeader = req?.headers?.authorization
    const token = bearerHeader?.split(' ')?.[1]

    if (token === null || token === undefined) {
        next(new ErrorHandler('Please Login to access this resource', 401))
        return
    }
    try {
        const { id } = jwt.verify(
            token,
            process.env.JWT_SECRET ?? 'secret'
        ) as JwtPayload

        req.user = await UserModel.findById(id)
        next()
    } catch (err) {
        if (err instanceof Error) {
            next(new ErrorHandler(JSON.stringify(err), 401))
        }
    }
}
