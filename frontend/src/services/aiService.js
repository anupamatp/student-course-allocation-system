import api from './api'

export const sendAIMessage = (message) =>
  api.post('/ai/chat', { message })