import { Router } from 'express'
import { login, verifyToken } from '../controllers/AuthController'
import { authenticated } from '../middlewares/authenticated'

const AuthRoutes = Router()

AuthRoutes.post('/login', login)
AuthRoutes.get('/verify-token', authenticated, verifyToken)

export default AuthRoutes