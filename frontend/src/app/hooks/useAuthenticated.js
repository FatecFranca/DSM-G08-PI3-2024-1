import { useContext } from "react"
import { AuthenticatedContext } from '../contexts/AuthenticatedContext'

export const useAuthenticated = () => {
  return useContext(AuthenticatedContext)
}