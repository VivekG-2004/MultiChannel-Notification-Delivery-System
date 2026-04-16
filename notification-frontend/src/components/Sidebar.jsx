import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  BellDot,
  Skull,
  BarChart2,
} from 'lucide-react'

const navItems = [
  { path: '/dashboard',  label: 'Dashboard',        icon: LayoutDashboard },
  { path: '/clients',    label: 'Clients',           icon: Users },
  { path: '/jobs',       label: 'Jobs',              icon: BellDot },
  { path: '/dlq',        label: 'Dead Letter Queue', icon: Skull },
  { path: '/analytics',  label: 'Analytics',         icon: BarChart2 },
]

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-lg font-bold tracking-wide text-white">
          🔔 NotifyAdmin
        </h1>
        <p className="text-xs text-slate-400 mt-1">Notification Platform</p>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map(({ path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-slate-700">
        <p className="text-xs text-slate-500">v1.0.0 — Admin Panel</p>
      </div>

    </aside>
  )
}