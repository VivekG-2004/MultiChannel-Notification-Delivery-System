import { useEffect, useState } from 'react'
import { getAllClients, blockClient, registerClient } from '../api/clientApi'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { UserX, UserPlus, Copy, Check, X } from 'lucide-react'

export default function Clients() {
  const [clients, setClients]       = useState([])
  const [loading, setLoading]       = useState(true)
  const [blockingId, setBlockingId] = useState(null)

  // Modal state
  const [showModal, setShowModal]   = useState(false)
  const [name, setName]             = useState('')
  const [email, setEmail]           = useState('')
  const [registering, setRegistering] = useState(false)

  // Success state — shows API key after registration
  const [newClient, setNewClient]   = useState(null)
  const [copied, setCopied]         = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  async function fetchClients() {
    try {
      const res = await getAllClients()
      setClients(res.data)
    } catch (err) {
      toast.error('Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  async function handleBlock(id, name) {
    const confirmed = window.confirm(`Are you sure you want to block "${name}"?`)
    if (!confirmed) return
    try {
      setBlockingId(id)
      await blockClient(id)
      toast.success(`Client "${name}" blocked successfully`)
      fetchClients()
    } catch (err) {
      toast.error('Failed to block client')
    } finally {
      setBlockingId(null)
    }
  }

  async function handleRegister() {
    if (!name.trim() || !email.trim()) {
      toast.error('Name and email are required')
      return
    }
    try {
      setRegistering(true)
      const res = await registerClient(name.trim(), email.trim())
      setNewClient(res.data)   // { apiKey, clientId, plan, message }
      toast.success('Client registered successfully')
      fetchClients()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setRegistering(false)
    }
  }

  function handleCopy(key) {
    navigator.clipboard.writeText(key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleCloseModal() {
    setShowModal(false)
    setName('')
    setEmail('')
    setNewClient(null)
    setCopied(false)
  }

  if (loading) return <LoadingSpinner />

  return (
    <div>

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Clients</h2>
          <p className="text-sm text-gray-500 mt-1">
            All registered clients — {clients.length} total
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700
                     text-white text-sm font-semibold px-4 py-2.5 rounded-lg
                     transition-colors cursor-pointer"
        >
          <UserPlus size={16} />
          Register Client
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            Registered Clients
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Plan</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {clients.map(client => (
                <tr key={client.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400">#{client.id}</td>
                  <td className="px-6 py-4 font-medium text-gray-800">
                    {client.name}
                  </td>
                  <td className="px-6 py-4 text-gray-500">{client.email}</td>
                  <td className="px-6 py-4">
                    <span className="bg-blue-50 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                      {client.plan}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {client.active ? (
                      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
                        BLOCKED
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {client.active ? (
                      <button
                        onClick={() => handleBlock(client.id, client.name)}
                        disabled={blockingId === client.id}
                        className="flex items-center gap-1.5 text-xs bg-red-50
                                   text-red-600 hover:bg-red-100 px-3 py-1.5
                                   rounded-lg font-medium transition-colors
                                   disabled:opacity-50 cursor-pointer"
                      >
                        <UserX size={14} />
                        {blockingId === client.id ? 'Blocking...' : 'Block'}
                      </button>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Blocked</span>
                    )}
                  </td>
                </tr>
              ))}
              {clients.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No clients registered yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">

            {/* Modal Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800">
                Register New Client
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Step 1 — Form */}
            {!newClient && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company / Client Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. ShopEasy Pvt Ltd"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="e.g. dev@shopeasy.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                               text-sm focus:outline-none focus:ring-2
                               focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-600
                               rounded-lg text-sm font-medium hover:bg-gray-50
                               transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700
                               text-white rounded-lg text-sm font-semibold
                               transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {registering ? 'Registering...' : 'Register'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 2 — Show API Key after success */}
            {newClient && (
              <div className="space-y-4">

                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-700 font-semibold text-sm">
                    ✅ Client registered successfully
                  </p>
                  <p className="text-green-600 text-xs mt-1">
                    Share the API key below with the client
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Client ID
                  </label>
                  <p className="text-gray-800 font-mono text-sm bg-gray-50
                                px-4 py-2.5 rounded-lg border border-gray-200">
                    #{newClient.clientId}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Plan
                  </label>
                  <p className="text-gray-800 text-sm bg-gray-50 px-4 py-2.5
                                rounded-lg border border-gray-200">
                    {newClient.plan}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    API Key — copy and share this
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="flex-1 font-mono text-xs bg-gray-900 text-green-400
                                  px-4 py-3 rounded-lg border border-gray-700
                                  break-all select-all">
                      {newClient.apiKey}
                    </p>
                    <button
                      onClick={() => handleCopy(newClient.apiKey)}
                      className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-lg
                                 transition-colors cursor-pointer flex-shrink-0"
                    >
                      {copied
                        ? <Check size={16} className="text-green-600" />
                        : <Copy size={16} className="text-gray-600" />
                      }
                    </button>
                  </div>
                  <p className="text-xs text-red-500 mt-1.5">
                    ⚠️ Save this key now. It will not be shown again.
                  </p>
                </div>

                <button
                  onClick={handleCloseModal}
                  className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700
                             text-white rounded-lg text-sm font-semibold
                             transition-colors cursor-pointer"
                >
                  Done
                </button>

              </div>
            )}

          </div>
        </div>
      )}

    </div>
  )
}