import cloudinary from 'cloudinary'
import * as crypto from 'crypto'

import type { NextFunction, Request, Response } from 'express'
import UserModel from '../model/UserModel/userModel'
import ErrorHandler from '../utils/errorHandler'
import sendEmail from '../utils/sendEmail'
import SendToken from '../utils/sendToken'

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { name, email, password } = req.body
    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
        folder: 'avatars',
        width: 150,
        crop: 'scale',
    })

    if (Boolean(name) && Boolean(email) && Boolean(password)) {
        try {
            const user = await UserModel.create({
                name,
                email,
                password,
                avatar: {
                    public_id: myCloud.public_id,
                    url: myCloud.secure_url,
                },
            })
            SendToken(user, 201, res)
            return
        } catch (err: unknown) {
            if (err instanceof Error) {
                res.status(400).json({ success: false, message: err.message })
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Something went wrong',
                })
            }
            return
        }
    }
    next(new ErrorHandler('Cannot register user. Not sufficient info.', 400))
}

export const loginUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { email, password } = req?.body

    if (!(Boolean(email) && Boolean(password))) {
        next(new ErrorHandler('Enter email and password', 401))
        return
    }

    const user = await UserModel.findOne({ email }).select('+password')

    if (user === null) {
        next(new ErrorHandler('Invalid credentials', 401))
        return
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        next(new ErrorHandler('Invalid credentials', 401))
        return
    }

    SendToken(user, 200, res)
}

export const logoutUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    })

    res.status(200).json({
        success: true,
        message: 'Logged Out',
    })
}

export const forgotPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const user = await UserModel.findOne({ email: req.body.email })

    if (user === null || user === undefined) {
        next(new ErrorHandler('User not found', 404))
        return
    }

    // Get ResetPassword Token
    const resetToken = user.getResetPasswordToken()

    await user.save({ validateBeforeSave: false })

    const resetPasswordUrl = `${req.protocol}://${
        req.get('host') as string
    }/password/reset/${resetToken}`

    const message = `Your password reset token is :- \n\n ${resetPasswordUrl} \n\nIf you have not requested this email then, please ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: `eCommerce Password Recovery`,
            message,
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`,
        })
    } catch (err) {
        user.resetPasswordToken = ''
        user.resetPasswordExpire = new Date()

        await user.save({ validateBeforeSave: false })
        if (err instanceof Error) {
            next(new ErrorHandler(err.message, 500))
            return
        }
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
    }
}

export const resetPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex')

    const user = await UserModel.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    })

    if (user === null || user === undefined) {
        next(
            new ErrorHandler(
                'Reset Password Token is invalid or has been expired',
                400
            )
        )
        return
    }

    if (req.body.password !== req.body.confirmPassword) {
        next(new ErrorHandler('Password does not password', 400))
        return
    }

    user.password = req.body.password
    user.resetPasswordToken = ''
    user.resetPasswordExpire = new Date()

    await user.save()

    SendToken(user, 200, res)
}
