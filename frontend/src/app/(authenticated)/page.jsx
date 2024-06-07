'use client'
import Dashboard from "./components/dashboard/Dashboard"
import Sidebar from "./components/sidebar/Sidebar"
import { Container } from "./styles"

export default function Home() {

  return (
    <Container>
      <Sidebar />
      <Dashboard />
    </Container>
  )
}
