import type { NextFunction, Request, Response } from 'express'
import type { Document, Types } from 'mongoose'
import OrderModel from '../model/OrderModel/orderModel'
import type { UserMethodsType, UserType } from '../model/UserModel/types'
import ErrorHandler from '../utils/errorHandler'

interface RequestUserType extends Request {
    user?:
        | (Document<unknown, any, UserType> &
              UserType & {
                  _id: Types.ObjectId
              } & UserMethodsType)
        | null
}

// Create new Order
export const newOrder = async (
    req: RequestUserType,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body

    try {
        if (
            req.user !== null &&
            req.user !== undefined &&
            req.body !== undefined &&
            req.body !== null
        ) {
            const order = await OrderModel.create({
                shippingInfo,
                orderItems,
                paymentInfo,
                itemsPrice,
                taxPrice,
                shippingPrice,
                totalPrice,
                paidAt: Date.now(),
                user: req.user._id,
            })

            res.status(201).json({
                success: true,
                order,
            })
            return
        }
        next(
            new ErrorHandler('Cannot place an order. Not sufficient info.', 400)
        )
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

// get Single Order
exports.getSingleOrder = async (
    req: RequestUserType,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const order = await OrderModel.findById(req.params.id).populate(
            'user',
            'name email'
        )

        if (order === null || order === undefined) {
            next(new ErrorHandler('Order not found with this Id', 404))
            return
        }

        res.status(200).json({
            success: true,
            order,
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
