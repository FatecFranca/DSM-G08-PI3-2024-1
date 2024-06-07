'use client'
import { GlobalStyles } from './GlobalStyles'
import { UserSessionProvider } from './contexts/UserSessionContext'

export const Providers = ({ children }) => {
  return (
    <UserSessionProvider>
      <GlobalStyles />
      {children}
    </UserSessionProvider>
  )
}