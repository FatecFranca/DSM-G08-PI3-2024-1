import { Router } from 'express'
import userRoutes from '../routes/UserRoutes'
import AuthRoutes from '../routes/AuthRoutes'
import employeesRoutes from '../routes/EmployeeRoutes'
import chatRoutes from '../routes/ChatRoutes'

const routes = Router()

routes.use('/users', userRoutes)
routes.use('/auth', AuthRoutes)
routes.use('/employees', employeesRoutes)
routes.use('/chats', chatRoutes)

export default routes