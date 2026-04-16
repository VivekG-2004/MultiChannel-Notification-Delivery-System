import { NavLink } from 'react-router-dom'
import { Send, FileText, History, Inbox, BarChart2, Bell } from 'lucide-react'

const links = [
  { to: '/send', label: 'Send', icon: Send },
  { to: '/templates', label: 'Templates', icon: FileText },
  { to: '/history', label: 'History', icon: History },
  { to: '/inbox', label: 'Inbox', icon: Inbox },
  { to: '/analytics', label: 'Analytics', icon: BarChart2 },
]

const Sidebar = () => {
  return (
    <div className="w-56 bg-[#1a1d27] border-r border-white/5 flex flex-col h-full">
      <div className="h-16 flex items-center gap-2 px-5 border-b border-white/5">
        <Bell size={20} className="text-indigo-400" />
        <span className="font-bold text-white text-lg">NotifyClient</span>
      </div>
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-indigo-500/20 text-indigo-400'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export default Sidebar