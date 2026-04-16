import { useEffect, useState } from 'react'
import { getAllJobs } from '../api/jobApi'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'
import { formatDate, getStatusColor, getChannelColor } from '../utils/helpers'

const FILTERS = ['ALL', 'PENDING', 'COMPLETED', 'RETRYING', 'FAILED']

export default function Jobs() {
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('ALL')

  useEffect(() => {
    async function fetchJobs() {
      try {
        const res = await getAllJobs()
        setJobs(res.data)
      } catch (err) {
        toast.error('Failed to load jobs')
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  if (loading) return <LoadingSpinner />

  const filtered = filter === 'ALL'
    ? jobs
    : jobs.filter(j => j.status === filter)

  return (
    <div>

      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notification Jobs</h2>
        <p className="text-sm text-gray-500 mt-1">
          All notification jobs — {jobs.length} total
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
              filter === f
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-500 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f}
            <span className="ml-1.5 opacity-70">
              {f === 'ALL'
                ? jobs.length
                : jobs.filter(j => j.status === f).length}
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">

        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">
            {filter === 'ALL' ? 'All Jobs' : `${filter} Jobs`}
            <span className="ml-2 text-sm text-gray-400 font-normal">
              ({filtered.length} results)
            </span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs">
              <tr>
                <th className="px-6 py-3 text-left">ID</th>
                <th className="px-6 py-3 text-left">Channel</th>
                <th className="px-6 py-3 text-left">Recipient</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Retries</th>
                <th className="px-6 py-3 text-left">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(job => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">

                  <td className="px-6 py-4 text-gray-400">#{job.id}</td>

                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getChannelColor(job.channel)}`}>
                      {job.channel}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-700">{job.recipient}</td>

                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center text-gray-500">
                    {job.retryCount}
                  </td>

                  <td className="px-6 py-4 text-gray-400">
                    {formatDate(job.createdAt)}
                  </td>

                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    No jobs found for this filter
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