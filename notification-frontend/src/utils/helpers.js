export function formatDate(dateString) {
  if (!dateString) return '—'
  return new Date(dateString).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getStatusColor(status) {
  switch (status?.toUpperCase()) {
    case 'COMPLETED': return 'bg-green-100 text-green-700'
    case 'PENDING':   return 'bg-blue-100 text-blue-700'
    case 'RETRYING':  return 'bg-yellow-100 text-yellow-700'
    case 'FAILED':    return 'bg-red-100 text-red-700'
    default:          return 'bg-gray-100 text-gray-600'
  }
}

export function getChannelColor(channel) {
  switch (channel?.toUpperCase()) {
    case 'EMAIL':   return 'bg-purple-100 text-purple-700'
    case 'SMS':     return 'bg-orange-100 text-orange-700'
    case 'IN_APP':  return 'bg-teal-100 text-teal-700'
    case 'WEBHOOK': return 'bg-pink-100 text-pink-700'
    default:        return 'bg-gray-100 text-gray-600'
  }
}