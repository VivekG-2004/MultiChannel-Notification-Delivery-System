import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts'
import { Send, CheckCircle, XCircle, TrendingUp, Skull } from 'lucide-react'
import { getAnalyticsSummary, getChannelBreakdown, getDlqSize } from '../api/analyticsApi'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'
import toast from 'react-hot-toast'

const CHANNEL_COLORS = {
  EMAIL:   '#8b5cf6',
  SMS:     '#f97316',
  IN_APP:  '#14b8a6',
  WEBHOOK: '#ec4899',
}

export default function Analytics() {
  const [summary, setSummary]   = useState(null)
  const [channels, setChannels] = useState([])
  const [dlqSize, setDlqSize]   = useState(0)
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function fetchAll() {
      try {
        const [summaryRes, channelRes, dlqRes] = await Promise.all([
          getAnalyticsSummary(),
          getChannelBreakdown(),
          getDlqSize(),
        ])

        setSummary(summaryRes.data)
        setDlqSize(dlqRes.data.dlqSize)

        // Convert byChannel object to array for Recharts
        // { EMAIL: 4, SMS: 1 } → [{ channel: 'EMAIL', count: 4 }, ...]
        const byChannel = channelRes.data.byChannel || {}
        const chartData = Object.entries(byChannel).map(([channel, count]) => ({
          channel,
          count,
        }))
        setChannels(chartData)

      } catch (err) {
        toast.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  if (loading) return <LoadingSpinner />

  return (
    <div>

      {/* Page Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">
          Notification delivery performance summary
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Sent"
          value={summary?.totalSent ?? 0}
          icon={Send}
          color="blue"
        />
        <StatCard
          title="Delivered"
          value={summary?.totalDelivered ?? 0}
          icon={CheckCircle}
          color="green"
        />
        <StatCard
          title="Failed"
          value={summary?.totalFailed ?? 0}
          icon={XCircle}
          color="red"
        />
        <StatCard
          title="Delivery Rate"
          value={`${summary?.deliveryRate ?? 0}%`}
          icon={TrendingUp}
          color="purple"
        />
        <StatCard
          title="DLQ Size"
          value={dlqSize}
          icon={Skull}
          color="yellow"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Bar Chart */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            Notifications by Channel
          </h3>
          <p className="text-xs text-gray-400 mb-6">
            Total jobs sent per channel
          </p>

          {channels.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-gray-400 text-sm">
              No channel data available
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={channels} barCategoryGap="40%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="channel"
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: '#94a3b8' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {channels.map((entry) => (
                    <Cell
                      key={entry.channel}
                      fill={CHANNEL_COLORS[entry.channel] || '#94a3b8'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Delivery Summary Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-base font-semibold text-gray-800 mb-1">
            Delivery Summary
          </h3>
          <p className="text-xs text-gray-400 mb-6">
            Breakdown of all notification outcomes
          </p>

          <div className="space-y-4">
            <SummaryRow
              label="Delivered"
              value={summary?.totalDelivered ?? 0}
              total={summary?.totalSent ?? 1}
              color="bg-green-500"
            />
            <SummaryRow
              label="Failed"
              value={summary?.totalFailed ?? 0}
              total={summary?.totalSent ?? 1}
              color="bg-red-500"
            />
            <SummaryRow
              label="Retrying"
              value={summary?.totalRetrying ?? 0}
              total={summary?.totalSent ?? 1}
              color="bg-yellow-500"
            />
          </div>

          {/* Delivery Rate Big Number */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 mb-1">Overall Delivery Rate</p>
            <p className="text-5xl font-bold text-blue-600">
              {summary?.deliveryRate ?? 0}
              <span className="text-2xl text-gray-400">%</span>
            </p>
          </div>

        </div>

      </div>

    </div>
  )
}

// --- Sub Components ---

function SummaryRow({ label, value, total, color }) {
  const percent = total > 0 ? Math.round((value / total) * 100) : 0

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-600">{label}</span>
        <span className="font-semibold text-gray-800">
          {value}
          <span className="text-gray-400 font-normal ml-1">({percent}%)</span>
        </span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2">
        <div
          className={`${color} h-2 rounded-full transition-all duration-500`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}