import type { Response } from 'express'
import type { Document, Types } from 'mongoose'
import type { UserMethodsType, UserType } from '../model/UserModel/types'

type User = Document<unknown, any, UserType> &
    UserType & {
        _id: Types.ObjectId
    } & UserMethodsType

const SendToken = (user: User, statusCode: number, res: Response): void => {
    const token = user.getJWTToken()

    // const GMT_BD = 6 * 60 * 60 * 1000

    // const cookieOptions = {
    //     expires: new Date(Number(new Date()) + GMT_BD + 2 * 60 * 60 * 1000),
    //     httpOnly: true,
    // }

    res.status(statusCode).cookie('token', token).json({
        success: true,
        user,
        token,
    })
}

export default SendToken
