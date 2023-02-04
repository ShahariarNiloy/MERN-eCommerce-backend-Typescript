import type { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'
import UserModel from '../model/UserModel/userModel'
import ErrorHandler from '../utils/errorHandler'
import SendToken from '../utils/sendToken'

export const registerUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { name, email, password } = req.body

    if (Boolean(name) && Boolean(email) && Boolean(password)) {
        try {
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

export const getAllUsers = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const users = await UserModel.find()

        res.status(200).json({ success: true, users })
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ success: false, message: err.message })
        } else {
            res.status(500).json({
                success: false,
                message: 'Something went wrong',
            })
        }
    }
}

export const getUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id } = req?.params

    if (Types.ObjectId.isValid(id)) {
        next(new ErrorHandler('Invalid Request', 400))
        return
    }

    try {
        const user = await UserModel.findById({ _id: id })

        res.status(200).json({ success: true, user })
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ success: false, message: err.message })
        } else {
            res.status(500).json({
                success: false,
                message: 'Something went wrong',
            })
        }
    }
}

export const updateUserRole = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id } = req?.params

    if (!Types.ObjectId.isValid(id)) {
        next(new ErrorHandler('Invalid Request', 400))
        return
    }
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    try {
        await UserModel.findByIdAndUpdate(id, newUserData, {
            new: true,
            runValidators: true,
            useFindAndModify: false,
        })

        res.status(200).json({
            success: true,
            message: 'Role updated successfully',
        })
    } catch (err: unknown) {
        if (err instanceof Error) {
            res.status(500).json({ success: false, message: err.message })
        } else {
            res.status(500).json({
                success: false,
                message: 'Something went wrong',
            })
        }
    }
}

export const deleteUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { id } = req?.params

    if (!Types.ObjectId.isValid(id)) {
        next(new ErrorHandler('Invalid Request', 400))
        return
    }

    const user = await UserModel.findById(id)

    if (user === null) {
        next(new ErrorHandler(`User does not exist with Id: ${id}`, 400))
        return
    }

    // const imageId = user.avatar.public_id

    // await cloudinary.v2.uploader.destroy(imageId)

    await user.remove()

    res.status(200).json({
        success: true,
        message: 'User Deleted Successfully',
    })
}
