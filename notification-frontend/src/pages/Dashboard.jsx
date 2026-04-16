import { useEffect, useState } from 'react'
import { Users, BellDot, CheckCircle, Skull } from 'lucide-react'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'
import { getAllClients } from '../api/clientApi'
import { getAllJobs } from '../api/jobApi'
import { getDlqJobs } from '../api/dlqApi'

export default function Dashboard() {
  const [clients, setClients]   = useState([])
  const [jobs, setJobs]         = useState([])
  const [dlq, setDlq]           = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [clientRes, jobRes, dlqRes] = await Promise.all([
          getAllClients(),
          getAllJobs(),
          getDlqJobs(),
        ])
        setClients(clientRes.data)
        setJobs(jobRes.data)
        setDlq(dlqRes.data)
      } catch (err) {
        console.error('Dashboard fetch error', err)
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <LoadingSpinner />

  const totalDelivered = jobs.filter(j => j.status === 'COMPLETED').length
  const totalFailed    = jobs.filter(j => j.status === 'FAILED').length

  return (
    <div>

      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">System overview at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Clients"
          value={clients.length}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Jobs"
          value={jobs.length}
          icon={BellDot}
          color="purple"
        />
        <StatCard
          title="Delivered"
          value={totalDelivered}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="DLQ Size"
          value={dlq.length}
          icon={Skull}
          color="red"
        />
      </div>

      {/* Recent Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">

        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-800">Recent Jobs</h3>
          <p className="text-xs text-gray-400 mt-0.5">Last 5 notification jobs</p>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {jobs.slice(0, 5).map(job => (
                <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3 text-gray-500">#{job.id}</td>
                  <td className="px-6 py-3">
                    <span className="bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium">
                      {job.channel}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-gray-700">{job.recipient}</td>
                  <td className="px-6 py-3">
                    <StatusBadge status={job.status} />
                  </td>
                  <td className="px-6 py-3 text-gray-500">{job.retryCount}</td>
                </tr>
              ))}
              {jobs.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    No jobs found
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

function StatusBadge({ status }) {
  const colors = {
    COMPLETED: 'bg-green-100 text-green-700',
    PENDING:   'bg-blue-100 text-blue-700',
    RETRYING:  'bg-yellow-100 text-yellow-700',
    FAILED:    'bg-red-100 text-red-700',
  }
  const cls = colors[status] || 'bg-gray-100 text-gray-600'
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${cls}`}>
      {status}
    </span>
  )
}