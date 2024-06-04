'use client'
import { useEffect, useState } from "react"
import io from 'socket.io-client'
import styles from './chat.module.css'
import { ChatContainer, Container, FormField, MessageInputForm, MessageItem, ReceivedMessageItem } from "./styles"

const myId = "testemsg"

const socket = io('http://localhost:8080/')
socket.on('connect', () => console.log('[IO] Connect => A new connection has been established'))

const Chat = () => {
  const [message, updateMessage] = useState("")
  const [messages, updateMessages] = useState([])

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      updateMessages([...messages, newMessage])
    }

    socket.on('chat.message', handleNewMessage)

    return () => {
      socket.off('chat.message', handleNewMessage)
    }
  }, [messages, socket])

  const handleFormSubmit = (event) => {
    event.preventDefault()
    if (message.trim()) {
      socket.emit('chat.message', {
        id: myId,
        message
      })
      updateMessage('')
    }
  }

  const handleInputChange = (event) => updateMessage(event.target.value)

  return (
    <Container>
      <ChatContainer>
        {messages.map((m, index) => (
          m.id === myId ? (
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
          type="text" formAction=""
          value={message}
        />
      </MessageInputForm>
    </Container>
  )
}

export default Chat