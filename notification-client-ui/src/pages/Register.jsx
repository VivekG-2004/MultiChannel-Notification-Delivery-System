import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerClient } from '../api/authApi'
import { Bell, Copy, Check } from 'lucide-react'
import toast from 'react-hot-toast'

const Register = () => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '' })
  const [loading, setLoading] = useState(false)
  const [apiKey, setApiKey] = useState(null)
  const [clientId, setClientId] = useState(null)
  const [copied, setCopied] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await registerClient(form)
      setApiKey(res.data.apiKey)
      setClientId(res.data.id)
      toast.success('Client registered successfully!')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    toast.success('API key copied!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0f1117] flex items-center justify-center px-4">
      <div className="bg-[#1a1d27] rounded-xl border border-white/5 w-full max-w-md p-8">

        <div className="flex items-center gap-2 mb-6">
          <Bell size={22} className="text-indigo-400" />
          <span className="text-xl font-bold text-white">NotifyClient</span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-1">Create Account</h2>
        <p className="text-sm text-slate-400 mb-6">Register to get your API key</p>

        {!apiKey ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Company Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Acme Corp"
                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="admin@acme.com"
                className="w-full bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm transition disabled:opacity-60"
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <p className="text-sm font-medium text-green-400 mb-1">
                Registration Successful!
              </p>
              <p className="text-xs text-green-500/80">
                Your Client ID is <span className="font-bold">{clientId}</span>
              </p>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-300 mb-2">
                Your API Key — save this now, it won't be shown again
              </p>
              <div className="flex items-center gap-2 bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5">
                <span className="text-xs font-mono text-indigo-300 break-all flex-1">
                  {apiKey}
                </span>
                <button
                  onClick={handleCopy}
                  className="text-indigo-400 hover:text-indigo-200 transition shrink-0"
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate('/login')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg text-sm transition"
            >
              Go to Login
            </button>
          </div>
        )}

        {!apiKey && (
          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an API key?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">
              Login
            </Link>
          </p>
        )}
      </div>
    </div>
  )
}

export default Register