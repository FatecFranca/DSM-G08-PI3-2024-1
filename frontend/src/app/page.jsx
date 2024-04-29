'use client'
import { LinkButton } from "@/components/LinkButton"
import { Container } from "./styles"
import { Button } from "@/components/Button"
import { useRouter } from "next/navigation"

export default function Home() {
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
