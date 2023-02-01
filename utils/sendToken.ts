import type { Response } from 'express'
import type { Document, Types } from 'mongoose'
import type { UserMethodsType, UserType } from '../model/UserModel/userModel'

type User = Document<unknown, any, UserType> &
    UserType & {
        _id: Types.ObjectId
    } & UserMethodsType

const SendToken = (user: User, statusCode: number, res: Response) => {
    const token = user.getJWTToken()

    const cookieOptions = {
        expires: new Date(
            Date.now() +
                (Number(process.env.COOKIE_EXPIRE) ?? 2) * 24 * 60 * 60 * 1000
        ),
        httpOnly: true,
    }

    res.status(statusCode).cookie('token', token, cookieOptions).json({
        success: true,
        user,
        token,
    })
}

export default SendToken
