import { createContext, useContext, useState } from 'react'

const ApiKeyContext = createContext(null)

export const ApiKeyProvider = ({ children }) => {
  const [apiKey, setApiKey] = useState(localStorage.getItem('apiKey') || null)
  const [clientId, setClientId] = useState(localStorage.getItem('clientId') || null)

  const login = (key, id) => {
    localStorage.setItem('apiKey', key)
    localStorage.setItem('clientId', id)
    setApiKey(key)
    setClientId(id)
  }

  const logout = () => {
    localStorage.removeItem('apiKey')
    localStorage.removeItem('clientId')
    setApiKey(null)
    setClientId(null)
  }

  return (
    <ApiKeyContext.Provider value={{ apiKey, clientId, login, logout }}>
      {children}
    </ApiKeyContext.Provider>
  )
}

export const useApiKey = () => useContext(ApiKeyContext)