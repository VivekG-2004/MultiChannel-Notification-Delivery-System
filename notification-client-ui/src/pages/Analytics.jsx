import { useState, useEffect } from 'react'
import { getAnalyticsSummary, getChannelBreakdown, getDlqSize } from '../api/analyticsApi'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { Send, CheckCircle, XCircle, RefreshCw, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'

const Analytics = () => {
  const [summary, setSummary] = useState(null)
  const [channels, setChannels] = useState([])
  const [dlqSize, setDlqSize] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      try {
        const [summaryRes, channelRes, dlqRes] = await Promise.all([
          getAnalyticsSummary(),
          getChannelBreakdown(),
          getDlqSize(),
        ])
        setSummary(summaryRes.data)
        setChannels(channelRes.data)
        setDlqSize(dlqRes.data?.dlqSize ?? dlqRes.data)
      } catch {
        toast.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const deliveryRate =
    summary?.totalSent > 0
      ? Math.round((summary.totalDelivered / summary.totalSent) * 100)
      : 0

  const failureRate =
    summary?.totalSent > 0
      ? Math.round((summary.totalFailed / summary.totalSent) * 100)
      : 0

  const pendingRate =
    summary?.totalSent > 0
      ? Math.round((summary.totalRetrying / summary.totalSent) * 100)
      : 0

  const channelData = summary?.byChannel
    ? Object.entries(summary.byChannel).map(([channel, count]) => ({
        channel,
        count,
      }))
    : []

  if (loading) return <LoadingSpinner />

  return (
    <div className="max-w-5xl mx-auto">

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-slate-400 mt-1">Delivery statistics for your account</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <StatCard title="Total Jobs" value={summary?.totalSent ?? 0} icon={Send} color="indigo" />
        <StatCard title="Delivered" value={summary?.totalDelivered ?? 0} icon={CheckCircle} color="green" />
        <StatCard title="Failed" value={summary?.totalFailed ?? 0} icon={XCircle} color="red" />
        <StatCard title="Retrying" value={summary?.totalRetrying ?? 0} icon={RefreshCw} color="yellow" />
        <StatCard
          title="DLQ Size"
          value={typeof dlqSize === 'object' ? (dlqSize?.dlqSize ?? 0) : (dlqSize ?? 0)}
          icon={AlertTriangle}
          color="red"
        />
      </div>

      {/* Progress Bars */}
      <div className="bg-[#1a1d27] rounded-xl border border-white/5 p-6 mb-6">
        <h2 className="text-base font-semibold text-white mb-5">Delivery Overview</h2>

        {/* Delivery Rate */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-slate-400">Delivery Rate</span>
            <span className="font-semibold text-green-400">{deliveryRate}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${deliveryRate}%` }}
            />
          </div>
        </div>

        {/* Failure Rate */}
        <div className="mb-4">
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-slate-400">Failure Rate</span>
            <span className="font-semibold text-red-400">{failureRate}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${failureRate}%` }}
            />
          </div>
        </div>

        {/* Pending Rate */}
        <div>
          <div className="flex justify-between text-sm mb-1.5">
            <span className="text-slate-400">Pending Rate</span>
            <span className="font-semibold text-yellow-400">{pendingRate}%</span>
          </div>
          <div className="w-full bg-white/5 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${pendingRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      {channelData.length === 0 ? (
        <p className="text-sm text-slate-500 text-center py-8">
          No channel data available yet.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={channelData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
            <XAxis dataKey="channel" tick={{ fontSize: 12, fill: '#94a3b8' }} />
            <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1a1d27',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '8px',
                fontSize: '12px',
                color: '#e2e8f0',
              }}
            />
            <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Notifications" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {/* Legend */}
      <div className="flex items-center gap-5 mt-4 justify-center">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" />
          <span className="text-xs text-slate-400">Delivered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-red-500 inline-block" />
          <span className="text-xs text-slate-400">Failed</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" />
          <span className="text-xs text-slate-400">Pending</span>
        </div>
      </div>

    </div>
  )
}

export default Analytics