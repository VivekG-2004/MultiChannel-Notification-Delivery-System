import { useApiKey } from '../context/ApiKeyContext'
import { useNavigate } from 'react-router-dom'
import { LogOut } from 'lucide-react'

const Navbar = () => {
  const { clientId, logout } = useApiKey()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="h-16 bg-[#1a1d27] border-b border-white/5 flex items-center justify-between px-6">
      <p className="text-sm text-slate-400">
        Client ID:{' '}
        <span className="font-semibold text-white">{clientId ?? '—'}</span>
      </p>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
      >
        <LogOut size={16} />
        Logout
      </button>
    </div>
  )
}

export default Navbar