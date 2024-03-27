import { Router } from 'express'
import { login } from '../controllers/AuthController'

const AuthRoutes = Router()

AuthRoutes.post('/login', login)

export default AuthRoutes