import { Router } from 'express'
import { createUser, deleteUser, getUserById, updateUser } from '../controllers/UserController'
import { authenticated } from '../middlewares/authenticated'

const userRoutes = Router()

userRoutes.post('/', createUser)
userRoutes.put('/:id', authenticated, updateUser)
userRoutes.get('/:id', authenticated, getUserById)
userRoutes.delete('/:id', authenticated, deleteUser)

export default userRoutes
