import { Router } from 'express'
import { createUser, getUserById, updateUser } from '../controllers/UserController'

const userRoutes = Router()

userRoutes.post('/', createUser)
userRoutes.put('/:id', updateUser)
userRoutes.get('/:id', getUserById)

export default userRoutes
