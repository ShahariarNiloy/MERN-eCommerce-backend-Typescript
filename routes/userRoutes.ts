import express from 'express'
import { loginUser, registerUser } from '../controllers/userController'

const router = express.Router()

router.route('/registration').post(registerUser)
router.route('/login').post(loginUser)

export default router
