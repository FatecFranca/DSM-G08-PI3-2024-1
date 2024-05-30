'use client'
import { Button } from "@/components/Button"
import { LinkButton } from "@/components/LinkButton"
import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { Container } from "../styles"

export default function Home() {

  return (
    <Container>
      Pagina inicial
    </Container>
  )
}
