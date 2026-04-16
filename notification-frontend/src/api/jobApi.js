import api from './axios'

export function getAllJobs() {
  return api.get('/admin/jobs')
}