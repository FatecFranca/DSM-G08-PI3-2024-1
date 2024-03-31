import { NextFunction, Request, Response } from 'express'
import { employeeModel } from '../models/EmployeeModel'
import { AuthorizationPolicy } from '../types/AuthorizationPolicy'
import { RoleEnum } from '../types/RoleEnum'

export const authorize = (authorizationPolicy: AuthorizationPolicy, authorizeIfHaveNoAdmin: boolean = false) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.payload) {
      return res.status(500).json({ message: 'User role not found' })
    }
    
    if (authorizeIfHaveNoAdmin) {
      const existAdmin = await employeeModel.findOne({ role: RoleEnum.ADMIN })
      if (!existAdmin) {
        return next()
      }
    }
    
    const role = req.payload.role
    if (!authorizationPolicy.rolesPermited.includes(role)) {
      return res.status(403).json({ message: 'User is not authorized' })
    }
    return next()
  }

}