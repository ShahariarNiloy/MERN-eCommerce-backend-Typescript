import type { NextFunction, Request, Response } from 'express'
import type { Document } from 'mongoose'
import { Types } from 'mongoose'
import type { UserMethodsType, UserType } from '../model/UserModel/types'
import UserModel from '../model/UserModel/userModel'
import ErrorHandler from '../utils/errorHandler'
import SendToken from '../utils/sendToken'
// import { RequestUserType } from './type'

interface RequestUserType extends Request {
    user?:
        | (Document<unknown, any, UserType> &
              UserType & {
                  _id: Types.ObjectId
              } & UserMethodsType)
        | null
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

export const getUserDetails = async (
    req: RequestUserType,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (req.user === null || req.user === undefined) {
            next(new ErrorHandler(`Authentication required`, 400))
            return
        }
        const user = await UserModel.findById(req.user.id)

        res.status(200).json({
            success: true,
            user,
        })
    } catch (err) {
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

// update User password
export const updatePassword = async (
    req: RequestUserType,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (req.user === undefined || req.user === null) {
            next(new ErrorHandler('Authentication required.', 400))
            return
        }
        const user = await UserModel.findById(req.user.id).select('+password')

        if (user === undefined || user === null) {
            next(new ErrorHandler('User not found.', 400))
            return
        }

        const isPasswordMatched = await user.comparePassword(
            req.body.oldPassword
        )

        if (!isPasswordMatched) {
            next(new ErrorHandler('Old password is incorrect', 400))
            return
        }

        if (req.body.newPassword !== req.body.confirmPassword) {
            next(new ErrorHandler('password does not match', 400))
            return
        }

        user.password = req.body.newPassword

        await user.save()

        SendToken(user, 200, res)
    } catch (err) {
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

export const updateProfile = async (
    req: RequestUserType,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const { name, email, avatar } = req.body

    if (!(Boolean(name) && Boolean(email))) {
        next(new ErrorHandler('Not sufficient info.', 404))
        return
    }

    const newUserData = {
        name,
        email,
        avatar,
    }

    if (req.user === undefined || req.user === null) {
        next(new ErrorHandler('Authentication required.', 400))
        return
    }

    try {
        if (req.body.avatar !== '') {
            const user = await UserModel.findById(req.user.id)

            if (user === undefined || user === null) {
                next(new ErrorHandler('User not found.', 400))
                return
            }
            // const imageId = user.avatar.public_id

            // await cloudinary.v2.uploader.destroy(imageId)

            // const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
            //     folder: 'avatars',
            //     width: 150,
            //     crop: 'scale',
            // })

            newUserData.avatar = {
                public_id: 'myCloud.public_id',
                url: 'myCloud.secure_url',
            }
        }

        const user = await UserModel.findByIdAndUpdate(
            req.user.id,
            newUserData,
            {
                new: true,
                runValidators: true,
                useFindAndModify: false,
            }
        )

        res.status(200).json({
            success: true,
            user,
        })
    } catch (err) {
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

// Get all users(admin)
export const getAllUser = async (
    req: RequestUserType,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const users = await UserModel.find()

        res.status(200).json({
            success: true,
            users,
        })
    } catch (err) {
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

// Get single user (admin)
export const getSingleUser = async (
    req: RequestUserType,
    res: Response,
    next: NextFunction
): Promise<void> => {
    if (req.params.id === null || req.params.id === undefined) {
        next(new ErrorHandler(`No user`, 500))
        return
    }
    try {
        const user = await UserModel.findById(req.params.id)

        if (user === null) {
            next(
                new ErrorHandler(
                    `User does not exist with Id: ${req.params.id}`,
                    500
                )
            )
            return
        }

        res.status(200).json({
            success: true,
            user,
        })
    } catch (err) {
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
