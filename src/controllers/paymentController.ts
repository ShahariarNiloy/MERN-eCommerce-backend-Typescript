import type { NextFunction, Request, Response } from 'express'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2022-11-15',
})

export const processPayment = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const myPayment = await stripe.paymentIntents.create({
            amount: req.body.amount,
            currency: 'inr',
            metadata: {
                company: 'Ecommerce',
            },
        })

        res.status(200).json({
            success: true,
            client_secret: myPayment.client_secret,
        })
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
    }
}

export const sendStripeApiKey = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    res.status(200).json({ stripeApiKey: process.env.STRIPE_API_KEY })
}
