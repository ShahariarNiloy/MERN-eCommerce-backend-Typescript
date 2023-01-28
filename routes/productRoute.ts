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
router.route('/admin/product/new').post(createProduct)
router.route('/admin/product/:id').put(updateProduct).delete(deleteProduct)
router.route('/admin/products').get(getAdminProducts)

//* For All Routes
router.route('/products').get(getAllProducts)
router.route('/product/:id').get(getProductDetails)

//* For Users Routes
router.route('/reviews').get(getProductReviews).delete(deleteReview)
router.route('/review').put(createProductReview)

export default router
