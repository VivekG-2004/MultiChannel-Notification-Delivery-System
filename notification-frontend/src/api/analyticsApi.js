import api from './axios'

export function getAnalyticsSummary() {
  return api.get('/analytics/summary')
}

export function getChannelBreakdown() {
  return api.get('/analytics/channels')
}

export function getDlqSize() {
  return api.get('/analytics/dlq-size')
}