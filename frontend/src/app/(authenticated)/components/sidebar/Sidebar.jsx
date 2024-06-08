'use client'
import { useUserSession } from "@/app/hooks/useUserSession"
import Image from "next/image"
import Link from "next/link"
import logo from "../../../assets/logo.png"
import { Container } from "./styles"

const Sidebar = ({ lastChat }) => {
  const { logout } = useUserSession()
  const handleSignOut = async () => {
    await logout()
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
          <Link href={lastChat ? `/chat/${lastChat._id}` : '#'}>Entrar no Chat</Link>
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
