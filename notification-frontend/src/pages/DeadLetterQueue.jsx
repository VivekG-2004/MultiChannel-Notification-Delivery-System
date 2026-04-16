import { useEffect, useState } from 'react'
import { getDlqJobs, replayDlqJob, discardDlqJob } from '../api/dlqApi'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { RotateCcw, Trash2 } from 'lucide-react'
import { formatDate, getChannelColor } from '../utils/helpers'

export default function DeadLetterQueue() {
  const [jobs, setJobs]         = useState([])
  const [loading, setLoading]   = useState(true)
  const [actionId, setActionId] = useState(null)

  useEffect(() => {
    fetchDlq()
  }, [])

  async function fetchDlq() {
    try {
      const res = await getDlqJobs()
      setJobs(res.data)
    } catch (err) {
      toast.error('Failed to load DLQ jobs')
    } finally {
      setLoading(false)
    }
  }

  async function handleReplay(id) {
    const confirmed = window.confirm(`Replay DLQ job #${id}?`)
    if (!confirmed) return

    try {
      setActionId(id)
      await replayDlqJob(id)
      toast.success(`Job #${id} replayed successfully`)
      fetchDlq()
    } catch (err) {
      toast.error('Failed to replay job')
    } finally {
      setActionId(null)
    }
  }

  async function handleDiscard(id) {
    const confirmed = window.confirm(
      `Permanently discard DLQ job #${id}? This cannot be undone.`
    )
    if (!confirmed) return

    try {
      setActionId(id)
      await discardDlqJob(id)
      toast.success(`Job #${id} discarded`)
      fetchDlq()
    } catch (err) {
      toast.error('Failed to discard job')
    } finally {
      setActionId(null)
    }
  }

  if (loading) return <LoadingSpinner />

  const active   = jobs.filter(j => !j.isDiscarded && !j.isReplayed)
  const replayed = jobs.filter(j => j.isReplayed)
  const discarded = jobs.filter(j => j.isDiscarded)

  return (
    <div>

      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dead Letter Queue</h2>
        <p className="text-sm text-gray-500 mt-1">
          Jobs that exhausted all retries
        </p>
      </div>

      {/* Summary Badges */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <div className="bg-red-50 text-red-700 text-sm px-4 py-2 rounded-lg font-medium">
          ⚠️ Active — {active.length}
        </div>
        <div className="bg-green-50 text-green-700 text-sm px-4 py-2 rounded-lg font-medium">
          ✅ Replayed — {replayed.length}
        </div>
        <div className="bg-gray-100 text-gray-600 text-sm px-4 py-2 rounded-lg font-medium">
          🗑️ Discarded — {discarded.length}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">

        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            All DLQ Jobs
            <span className="ml-2 text-sm text-gray-400 font-normal">
              ({jobs.length} total)
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Original Job</th>
                <th className="px-6 py-3 text-left">Channel</th>
                <th className="px-6 py-3 text-left">Recipient</th>
                <th className="px-6 py-3 text-left">Failure Reason</th>
                <th className="px-6 py-3 text-left">Retries</th>
                <th className="px-6 py-3 text-left">Failed At</th>
                <th className="px-6 py-3 text-left">State</th>
                <th className="px-6 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.map(job => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-6 py-4 text-gray-400">#{job.id}</td>

                  <td className="px-6 py-4 text-gray-500">
                    #{job.originalJobId}
                  </td>

                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getChannelColor(job.channel)}`}>
                      {job.channel}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-700">{job.recipient}</td>

                  <td className="px-6 py-4 text-red-500 max-w-xs truncate"
                      title={job.failureReason}>
                    {job.failureReason}
                  </td>

                  <td className="px-6 py-4 text-center text-gray-500">
                    {job.retryCount}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {formatDate(job.failedAt)}
                  </td>

                  <td className="px-6 py-4">
                    <StateBadge job={job} />
                  </td>

                  <td className="px-6 py-4">
                    <ActionButtons
                      job={job}
                      actionId={actionId}
                      onReplay={handleReplay}
                      onDiscard={handleDiscard}
                    />
                  </td>

                </tr>
              ))}

              {jobs.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-400">
                    🎉 Dead Letter Queue is empty
                  </td>
                </tr>
              )}

            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}

// --- Sub Components ---

function StateBadge({ job }) {
  if (job.isDiscarded) {
    return (
      <span className="bg-gray-100 text-gray-500 text-xs px-2 py-1 rounded-full font-medium">
        DISCARDED
      </span>
    )
  }
  if (job.isReplayed) {
    return (
      <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
        REPLAYED
      </span>
    )
  }
  return (
    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full font-medium">
      ACTIVE
    </span>
  )
}

function ActionButtons({ job, actionId, onReplay, onDiscard }) {
  const isBusy = actionId === job.id
  const isDone = job.isDiscarded || job.isReplayed

  if (isDone) {
    return <span className="text-xs text-gray-400 italic">No actions</span>
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => onReplay(job.id)}
        disabled={isBusy}
        className="flex items-center gap-1.5 text-xs bg-green-50 text-green-700
                   hover:bg-green-100 px-3 py-1.5 rounded-lg font-medium
                   transition-colors disabled:opacity-50 cursor-pointer"
      >
        <RotateCcw size={13} />
        {isBusy ? '...' : 'Replay'}
      </button>

      <button
        onClick={() => onDiscard(job.id)}
        disabled={isBusy}
        className="flex items-center gap-1.5 text-xs bg-red-50 text-red-600
                   hover:bg-red-100 px-3 py-1.5 rounded-lg font-medium
                   transition-colors disabled:opacity-50 cursor-pointer"
      >
        <Trash2 size={13} />
        {isBusy ? '...' : 'Discard'}
      </button>
    </div>
  )
}