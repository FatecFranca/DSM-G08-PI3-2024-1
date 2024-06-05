'use client'
import { api } from "@/api"
import { useAuthenticated } from "@/app/hooks/useAuthenticated"
import { useEffect, useState } from "react"
import io from 'socket.io-client'
import { ChatContainer, Container, FormField, MessageInputForm, MessageItem, ReceivedMessageItem } from "./styles"

const myId = "testemsg"

const socket = io('http://localhost:8080')
socket.on('connect', () => console.log('[IO] Connect => A new connection has been established'))

const Chat = ({ params: { chatId } }) => {

  const { apiToken, role } = useAuthenticated()
  const [chat, setChat] = useState(null)

  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    api.get(`/chats/${chatId}`, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    })
      .then(({ data }) => {
        setChat(data)
        setMessages(data.messages)
      }).catch(console.log)
  }, [chatId, apiToken])

  useEffect(() => {
    socket.emit('chat.enter', { token: `Bearer ${apiToken}`, chatId }, (response) => {
      socket.on(`chat.message.created`, (data) => {
        if (chatId === data.chatId) {
          setMessages((prevMessages) => {
            if (prevMessages.find(m => m._id === data.message._id)) {
              return prevMessages
            }

            return [...prevMessages, data.message]
          })
        }
      })
    })
  }, [apiToken, chatId])

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    await api.post(`/chats/${chatId}/messages`, {
      message: messageInput
    }, {
      headers: {
        Authorization: `Bearer ${apiToken}`
      }
    })

    setMessageInput("")
  }

  const handleInputChange = (event) => setMessageInput(event.target.value)

  if (!chat) return <div>Loading...</div>
  const chatUserId = ['user', undefined].includes(role) ? chat.patient : chat.attendant
  return (
    <Container>
      <ChatContainer>
        {messages.map((m, index) => (
          chatUserId === m.user ? (
            <MessageItem key={index}>
              <span>
                {m.message}
              </span>
            </MessageItem>
          ) : (
            <ReceivedMessageItem key={index}>
              <span>{m.message}</span>
            </ReceivedMessageItem>
          )
        ))}
      </ChatContainer>
      <MessageInputForm onSubmit={handleFormSubmit}>
        <FormField
          onChange={handleInputChange}
          placeholder="Digite sua mensagem aqui"
          type="text"
          value={messageInput}
        />
      </MessageInputForm>
    </Container>
  )
}

export default Chat

/* Chat response reference
{
    "_id": "665f1c2e905dc6ecba5b8211",
    "patient": "665f0b68e963c01b414d898e",
    "messages": [
        {
            "user": "665f0b68e963c01b414d898e",
            "message": "Bom dia, preciso de ajuda para marcar um exame. E conferir oque preciso na hora da consulta",
            "sentWhen": "2024-06-04T14:21:01.028Z",
            "_id": "665f22cd63e7940fcf2bfc4f"
        },
        {
            "user": "665f19d7db7b354113a11243",
            "message": "Bom dia, com qual medico ou tipo de especialista precisa ser atendida?",
            "sentWhen": "2024-06-04T14:22:53.828Z",
            "_id": "665f233d63e7940fcf2bfc54"
        }
    ],
    "createdAt": "2024-06-04T13:52:46.982Z",
    "__v": 2,
    "attendant": "665f19d7db7b354113a11243"
}

*/