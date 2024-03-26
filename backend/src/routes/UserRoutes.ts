import { Router } from 'express'
import { createUser, deleteUser, getUserById, updateUser } from '../controllers/UserController'

const userRoutes = Router()

userRoutes.post('/', createUser)
userRoutes.put('/:id', updateUser)
userRoutes.get('/:id', getUserById)
userRoutes.delete('/:id', deleteUser)

export default userRoutes
