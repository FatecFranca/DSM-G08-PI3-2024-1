import { Router } from 'express'
import { login } from '../controllers/AuthControllet'

const AuthRoutes = Router()

AuthRoutes.post('/login', login)

export default AuthRoutes