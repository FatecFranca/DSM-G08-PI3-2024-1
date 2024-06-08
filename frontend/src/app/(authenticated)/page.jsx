'use client'
import { useUserSession } from "../hooks/useUserSession"
import Dashboard from "./components/dashboard/Dashboard"
import Paciente from "./components/paciente/Paciente"
import { Container } from "./styles"

export default function Home() {
  const { session: { role } } = useUserSession()
  return (
    <Container>
      {role == 'user' ? (<Paciente />) : (<Dashboard />)}
    </Container>
  )
}
