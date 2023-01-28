import type { RequestHandler } from 'express'
import express from 'express'
import {
    createProduct,
    deleteProduct,
    deleteReview,
    getAdminProducts,
    getAllProducts,
    getProductDetails,
    getProductReviews,
    updateProduct,
} from '../controllers/productController'
import { createProductReview } from './../controllers/productController'

const router = express.Router()

//* For Admin Routes
router.route('/admin/product/new').post(createProduct as RequestHandler)
router
    .route('/admin/product/:id')
    .put(updateProduct as RequestHandler)
    .delete(deleteProduct as RequestHandler)
router.route('/admin/products').get(getAdminProducts as RequestHandler)

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
