import { Request, Response } from 'express'
import { employeeModel } from '../../models/EmployeeModel'


export const getEmployeeById = async (req: Request, res: Response) => {
  const { id } = req.params
  const employeeQuery = employeeModel.findOne({ _id: id })
  const employee = await employeeQuery.populate('user')

  if (!employee) {
    return res.status(404).json({ message: 'Employee not found' })
  }

  return res.json(employee)
}