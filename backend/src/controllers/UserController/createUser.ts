import bcrypt from 'bcrypt'
import { Request, Response } from 'express'
import { HydratedDocument } from 'mongoose'
import { Address, addressModel } from '../../models/AddressModel'
import { userModel, zodUserSchema } from '../../models/UserModel'


export const createUser = async (req: Request, res: Response) => {
  const userData = zodUserSchema.parse(req.body)
  const existUserWithEmail = await userModel.findOne({
    email: userData.email
  })
  if (existUserWithEmail) {
    return res.status(400).json({
      error: 'Already exists a user with this email'
    })
  }
  const existUserWithCpf = await userModel.findOne({
    cpf: userData.cpf
  })
  if (existUserWithCpf) {
    return res.status(400).json({
      error: 'Already exists a user with this cpf'
    })
  }

  const { address: addressData, ...userModelData } = userData

  try {

    let address: HydratedDocument<Address>
    const existingAddress = await addressModel.findOne({
      cep: addressData.cep,
      num: addressData.num,
    })
    if (existingAddress) {
      address = existingAddress
    } else {
      address = new addressModel(addressData)
      address.save()
    }
    const hashedPassword = bcrypt.hashSync(userModelData.password, 10)
    const user = new userModel({
      ...userModelData,
      password: hashedPassword,
      address: address._id,
    })
    await user.save()

    const createdUser = await userModel.findById(user._id).populate('address')

    return res.status(201).json(createdUser)
  } catch (error) {
    console.error(error)
    return res.status(400).json({
      error: 'Error to create a user'
    })
  }
}