import axiosInstance from './axios'

export const registerClient = (data) =>
  axiosInstance.post('/clients/register', data)

export const getMe = () =>
  axiosInstance.get('/clients/me')