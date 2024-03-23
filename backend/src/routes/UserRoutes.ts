import { Router } from 'express'
import { createUser, updateUser } from '../controllers/UserController'

const userRoutes = Router()

userRoutes.post('/', createUser)
userRoutes.put('/:id', updateUser)

export default userRoutes
