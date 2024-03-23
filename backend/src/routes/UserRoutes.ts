import { Router } from 'express'
import { createUser } from '../controllers/UserController'

const userRoutes = Router()

userRoutes.post('/', createUser)

export default userRoutes
