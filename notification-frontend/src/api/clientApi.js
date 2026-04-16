import api from './axios'

export function getAllClients() {
  return api.get('/admin/clients')
}

export function blockClient(id) {
  return api.put(`/admin/clients/${id}/block`)
}

export function registerClient(name, email) {
  return api.post('/clients/register', { name, email })
}