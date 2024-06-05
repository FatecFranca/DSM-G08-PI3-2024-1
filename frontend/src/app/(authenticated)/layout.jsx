'use client'
import { useSession } from "next-auth/react"
import { AuthenticatedProvider } from "../contexts/AuthenticatedContext"


export default function AuthenticatedLayout({ children }) {
  const session = useSession()

  if (session.status === 'loading') return null
  // if (session.status === 'unauthenticated') {
  //   return redirect('/login')
  // }

  return (
    <AuthenticatedProvider
      session={{
        "data": {
          "user": {
            "id": "665f0b68e963c01b414d898e",
            "name": "João",
            "email": "joao.silva@example.com",
            "apiToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2NWYwYjY4ZTk2M2MwMWI0MTRkODk4ZSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzE3NjAwMDc5LCJleHAiOjE3MTc2ODY0Nzl9.2h7Nyj2oZbqiIDmtPmnN8QwEd_7_G8-UtsT09QVxnPI",
            "role": "user"
          },
          "expires": "2024-07-04T22:37:24.736Z"
        },
        "status": "authenticated"
      }}
    >
      {children}
    </AuthenticatedProvider>
  )
}