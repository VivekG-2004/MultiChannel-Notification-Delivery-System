import api from './axios'

export function loginAdmin(username, password) {
  return api.post('/auth/login', { username, password })
}