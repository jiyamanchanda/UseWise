
function Topbar({ onMenuClick }) {
  return (
    <header className="h-20 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between gap-3">
      {/* Left section */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden w-10 h-10 shrink-0 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 text-xl"
          aria-label="Open navigation menu"
        >
          ☰
        </button>

        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-slate-500">
            Welcome back 👋
          </p>

          <h2 className="text-sm sm:text-lg font-semibold text-slate-900 truncate">
            Your household dashboard
          </h2>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {/* Notification button */}
        <button
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-600"
          aria-label="Notifications"
        >
          ♧

          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-blue-100 text-blue-700 font-semibold flex items-center justify-center shrink-0">
            U
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800">
              User
            </p>

            <p className="text-xs text-slate-500">
              Household member
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar
