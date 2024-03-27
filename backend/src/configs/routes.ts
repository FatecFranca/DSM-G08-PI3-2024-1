import { Router } from 'express'
import userRoutes from '../routes/UserRoutes'
import AuthRoutes from '../routes/AuthRoutes'

const routes = Router()

routes.use('/users', userRoutes)
routes.use('/auth', AuthRoutes)
export default routes