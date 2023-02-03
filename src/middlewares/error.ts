import ErrorHandler from '../utils/errorHandler'

import type { ErrorRequestHandler } from 'express'
import { Error } from 'mongoose'

const ErrorFunc: ErrorRequestHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode ?? 500
    err.message = err.message ?? 'Internal Server Error'

    // Wrong Mongodb Id error
    if (err instanceof Error.CastError && err.name === 'CastError') {
        const message = `Resource not found. ${err?.path}`
        err = new ErrorHandler(message, 400)
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate Key Entered`
        err = new ErrorHandler(message, 400)
    }

    // Wrong JWT error
    if (err.name === 'JsonWebTokenError') {
        const message = `Json Web Token is invalid, Try again `
        err = new ErrorHandler(message, 400)
    }

    // JWT EXPIRE error
    if (err.name === 'TokenExpiredError') {
        const message = `Json Web Token is Expired, Try again `
        err = new ErrorHandler(message, 400)
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    })
}

export default ErrorFunc
