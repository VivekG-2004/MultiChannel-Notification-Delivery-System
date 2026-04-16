import { useState, useEffect } from 'react'
import { getHistory } from '../api/notifyApi'
import LoadingSpinner from '../components/LoadingSpinner'
import { getStatusColor, getChannelColor, formatDate } from '../utils/helpers'
import { RefreshCw, Inbox } from 'lucide-react'
import toast from 'react-hot-toast'

const FILTERS = ['ALL', 'PENDING', 'COMPLETED', 'RETRYING', 'FAILED']

const History = () => {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('ALL')
  const [refreshing, setRefreshing] = useState(false)

  const fetchHistory = async (silent = false) => {
    if (!silent) setLoading(true)
    else setRefreshing(true)
    try {
      const res = await getHistory()
      setJobs(res.data)
    } catch {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => { fetchHistory() }, [])

  const filtered =
    activeFilter === 'ALL' ? jobs : jobs.filter((j) => j.status === activeFilter)

  return (
    <div className="max-w-6xl mx-auto">

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Notification History</h1>
          <p className="text-sm text-slate-400 mt-1">All notification jobs sent from your account</p>
        </div>
        <button
          onClick={() => fetchHistory(true)}
          disabled={refreshing}
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white border border-white/10 hover:border-indigo-500 px-3 py-2 rounded-lg transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-4">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
              activeFilter === f
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-transparent text-slate-400 border-white/10 hover:border-indigo-500 hover:text-white'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : filtered.length === 0 ? (
        <div className="bg-[#1a1d27] rounded-xl border border-white/5 p-12 text-center">
          <Inbox size={40} className="text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No jobs found for this filter.</p>
        </div>
      ) : (
        <div className="bg-[#1a1d27] rounded-xl border border-white/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">ID</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Channel</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Recipient</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Retries</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Scheduled At</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Created At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((job) => (
                  <tr key={job.id} className="hover:bg-white/5 transition">
                    <td className="px-4 py-3 text-slate-500 font-mono text-xs">#{job.id}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getChannelColor(job.channel)}`}>
                        {job.channel}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300 max-w-[160px] truncate">{job.recipient}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-center">{job.retryCount ?? 0}</td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {job.scheduledAt ? formatDate(job.scheduledAt) : '—'}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs whitespace-nowrap">
                      {formatDate(job.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-white/5">
            <p className="text-xs text-slate-500">
              Showing {filtered.length} of {jobs.length} jobs
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default History