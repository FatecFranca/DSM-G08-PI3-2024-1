import { Router } from 'express'
import jwt from 'jsonwebtoken'
import { createEmployee, deleteEmployee, getEmployeeById, listEmployees } from '../controllers/EmployeeController'
import { authenticated } from '../middlewares/authenticated'
import { authorize } from '../middlewares/authorize'
import { AuthorizationPolicy } from '../types/AuthorizationPolicy'
import { RoleEnum } from '../types/RoleEnum'
import { employeeModel } from '../models/EmployeeModel'
import { userModel } from '../models/UserModel'
import { env } from '../configs/env'

const employeesRoutes = Router()

employeesRoutes.post('/', authenticated, authorize(AuthorizationPolicy.onlyAdmin(), true), createEmployee)
employeesRoutes.get('/', authenticated, authorize(AuthorizationPolicy.onlyAdmin()), listEmployees)
employeesRoutes.get('/:id', authenticated, authorize(AuthorizationPolicy.onlyAdmin()), getEmployeeById)
employeesRoutes.delete('/:id', authenticated, authorize(AuthorizationPolicy.onlyAdmin()), deleteEmployee)

export default employeesRoutes