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
import { createProductReview } from './../controllers/productController'

const router = express.Router()

//* For Admin Routes
router.route('/admin/product/new').post(createProductAdmin as RequestHandler)
router
    .route('/admin/product/:id')
    .put(updateProductAdmin as RequestHandler)
    .delete(deleteProductAdmin as RequestHandler)
router.route('/admin/products').get(getProductsAdmin as RequestHandler)

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
