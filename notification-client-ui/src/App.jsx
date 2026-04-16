import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ApiKeyProvider } from './context/ApiKeyContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Register from './pages/Register'
import Login from './pages/Login'
import Send from './pages/Send'
import Templates from './pages/Templates'
import History from './pages/History'
import Inbox from './pages/Inbox'
import Analytics from './pages/Analytics'

const App = () => {
  return (
    <ApiKeyProvider>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/send" replace />} />
            <Route path="send" element={<Send />} />
            <Route path="templates" element={<Templates />} />
            <Route path="history" element={<History />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
    </ApiKeyProvider>
  )
}

export default App