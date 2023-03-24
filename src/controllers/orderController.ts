import type { NextFunction, Request, Response } from 'express'
import type { Document, Types } from 'mongoose'
import OrderModel from '../model/OrderModel/orderModel'
import ProductModel from '../model/ProductModel/productModel'
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
export const getSingleOrder = async (
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

// get logged in user  Orders
export const myOrders = async (
    req: RequestUserType,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        if (
            req.user !== null &&
            req.user !== undefined &&
            req.body !== undefined &&
            req.body !== null
        ) {
            const orders = await OrderModel.find({ user: req.user._id })

            if (orders === null || orders === undefined) {
                next(new ErrorHandler('Order not found with this Id', 404))
                return
            }

            res.status(200).json({
                success: true,
                orders,
            })
        }
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

// get all Orders -- Admin
export const getAllOrders = async (
    _req: RequestUserType,
    res: Response,
    _next: NextFunction
): Promise<void> => {
    try {
        const orders = await OrderModel.find()

        let totalAmount = 0

        orders?.forEach((order) => {
            totalAmount += order.totalPrice
        })

        res.status(200).json({
            success: true,
            totalAmount,
            orders,
        })
    } catch (err) {
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

// update Order Status -- Admin
export const updateOrder = async (
    req: RequestUserType,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const order = await OrderModel.findById(req.params.id)

        if (order === null || order === undefined) {
            next(new ErrorHandler('Order not found with this Id', 404))
            return
        }

        if (order.orderStatus === 'Delivered') {
            next(new ErrorHandler('You have already delivered this order', 400))
            return
        }

        if (req.body.status === 'Shipped') {
            // TODO: resolve this issue
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            order.orderItems.forEach(async (o) => {
                const product = await ProductModel.findById(o.product)
                if (product !== null && product !== undefined) {
                    product.stock -= o.quantity

                    await product.save({ validateBeforeSave: false })
                }
            })
        }
        order.orderStatus = req.body.status

        if (req.body.status === 'Delivered') {
            order.deliveredAt = new Date(Date.now())
        }

        await order.save({ validateBeforeSave: false })
        res.status(200).json({
            success: true,
            message: 'Order has updated successfully',
        })
    } catch (err) {
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

// delete Order -- Admin
export const deleteOrder = async (
    req: RequestUserType,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const order = await OrderModel.findById(req.params.id)

        if (order === null || order === undefined) {
            next(new ErrorHandler('Order not found with this Id', 404))
            return
        }

        await order.remove()

        res.status(200).json({
            success: true,
        })
    } catch (err) {
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
