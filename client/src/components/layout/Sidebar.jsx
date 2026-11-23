
import { NavLink } from 'react-router'

const navigation = [
  { name: 'Dashboard', path: '/dashboard', icon: '⌂' },
  { name: 'Expenses', path: '/expenses', icon: '₹' },
  { name: 'Balances', path: '/balances', icon: '⇄' },
  { name: 'Shopping Lists', path: '/shopping', icon: '☑' },
  { name: 'Inventory', path: '/inventory', icon: '▣' },
  { name: 'Chores', path: '/chores', icon: '✦' },
  { name: 'Settings', path: '/settings', icon: '⚙' },
]

function Sidebar({ onClose }) {
  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="h-20 px-6 flex items-center border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl">
            U
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-900">UseWise</h1>
            <p className="text-xs text-slate-500">Shared living, simplified</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4 px-3">
          Menu
        </p>

        <div className="space-y-1">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              <span className="text-lg w-6 text-center">{item.icon}</span>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-slate-800">
            Your household
          </p>

          <p className="text-xs text-slate-500 mt-1">
            Manage your shared space
          </p>

          <NavLink
            to="/settings"
            onClick={onClose}
            className="inline-block mt-3 text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Household settings →
          </NavLink>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
