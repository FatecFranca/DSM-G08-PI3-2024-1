import { useRouter } from "next/navigation"

export default function ChatPage({ params }) {
  const chatId = params.chatId
  
  return (
    <div>
      Chat: {chatId}
    </div>
  )
}