import axios from 'axios'
import { getSession } from 'next-auth/react'

export const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(async (request) => {
  const session = await getSession()

  if (session && session.status === 'authenticated') {
    request.headers.Authorization = `Bearer ${session.data.user.apiToken}`
  }
})