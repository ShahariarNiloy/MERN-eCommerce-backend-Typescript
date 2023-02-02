import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import 'dotenv/config'
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose'
import validator from 'validator'
import { UserMethodsType, UserModelType, UserType } from './types'

const userSchema = new mongoose.Schema<
    UserType,
    UserModelType,
    UserMethodsType
>({
    name: {
        type: String,
        required: [true, 'Please Enter Your Name'],
        maxLength: [30, 'Name cannot exceed 30 characters'],
        minLength: [4, 'Name should have more than 4 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please Enter Your Email'],
        unique: true,
        validate: [validator.isEmail, 'Please Enter a valid Email'],
    },
    password: {
        type: String,
        required: [true, 'Please Enter Your Password'],
        minLength: [8, 'Password should be greater than 8 characters'],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    role: {
        type: String,
        default: 'user',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    resetPasswordToken: String,
    resetPasswordExpire: Date,
})

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
})

// JWT TOKEN
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: process.env.JWT_EXPIRE || 1,
    })
}

// Compare Password

userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password)
}

// Generating Password Reset Token
userSchema.methods.getResetPasswordToken = function () {
    // Generating Token
    const resetToken = crypto.randomBytes(20).toString('hex')

    // Hashing and adding resetPasswordToken to userSchema
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex')

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000

    return resetToken
}

const UserModel = mongoose.model<UserType, UserModelType>('User', userSchema)

export default UserModel
