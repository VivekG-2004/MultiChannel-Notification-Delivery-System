import axiosInstance from './axios'

export const sendNotification = (data) =>
  axiosInstance.post('/notify', data)

export const scheduleNotification = (data) =>
  axiosInstance.post('/notify/schedule', data)

export const getHistory = () =>
  axiosInstance.get('/notify/history')

export const getJobStatus = (id) =>
  axiosInstance.get(`/notify/${id}/status`)