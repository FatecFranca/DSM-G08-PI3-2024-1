'use client'
import { redirect } from "next/navigation"
import { AuthenticatedProvider } from "../contexts/AuthenticatedContext"
import { useUserSession } from "../hooks/useUserSession"


export default function AuthenticatedLayout({ children }) {
  const { session, loading } = useUserSession()

  if (loading) {
    return null
  }

  if (!session) {
    return redirect('/login')
  }

  return (
    <AuthenticatedProvider
      session={session}
    >
      {children}
    </AuthenticatedProvider>
  )
}