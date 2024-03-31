import { Request, Response } from 'express'
import { employeeModel } from '../../models/EmployeeModel'

export const deleteEmployee = async (req: Request, res: Response) => {
  const { id } = req.params
  await employeeModel.findByIdAndDelete(id)
  res.status(200).json({ message: 'User deleted successfully' })
}