import { useContext } from "react"
import { userSessionContext } from "../contexts/UserSessionContext"

export const useUserSession = () => {
  return useContext(userSessionContext)
}

