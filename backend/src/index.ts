import mongoose from 'mongoose'
import './configs/websockets'
import { env } from './configs/env'

import app from './configs/server'
import { employeeModel } from './models/EmployeeModel'
import { RoleEnum } from './types/RoleEnum'
import { userModel } from './models/UserModel'
import { hashSync } from 'bcrypt'

console.log(env)
mongoose.connect(env.DATABASE_URL)
  .then(async () => {
    const hasAdmin = await employeeModel.findOne({
      role: RoleEnum.ADMIN
    })

    if (!hasAdmin) {
      const adminUser = await userModel.create({
        cpf: 'undefined',
        data_nascimento: new Date(),
        email: env.ADMIN_EMAIL,
        password: hashSync(env.ADMIN_PASSWORD, 10),
        gender: 'undefined',
        lastName: 'ADMIN',
        name: 'Admin',
        address: {
          cep: 'undefined',
          street: 'undefined',
          num: 0,
          city: 'undefined',
          uf: 'undefined'
        }
      })

      await employeeModel.create({
        role: RoleEnum.ADMIN,
        user: adminUser._id
      })
    }


    app.listen(env.PORT, () => console.log(`Server runing at: http://localhost:${env.PORT}`))
  })
  .catch(err => {
    console.log(err)
  })

export default app