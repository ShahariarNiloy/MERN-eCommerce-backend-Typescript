import type { RequestHandler } from 'express'
import express from 'express'
import {
    createProductAdmin,
    deleteProductAdmin,
    deleteReview,
    getAllProducts,
    getProductDetails,
    getProductReviews,
    getProductsAdmin,
    updateProductAdmin,
} from '../controllers/productController'
import { authorizeRoles, isAuthenticatedUser } from '../middlewares/authCheck'
import { createProductReview } from './../controllers/productController'

const router = express.Router()

//* For Admin Routes
router
    .route('/admin/product/new')
    .post(
        isAuthenticatedUser as unknown as RequestHandler,
        authorizeRoles('admin') as unknown as RequestHandler,
        createProductAdmin as RequestHandler
    )
router
    .route('/admin/product/:id')
    .put(
        isAuthenticatedUser as unknown as RequestHandler,
        authorizeRoles('admin') as unknown as RequestHandler,
        updateProductAdmin as RequestHandler
    )
    .delete(
        isAuthenticatedUser as unknown as RequestHandler,
        authorizeRoles('admin') as unknown as RequestHandler,
        deleteProductAdmin as RequestHandler
    )
router
    .route('/admin/products')
    .get(
        isAuthenticatedUser as unknown as RequestHandler,
        authorizeRoles('admin') as unknown as RequestHandler,
        getProductsAdmin as RequestHandler
    )

//* For All Routes
router.route('/products').get(getAllProducts as RequestHandler)
router.route('/product/:id').get(getProductDetails as RequestHandler)

//* For Users Routes
router
    .route('/reviews')
    .get(getProductReviews as RequestHandler)
    .delete(deleteReview as RequestHandler)
router.route('/review').put(createProductReview as RequestHandler)

export default router
