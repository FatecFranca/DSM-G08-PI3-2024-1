'use client'
import { api } from "@/api"
import { useAuthenticated } from "@/app/hooks/useAuthenticated"
import { Suspense, useEffect, useState } from "react"
import io from 'socket.io-client'
import { ChatContainer, Container, FormField, MessageInputForm, MessageItem, ReceivedMessageItem } from "./styles"

const myId = "testemsg"

function waitAcknowledge(socket, event) {
  return new Promise((resolve) => {
    socket.on(event, (data) => {
      resolve(data)
    })
  }) 
}
const Chat = ({ chatId }) => {
  const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080')

  useEffect(() => {
    waitAcknowledge(socket, 'connect')
      .then(data => console.log('connected', data))
  }, [])

  const { role, token } = useAuthenticated()
  const [chat, setChat] = useState(null)

  const [messageInput, setMessageInput] = useState("")
  const [messages, setMessages] = useState([])

  useEffect(() => {
    api.get(`/chats/${chatId}`)
      .then(({ data }) => {
        setChat(data)
        setMessages(data.messages)
      }).catch(console.log)
  }, [chatId])

  useEffect(() => {
    socket.emit('chat.enter', { token: `Bearer ${token}`, chatId }, (response) => {
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
  }, [token, chatId])

  const handleFormSubmit = async (event) => {
    event.preventDefault()
    await api.post(`/chats/${chatId}/messages`, {
      message: messageInput
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

const ChatPage = ({ params: { chatId } }) => {

  return <Suspense fallback={<div>Loading...</div>}>
    <Chat chatId={chatId} />
  </Suspense>
}

export default ChatPage