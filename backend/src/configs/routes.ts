import { Router } from 'express'
import userRoutes from '../routes/UserRoutes'
import AuthRoutes from '../routes/AuthRoutes'
import employeesRoutes from '../routes/EmployeeRoutes'

const routes = Router()

routes.use('/users', userRoutes)
routes.use('/auth', AuthRoutes)
routes.use('/employees', employeesRoutes)

export default routes