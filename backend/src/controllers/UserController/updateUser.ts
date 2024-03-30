import { Request, Response } from 'express'
import mongoose, { HydratedDocument } from 'mongoose'
import { Address, addressModel } from '../../models/AddressModel'
import { userModel, zodUserSchema } from '../../models/UserMode'

export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params
  const userData = zodUserSchema.omit({
    _id: true,
    password: true,
    email: true,
  }).partial().parse(req.body)

  const savedUser = await userModel.findById(id)
  const savedAddress = await addressModel.findById(savedUser?.address)
  if (!savedUser) {
    return res.status(404).json({
      error: 'User not found'
    })
  }
  if (userData.cpf && (savedUser.cpf !== userData.cpf)) {
    const existUserWithCpf = await userModel.findOne({
      cpf: userData.cpf
    })
    if (existUserWithCpf) {
      return res.status(400).json({
        error: 'Already exists a user with this cpf'
      })
    }
  }

  const { address: addressData, ...userModelData } = userData

  if (!savedUser) {
    return res.status(404).json({
      error: 'User not found'
    })
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  let address: HydratedDocument<Address>|undefined
  if (addressData && (savedAddress?.cep !== addressData.cep || savedAddress?.num !== addressData.num)) {
    address = await addressModel.findOneAndUpdate({
      cep: addressData.cep,
      num: addressData.num,
    }, addressData, {
      new: true, upsert: true
    })
  } else if (addressData) {
    address = await addressModel.findByIdAndUpdate({
      _id: savedUser.address
    }, addressData, {
      new: true, upsert: true
    })
  }

  await userModel.updateOne({
    _id: id
  }, {
    ...userModelData,
    address: address?._id || savedUser.address
  })
  const updatedUser = await userModel.findById(id)
    .populate('address')

  return res.status(200).json(updatedUser)
}