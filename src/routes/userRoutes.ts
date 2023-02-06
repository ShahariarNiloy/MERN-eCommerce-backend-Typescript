import { forgotPassword, resetPassword } from './../controllers/authController'
import type { RequestHandler } from 'express'
import express from 'express'
import {
    loginUser,
    logoutUser,
    registerUser,
} from '../controllers/authController'
import {
    deleteUser,
    getAllUsers,
    getUser,
    updateUserRole,
} from './../controllers/userController'

const router = express.Router()

router.route('/register').post(registerUser as RequestHandler)
router.route('/login').post(loginUser as RequestHandler)
router.route('/logout').get(logoutUser as RequestHandler)

router.route('/admin/users').get(getAllUsers as RequestHandler)
router
    .route('/admin/user/:id')
    .get(getUser as RequestHandler)
    .put(updateUserRole as RequestHandler)
    .delete(deleteUser as RequestHandler)

router.route('/password/forgot').post(forgotPassword as RequestHandler)

router.route('/password/reset/:token').put(resetPassword as RequestHandler)

export default router
