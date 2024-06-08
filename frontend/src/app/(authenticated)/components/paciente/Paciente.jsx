'use client'
import { api } from '@/api'
import { useUserSession } from '@/app/hooks/useUserSession'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import healthcare from '../../../assets/healthcare.png'
import Sidebar from './sidebar/Sidebar'
import { Container } from './styles'

const Dashboard = () => {
  const userSession = useUserSession()
  const [chats, setChats] = useState([])

  useEffect(() => {
    api.get(`/chats/patient/${userSession.session.id}`)
      .then(({ data }) => {
        console.log('userId', userSession.session.id)
        console.log(data)
        setChats(data)
      })
  }, [userSession.session.id])

  return (
    <Container className="dashboard">
      <div className="dashboard__wrapper">
        <Sidebar /> {/* Renderizando a Sidebar aqui */}
        <div className="dashboard__container">
          <div className="dashboard__title"
            width={50} height={0} objectFit="contain"
          >
            <Image src={healthcare} alt="Hello" />
            <div className="dashboard__greeting">
              <h1>Olá, paciente</h1>
              <p>Bem vindo ao SaudeON</p>
            </div>
          </div>
          <div className="dashboard__card">
            <div className="card">
              <i className="fa fa-history fa-2x text-lightblue"></i>
              <div className="card_inner">
                <p className="text-primary-p">Atendimentos anteriores</p>
                <span className="font-bold text-title"> {chats.length} atendimentos</span>
              </div>
            </div>
          </div>
          <div className="chat-card">
            <i className="fa fa-comments fa-2x text-purple"></i>
            <div className="chat-card_inner">
              <p className="text-primary-p">Chats anteriores</p>
              <ul className="chat-list">
                {chats.map((chat) => (
                  <li key={chat._id} className="chat-item">
                    <span className="chat-name">Chat {chat._id.slice(0, 3)} ({new Date(chat.createdAt).toLocaleDateString('pt-BR')})</span>
                    <span className="chat-date">Iniciado em {new Date(chat.createdAt).toLocaleDateString('pt-BR')}</span>
                    <Link href={`/chat/${chat._id}`} className="view-button">Visualizar</Link>
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
