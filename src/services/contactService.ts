import type { ContactMessage } from '../types/contact'
import { api } from './api'

/** POST /contact — envia a mensagem do formulário de contato */
export function sendContactMessage(message: ContactMessage): Promise<void> {
  return api.post<void>('/contact', message)
}
