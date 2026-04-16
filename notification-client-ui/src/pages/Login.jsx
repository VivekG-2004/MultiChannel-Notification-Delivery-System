import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useApiKey } from '../context/ApiKeyContext'
import { getMe } from '../api/authApi'
import { Bell } from 'lucide-react'
import toast from 'react-hot-toast'

const Login = () => {
  const navigate = useNavigate()
  const { login } = useApiKey()
  const [apiKey, setApiKey] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // temporarily set key so axios interceptor picks it up
    localStorage.setItem('apiKey', apiKey)

    try {
      const res = await getMe()
      const clientId = res.data.id
      login(apiKey, String(clientId))
      toast.success('Logged in successfully!')
      navigate('/send')
    } catch (err) {
      localStorage.removeItem('apiKey')
      if (err.response?.status === 403) {
        toast.error('Invalid API key')
      } else {
        toast.error('Login failed. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="bg-[#1a1d27] rounded-xl border border-white/5 w-full max-w-md p-8">

        <div className="flex items-center gap-2 mb-6">
          <Bell size={22} className="text-indigo-400" />
          <span className="text-xl font-bold text-white">NotifyClient</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">Welcome Back</h2>
        <p className="text-sm text-slate-400 mb-6">
          Enter your API key to continue
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              API Key
            </label>
            <input
              type="text"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
              placeholder="Paste your API key here"
              className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
          >
            {loading ? 'Validating...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-6">
          Don't have an API key?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login