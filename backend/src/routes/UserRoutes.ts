import { Router } from 'express'
import { userController } from '../controllers/UserController'

const userRoutes = Router()

userRoutes.post('/', userController.create)

export default userRoutes
