'use client'
import { SessionProvider } from 'next-auth/react'
import { GlobalStyles } from './GlobalStyles'

export const Providers = ({ children }) => {
  return (
    <SessionProvider>
      <GlobalStyles />
        {children}
    </SessionProvider>
  )
}