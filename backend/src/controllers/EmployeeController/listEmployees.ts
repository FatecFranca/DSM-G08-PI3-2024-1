import { Request, Response } from 'express'
import { employeeModel } from '../../models/EmployeeModel'

export const listEmployees = async (req: Request, res: Response) => {
  const employeesQuery = employeeModel.find()
  const employees = await employeesQuery.populate('user')
  return res.json(employees)
}