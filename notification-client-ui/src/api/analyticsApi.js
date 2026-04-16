import axiosInstance from './axios'

export const getAnalyticsSummary = () =>
  axiosInstance.get('/analytics/summary')

export const getChannelBreakdown = () =>
  axiosInstance.get('/analytics/channels')

export const getDlqSize = () =>
  axiosInstance.get('/analytics/dlq-size')