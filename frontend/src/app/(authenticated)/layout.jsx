'use client'
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { AuthenticatedProvider } from "../contexts/AuthenticatedContext"


export default function AuthenticatedLayout({ children }) {
  const session = useSession()

  if (session.status === 'loading') return null
  if (session.status === 'unauthenticated') return redirect('/login')

  return (
    <AuthenticatedProvider
      session={session}
    >
      {children}
    </AuthenticatedProvider>
  )
}