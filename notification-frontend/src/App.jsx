import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clients from './pages/Clients'
import Jobs from './pages/Jobs'
import DeadLetterQueue from './pages/DeadLetterQueue'
import Analytics from './pages/Analytics'
import Layout from './components/Layout'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Protected — all inside Layout (sidebar + navbar) */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard"       element={<Dashboard />} />
            <Route path="/clients"         element={<Clients />} />
            <Route path="/jobs"            element={<Jobs />} />
            <Route path="/dlq"             element={<DeadLetterQueue />} />
            <Route path="/analytics"       element={<Analytics />} />
          </Route>
        </Route>

        {/* Default redirect */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  )
}