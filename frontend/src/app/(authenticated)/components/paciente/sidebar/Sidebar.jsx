'use client'
import { api } from "@/api"
import { useUserSession } from "@/app/hooks/useUserSession"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import logo from "../../../../assets/logo.png"
import { Container } from "./styles"

const Sidebar = ({ lastChat }) => {
  const { logout } = useUserSession()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const handleSignOut = async () => {
    await logout()
  }

  const handleCreateChat = async () => {
    startTransition(async () => {
      const { data } = await api.post('/chats')

      router.push(`/chat/${data._id}`)
    })
  }

  return (
    <Container id="sidebar">
      <div className="sidebar__title">
        <div className="sidebar__img">
          <Image src={logo} alt="logo"
            width={54} height={0} objectFit="contain"
          />
          <h1>SaúdeON</h1>
        </div>
      </div>
      <div className="sidebar__menu">
        <div className="sidebar__link active_menu_link">
          <i className="fa-solid fa-house"></i>
          <a href="#">Home</a>
        </div>
        <h2>Menu</h2>
        <div className="sidebar__link">
          <i className="fa fa-user"></i>
          <a href="#">Perfil</a>
        </div>
        <div className="sidebar__link">
          <i className="fa-brands fa-rocketchat"></i>
          <button disabled={isPending} onClick={handleCreateChat} className="sidebar__button">Criar Chat</button>
        </div>
        <div className="sidebar__link">
          <i className="fa fa-archive"></i>
          <a href="#">Politica de Privacidade</a>
        </div>
        <div className="sidebar__logout">
          <i className="fa fa-power-off"></i>
          <button
            onClick={handleSignOut}
            className="logout__button" href="#">Sair</button>
        </div>
      </div>
    </Container>
  )
}

export default Sidebar
