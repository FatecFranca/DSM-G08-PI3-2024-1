'use client'
import { redirect } from "next/navigation"
import { createContext } from "react"


export const AuthenticatedContext = createContext()

export const AuthenticatedProvider = ({ children, session }) => {

  if (!session || !session.data) {
    throw new Error('AuthenticatedProvider requires a session object')
  }
  console.log(session)
  
  const userSession = {
    apiToken: session.data.user.apiToken,
    id: session.data.user.id,
    name: session.data.user.name,
    email: session.data.user.email,
    role: session.data.role
  }
  console.log(userSession)

  // if (!userSession.apiToken && !userSession.id) {
  //   throw new Error('AuthenticatedProvider requires a valid session object')
  // }

  return (
    <AuthenticatedContext.Provider value={userSession}>
      {children}
    </AuthenticatedContext.Provider>
  )
}