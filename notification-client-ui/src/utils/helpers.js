export const formatDate = (dateString) => {
  if (!dateString) return '—'
  const date = new Date(dateString)
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getStatusColor = (status) => {
  switch (status) {
    case 'DELIVERED':
    case 'COMPLETED':
      return 'bg-green-100 text-green-700'
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-700'
    case 'RETRYING':
      return 'bg-orange-100 text-orange-700'
    case 'FAILED':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export const getChannelColor = (channel) => {
  switch (channel) {
    case 'EMAIL':
      return 'bg-blue-100 text-blue-700'
    case 'SMS':
      return 'bg-purple-100 text-purple-700'
    case 'IN_APP':
      return 'bg-green-100 text-green-700'
    case 'WEBHOOK':
      return 'bg-orange-100 text-orange-700'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}