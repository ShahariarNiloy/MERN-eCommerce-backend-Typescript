import express from 'express'
import type { RequestHandler } from 'express'
import {
    deleteUser,
    loginUser,
    logoutUser,
    registerUser,
    updateUserRole,
} from '../controllers/userController'
import { getAllUsers, getUser } from './../controllers/userController'

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

export default router
