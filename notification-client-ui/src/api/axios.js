import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: '/api',
})

axiosInstance.interceptors.request.use((config) => {
  const apiKey = localStorage.getItem('apiKey')
  if (apiKey) {
    config.headers['X-API-KEY'] = apiKey
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      localStorage.removeItem('apiKey')
      localStorage.removeItem('clientId')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default axiosInstance