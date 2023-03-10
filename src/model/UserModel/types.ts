import type { Model } from 'mongoose'

export interface UserType {
    name: string
    email: string
    password: string
    avatar: { public_id: string; url: string }
    role?: string
    createdAt?: Date
    resetPasswordToken: string
    resetPasswordExpire: Date
}

export interface UserMethodsType {
    getJWTToken: () => string
    comparePassword: (password: string) => Promise<boolean>
    getResetPasswordToken: () => string
}

export type UserModelType = Model<UserType, unknown, UserMethodsType>
