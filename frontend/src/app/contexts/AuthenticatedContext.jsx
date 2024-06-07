'use client'
import { createContext } from "react"


export const AuthenticatedContext = createContext()

export const AuthenticatedProvider = ({ children, session }) => {

  const userSession = {
    id: session.id,
    name: session.name,
    role: session.role || 'user',
    token: session.token
  }

  // if (!userSession.apiToken && !userSession.id) {
  //   throw new Error('AuthenticatedProvider requires a valid session object')
  // }

  return (
    <AuthenticatedContext.Provider value={userSession}>
      {children}
    </AuthenticatedContext.Provider>
  )
}