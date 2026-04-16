import { Navigate } from 'react-router-dom'
import { useApiKey } from '../context/ApiKeyContext'

const ProtectedRoute = ({ children }) => {
  const { apiKey } = useApiKey()

  if (!apiKey) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute