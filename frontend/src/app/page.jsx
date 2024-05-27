'use client'
import { Button } from "@/components/Button"
import { LinkButton } from "@/components/LinkButton"
import { useSession } from "next-auth/react"
import { redirect, useRouter } from "next/navigation"
import { Container } from "./styles"

export default function Home() {
  const session = useSession()
  if (!session || !session.user) {
    return redirect("/login")
  }

  const router = useRouter()
  const handleNewChatClick = () => {
    //implement logic to comunicate to backend to create a new chat and receive its id
    const idReceivedFromBackend = "123"
    router.push(`/chats/${idReceivedFromBackend}`)
  }

  return (
    <Container>
      <LinkButton href="/login">Sign in</LinkButton>
      <LinkButton href={"/signup"} >Sign up</LinkButton>
      <Button onClick={handleNewChatClick}>Novo chat</Button>
    </Container>
  )
}
