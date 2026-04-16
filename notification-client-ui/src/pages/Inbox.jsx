import { useState } from 'react'
import { getInbox, markAsRead } from '../api/inboxApi'
import { useApiKey } from '../context/ApiKeyContext'
import LoadingSpinner from '../components/LoadingSpinner'
import { formatDate } from '../utils/helpers'
import { Search, CheckCheck, Inbox as InboxIcon } from 'lucide-react'
import toast from 'react-hot-toast'

const Inbox = () => {
  const { clientId } = useApiKey()
  const [userRef, setUserRef] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)
  const [markingId, setMarkingId] = useState(null)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!userRef.trim()) return
    setLoading(true)
    setSearched(false)
    try {
      const res = await getInbox(userRef.trim(), clientId)
      setMessages(res.data)
      setSearched(true)
    } catch {
      toast.error('Failed to fetch inbox')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkRead = async (id) => {
    setMarkingId(id)
    try {
      await markAsRead(id)
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)))
      toast.success('Marked as read')
    } catch {
      toast.error('Failed to mark as read')
    } finally {
      setMarkingId(null)
    }
  }

  const unreadCount = messages.filter((m) => !m.read).length

  return (
    <div className="max-w-3xl mx-auto">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">In-App Inbox</h1>
        <p className="text-sm text-slate-400 mt-1">
          Look up in-app notifications for any user by their reference ID
        </p>
      </div>

      <div className="bg-[#1a1d27] rounded-xl border border-white/5 p-5 mb-5">
        <form onSubmit={handleSearch} className="flex gap-3">
          <input
            type="text"
            value={userRef}
            onChange={(e) => setUserRef(e.target.value)}
            placeholder="Enter userRef (e.g. user_123)"
            className="flex-1 bg-[#0f1117] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition disabled:opacity-60"
          >
            <Search size={15} />
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : searched && messages.length === 0 ? (
        <div className="bg-[#1a1d27] rounded-xl border border-white/5 p-12 text-center">
          <InboxIcon size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">
            No messages found for{' '}
            <span className="font-medium text-slate-200">"{userRef}"</span>
          </p>
        </div>
      ) : searched && messages.length > 0 ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between mb-1">
            <p className="text-sm text-slate-400">
              <span className="font-semibold text-white">{messages.length}</span> message
              {messages.length !== 1 ? 's' : ''} for{' '}
              <span className="font-semibold text-indigo-400">"{userRef}"</span>
            </p>
            {unreadCount > 0 && (
              <span className="text-xs bg-indigo-500/20 text-indigo-400 font-medium px-2.5 py-1 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </div>

          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-xl border p-5 transition ${
                msg.read
                  ? 'bg-[#1a1d27] border-white/5 opacity-60'
                  : 'bg-indigo-500/5 border-indigo-500/20'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {!msg.read && (
                      <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                    )}
                    <p className="text-sm font-semibold text-white truncate">
                      {msg.subject || 'No Subject'}
                    </p>
                  </div>
                  <p className="text-sm text-slate-400 leading-relaxed">{msg.body}</p>
                  <p className="text-xs text-slate-600 mt-2">{formatDate(msg.createdAt)}</p>
                </div>

                {!msg.read ? (
                  <button
                    onClick={() => handleMarkRead(msg.id)}
                    disabled={markingId === msg.id}
                    className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/30 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition shrink-0 disabled:opacity-50"
                  >
                    <CheckCheck size={13} />
                    {markingId === msg.id ? 'Marking...' : 'Mark Read'}
                  </button>
                ) : (
                  <span className="text-xs text-slate-600 shrink-0 flex items-center gap-1">
                    <CheckCheck size={13} />
                    Read
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export default Inbox