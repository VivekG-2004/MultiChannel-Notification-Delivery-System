import axiosInstance from './axios'

export const getInbox = (userRef, clientId) =>
  axiosInstance.get(`/inbox/${userRef}`, {
    params: { clientId },
  })

export const markAsRead = (id) =>
  axiosInstance.put(`/inbox/${id}/read`)