import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: { 'Content-Type': 'application/json' },
})

export const sendAIMessage = (message) => api.post('/ai/chat', { message })