import type { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import type { Document, Types } from 'mongoose'
import type { UserMethodsType, UserType } from '../model/UserModel/types'
import UserModel from '../model/UserModel/userModel'
import ErrorHandler from '../utils/errorHandler'

export interface RequestUserType extends Request {
    user:
        | (Document<unknown, any, UserType> &
              UserType & {
                  _id: Types.ObjectId
              } & UserMethodsType)
        | null
}

interface JwtPayload {
    id: string
}

export const isAuthenticatedUser = async (
    req: RequestUserType,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const bearerHeader = req.headers.authorization
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

export const authorizeRoles = (...roles: string[]) => {
    return (req: RequestUserType, _res: Response, next: NextFunction) => {
        if (req?.user?.role === undefined || req?.user?.role === null) {
            next(new ErrorHandler(`Resources are not accessible`, 403))
            return
        }
        if (!roles.includes(req?.user?.role)) {
            next(
                new ErrorHandler(
                    `Role: ${req?.user?.role} is not allowed to access this resource `,
                    403
                )
            )
            return
        }

        next()
    }
}
