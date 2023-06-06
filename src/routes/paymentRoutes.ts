import express, { type RequestHandler } from 'express'
import {
    processPayment,
    sendStripeApiKey,
} from '../controllers/paymentController'
import { isAuthenticatedUser } from '../middlewares/authCheck'

const router = express.Router()

router
    .route('/payment/process')
    .post(
        isAuthenticatedUser as unknown as RequestHandler,
        processPayment as RequestHandler
    )

router
    .route('/stripeapikey')
    .get(
        isAuthenticatedUser as unknown as RequestHandler,
        sendStripeApiKey as RequestHandler
    )

export default router
