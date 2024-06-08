'use client'

import { api } from "@/api"
import { createContext, useEffect, useState } from "react"

const defaultUserSession = {
  session: {
    id: null,
    name: null,
    role: null,
    token: null
  },
  login: async (email, password) => { },
  loginAsEmployee: async (email, password) => { },
  logout: async () => { },
  loading: true,
}

export const userSessionContext = createContext(defaultUserSession)

//TODO: Add response validation maybe using zod
export const UserSessionProvider = ({ children }) => {
  const tokenKey = 'apiKey'
  const [token, setToken] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem(tokenKey)
    if (!token) {
      setLoading(false)
      return
    }

    setToken(token)
  }, [])

  useEffect(() => {
    if (!token) {
      setSession(null)
      return
    }
    api.get('/auth/verify-token', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(({ data }) => {
        setSession({
          id: data.id,
          name: data.name,
          role: data.role || 'user',
          token: token
        })
        setLoading(false)
      }).catch((e) => {
        console.error(e)
        localStorage.removeItem(tokenKey)
        setSession(null)
        setLoading(false)
      })
  }, [token])

  useEffect(() => {
    if (!token) {
      api.defaults.headers.Authorization = null
      return
    }
    localStorage.setItem(tokenKey, token)
    api.defaults.headers.Authorization = `Bearer ${token}`
  }, [token])


  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    setToken(data.token)
  }

  const loginAsEmployee = async (email, password) => {
    const { data } = await api.post('/auth/login-employee', { email, password })
    setToken(data.token)
  }

  const logout = async () => {
    window.localStorage.removeItem(tokenKey)
    setToken(null)
  }

  return (
    <userSessionContext.Provider value={{ session, login, loginAsEmployee, logout, loading }}>
      {children}
    </userSessionContext.Provider>
  )
}