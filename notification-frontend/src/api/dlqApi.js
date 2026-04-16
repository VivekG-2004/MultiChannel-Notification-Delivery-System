import api from './axios'

export function getDlqJobs() {
  return api.get('/admin/dlq')
}

export function replayDlqJob(id) {
  return api.post(`/admin/dlq/${id}/replay`)
}

export function discardDlqJob(id) {
  return api.delete(`/admin/dlq/${id}`)
}