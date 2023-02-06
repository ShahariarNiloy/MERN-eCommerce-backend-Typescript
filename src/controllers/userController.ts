import type { NextFunction, Request, Response } from 'express'
import { Types } from 'mongoose'
import UserModel from '../model/UserModel/userModel'
import ErrorHandler from '../utils/errorHandler'

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
            return
        }
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        })
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
