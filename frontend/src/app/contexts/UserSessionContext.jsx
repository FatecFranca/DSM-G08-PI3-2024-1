'use client'

import { api } from "@/api"
import { createContext } from "react"

export const userSessionContext = createContext()

//TODO: Add response validation maybe using zod
export const UserSessionProvider = ({ children }) => {
  const [session, setSession] = useState(async () => {
    const jwtSession = window.localStorage.getItem('jwt')
    if (!jwtSession) return null

    const tokenSession = await api.get('/auth/verify-token')
    return tokenSession
  })

  const login = async (email, password) => {
    const session = await api.post('/auth/login', { email, password })
    window.localStorage.setItem('jwt', session.token)

    setSession({
      id: session.data.user._id,
      name: session.data.user.name,
      role: session.data.role || 'user',
    })
  }

  const loginAsEmployee = async (email, password) => {
    const session = await api.post('/auth/login-employee', { email, password })
    window.localStorage.setItem('jwt', session.token)

    setSession({
      id: session.data.employee.employeeId,
      role: session.data.employee.role || 'employee',
      name: session.data.employee.user.name,
    })
  }

  const logout = async () => {
    window.localStorage.removeItem('jwt')
    setSession(null)
  }

  return (
    <userSessionContext.Provider value={{ session, login, loginAsEmployee, logout }}>
      {children}
    </userSessionContext.Provider>
  )
}