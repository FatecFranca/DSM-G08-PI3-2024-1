import { Request, Response } from 'express'
import { employeeModel } from '../../models/EmployeeModel'
import { NotFoundError } from '../../errors/NotFoundError'


export const getEmployeeById = async (req: Request, res: Response) => {
  const { id } = req.params
  const employeeQuery = employeeModel.findOne({ _id: id })
  const employee = await employeeQuery.populate('user')

  if (!employee) {
    throw new NotFoundError('Employee not found', { id })
  }

  return res.json(employee)
}