import express, { type RequestHandler } from 'express'
import {
    deleteOrder,
    getAllOrders,
    getSingleOrder,
    myOrders,
    newOrder,
    updateOrder,
} from '../controllers/orderController'
import { authorizeRoles, isAuthenticatedUser } from '../middlewares/authCheck'
const router = express.Router()

router
    .route('/order/new')
    .post(
        isAuthenticatedUser as unknown as RequestHandler,
        newOrder as RequestHandler
    )

router
    .route('/order/:id')
    .get(
        isAuthenticatedUser as unknown as RequestHandler,
        getSingleOrder as RequestHandler
    )

router
    .route('/orders/me')
    .get(
        isAuthenticatedUser as unknown as RequestHandler,
        myOrders as RequestHandler
    )

router
    .route('/admin/orders')
    .get(
        isAuthenticatedUser as unknown as RequestHandler,
        authorizeRoles('admin') as unknown as RequestHandler,
        getAllOrders as RequestHandler
    )

router
    .route('/admin/order/:id')
    .put(
        isAuthenticatedUser as unknown as RequestHandler,
        authorizeRoles('admin') as unknown as RequestHandler,
        updateOrder as RequestHandler
    )
    .delete(
        isAuthenticatedUser as unknown as RequestHandler,
        authorizeRoles('admin') as unknown as RequestHandler,
        deleteOrder as RequestHandler
    )

export default router
