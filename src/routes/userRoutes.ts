import express from 'express'
import {
    deleteUser,
    loginUser,
    registerUser,
    updateUserRole,
} from '../controllers/userController'
import { getAllUsers, getUser } from './../controllers/userController'

const router = express.Router()

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/admin/users').get(getAllUsers)
router
    .route('/admin/user/:id')
    .get(getUser)
    .put(updateUserRole)
    .delete(deleteUser)

export default router
