import UserModel from '../model/UserModel/userModel'
import { NextFunction, Request, Response } from 'express'
import ErrorHandler from '../utils/errorHandler'
import SendToken from '../utils/sendToken'

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { name, email, password } = req.body

    if (!(name ?? false) || !(email ?? false) || !(password ?? false)) {
        next(
            new ErrorHandler('Cannot register user. Not sufficient info.', 404)
        )
        return
    }

    const user = await UserModel.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'myCloud.public_id',
            url: ' myCloud.secure_url',
        },
    })

    SendToken(user, 201, res)
}

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const { email, password } = req?.body

    if (!(email ?? false) || !(password ?? false)) {
        next(new ErrorHandler('Enter email and password', 400))
        return
    }

    const user = await UserModel.findOne({ email }).select('+password')

    if (!(user ?? false) || user === null) {
        next(new ErrorHandler('Invalid credentials', 401))
        return
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (isPasswordMatched) {
        next(new ErrorHandler('Invalid credentials', 401))
        return
    }

    SendToken(user, 200, res)
}

export const logout = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: 'Logged Out',
    })
}
