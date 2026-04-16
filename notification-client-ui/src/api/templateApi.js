import axiosInstance from './axios'

export const getTemplates = () =>
  axiosInstance.get('/templates')

export const createTemplate = (data) =>
  axiosInstance.post('/templates', data)

export const deleteTemplate = (id) =>
  axiosInstance.delete(`/templates/${id}`)