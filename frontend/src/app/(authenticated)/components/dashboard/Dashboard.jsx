'use client'
import { api } from '@/api'
import { useUserSession } from '@/app/hooks/useUserSession'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import healthcare from '../../../assets/healthcare.png'
import Sidebar from '../sidebar/Sidebar'
import { Container } from './styles'
import { useRouter } from 'next/navigation'

//TODO: Filter opened chats so that only the ones that are not attended are shown. And create area to see accepted chats
const Dashboard = () => {
  const userSession = useUserSession()
  const router = useRouter()
  const [lastOpenedChat, setLastOpenedChat] = useState(null)
  const [openedChatsQty, setOpenedChatsQty] = useState(0)
  const [chats, setChats] = useState([])

  const handleAcceptChat = async (chatId) => {
    await api.put(`/chats/${chatId}/accept`)

    await handleEnterChat(chatId)
  }

  const handleEnterChat = async (chatId) => {
    router.push(`/chat/${chatId}`)
  }

  useEffect(() => {
    api.get('/chats')
      .then(({ data }) => {
        setChats(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  useEffect(() => {
    if (chats) {
      setOpenedChatsQty(chats.filter(chat => !chat.attendant).length)
    }
  }, [chats])

  useEffect(() => {
    const employeeChats = chats.filter(chat => chat.attendant === userSession.session.id)
    if (employeeChats.length > 0) {
      setLastOpenedChat(employeeChats[0])
    }
  }, [chats, userSession.session.id])

  return (
    <Container className="dashboard">
      <div className="dashboard__wrapper">
        <Sidebar lastChat={lastOpenedChat} /> {/* Renderizando a Sidebar aqui */}
        <div className="dashboard__container">
          <div className="dashboard__title">
            <Image src={healthcare} alt="Hello"
              width={50} height={0} objectFit="contain"
            />
            <div className="dashboard__greeting">
              <h1>Olá, atendente</h1>
              <p>Bem vindo ao seu Painel</p>
            </div>
          </div>
          <div className="dashboard__cards">
            <div className="card">
              <i className="fa fa-history fa-2x text-lightblue"></i>
              <div className="card_inner">
                <p className="text-primary-p">Total de atendimentos</p>
                <span className="font-bold text-title"> {chats.length} atendimentos</span>
              </div>
            </div>
            <div className="card">
              <i className="fa fa-users fa-2x text-green"></i>
              <div className="card_inner">
                <p className="text-primary-p">Atendimentos em aberto</p>
                <span className="font-bold text-title"> {openedChatsQty} pessoas na fila </span>
              </div>
            </div>
            <div className="card">
              <i className="fa fa-star fa-2x text-yellow"></i>
              <div className="card_inner">
                <p className="text-primary-p">Avaliações</p>
                <span className="font-bold text-title"> 4/5</span>
              </div>
            </div>
          </div>
          <div className="chat-card">
            <i className="fa fa-comments fa-2x text-purple"></i>
            <div className="chat-card_inner">
              <p className="text-primary-p">Chats para atender</p>
              <ul className="chat-list">
                {chats.filter(chat => chat.attendant === userSession.session.id || !chat.attendant).map((chat) => (
                  <li key={chat.id} className="chat-item">
                    <span className="chat-name">{chat.patient.name}</span>
                    {chat.attendant === userSession.session.id? (
                      <button
                        onClick={() => handleEnterChat(chat._id)}
                        className="accept-button">Entrar</button>
                    ) :(
                      <button
                        onClick={() => handleAcceptChat(chat._id)}
                        className="accept-button">Aceitar</button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}

export default Dashboard