import { Link } from 'react-router'

const stats = [
  {
    title: 'Total Expenses',
    value: '₹12,450',
    description: 'This month',
    icon: '💰',
    color: 'bg-indigo-100',
    iconColor: 'text-indigo-600',
  },
  {
    title: 'You Owe',
    value: '₹850',
    description: 'Across 2 members',
    icon: '↗️',
    color: 'bg-red-100',
    iconColor: 'text-red-600',
  },
  {
    title: 'Shopping Items',
    value: '8',
    description: 'Items on your list',
    icon: '🛒',
    color: 'bg-amber-100',
    iconColor: 'text-amber-600',
  },
  {
    title: 'Pending Chores',
    value: '3',
    description: 'Tasks remaining',
    icon: '🧹',
    color: 'bg-emerald-100',
    iconColor: 'text-emerald-600',
  },
]

const recentExpenses = [
  {
    title: 'Groceries',
    category: 'Food & groceries',
    person: 'You',
    date: 'Today',
    amount: '₹1,250',
    icon: '🛒',
    color: 'bg-amber-100',
  },
  {
    title: 'Electricity Bill',
    category: 'Utilities',
    person: 'Rahul',
    date: 'Yesterday',
    amount: '₹2,400',
    icon: '⚡',
    color: 'bg-blue-100',
  },
  {
    title: 'Internet Bill',
    category: 'Utilities',
    person: 'Priya',
    date: '20 Nov',
    amount: '₹999',
    icon: '🌐',
    color: 'bg-purple-100',
  },
  {
    title: 'Dinner',
    category: 'Food',
    person: 'You',
    date: '19 Nov',
    amount: '₹850',
    icon: '🍕',
    color: 'bg-pink-100',
  },
]

const upcomingChores = [
  {
    title: 'Clean the kitchen',
    assignedTo: 'You',
    due: 'Today',
    priority: 'High',
  },
  {
    title: 'Take out the trash',
    assignedTo: 'Rahul',
    due: 'Tomorrow',
    priority: 'Medium',
  },
  {
    title: 'Clean the living room',
    assignedTo: 'Priya',
    due: 'Tomorrow',
    priority: 'Low',
  },
]

const activities = [
  {
    text: 'Rahul added an expense',
    detail: 'Electricity Bill · ₹2,400',
    time: 'Yesterday',
    icon: '💸',
  },
  {
    text: 'Priya completed a chore',
    detail: 'Clean the bathroom',
    time: 'Yesterday',
    icon: '✅',
  },
  {
    text: 'You added items to shopping',
    detail: 'Milk, Bread, Eggs',
    time: '2 days ago',
    icon: '🛒',
  },
]

function Dashboard() {
  return (
    <div className="space-y-8">

      {/* Welcome section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Good evening 👋
          </h1>

          <p className="text-slate-500 mt-2">
            Here's what's happening in your household today.
          </p>
        </div>

        <Link
          to="/expenses"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors"
        >
          <span>+</span>
          Add Expense
        </Link>

      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">

        {stats.map((stat) => (
          <div
            key={stat.title}
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:shadow-sm transition-shadow"
          >

            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-500 font-medium">
                  {stat.title}
                </p>

                <h2 className="text-2xl font-bold text-slate-900 mt-3">
                  {stat.value}
                </h2>
              </div>

              <div className={`w-11 h-11 rounded-xl ${stat.color} flex items-center justify-center text-xl`}>
                {stat.icon}
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3">
              {stat.description}
            </p>

          </div>
        ))}

      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent expenses */}
        <div className="xl:col-span-2 bg-white border border-slate-200 rounded-2xl">

          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Expenses
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Your household's latest transactions
              </p>
            </div>

            <Link
              to="/expenses"
              className="text-sm text-indigo-600 font-semibold hover:text-indigo-700"
            >
              View all →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">

            {recentExpenses.map((expense, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-3 p-4 hover:bg-slate-50 transition-colors"
              >

                <div className="flex items-center gap-3 min-w-0">

                  <div className={`w-11 h-11 rounded-xl ${expense.color} flex items-center justify-center text-lg shrink-0`}>
                    {expense.icon}
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">
                      {expense.title}
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      {expense.category} · {expense.person}
                    </p>
                  </div>

                </div>

                <div className="text-right shrink-0">
                  <p className="font-semibold text-slate-900">
                    {expense.amount}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    {expense.date}
                  </p>
                </div>

              </div>
            ))}

          </div>

        </div>

        {/* Upcoming chores */}
        <div className="bg-white border border-slate-200 rounded-2xl">

          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Upcoming Chores
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Tasks around your home
              </p>
            </div>

            <Link
              to="/chores"
              className="text-sm text-indigo-600 font-semibold hover:text-indigo-700"
            >
              View all →
            </Link>
          </div>

          <div className="p-4 space-y-3">

            {upcomingChores.map((chore, index) => (
              <div
                key={index}
                className="p-4 bg-slate-50 rounded-xl"
              >

                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-sm text-slate-800">
                    {chore.title}
                  </p>

                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      chore.priority === 'High'
                        ? 'bg-red-100 text-red-600'
                        : chore.priority === 'Medium'
                        ? 'bg-amber-100 text-amber-600'
                        : 'bg-emerald-100 text-emerald-600'
                    }`}
                  >
                    {chore.priority}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                  <span>👤 {chore.assignedTo}</span>
                  <span>📅 {chore.due}</span>
                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* Bottom section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Balances */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">

          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Your Balances
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                See who owes whom
              </p>
            </div>

            <Link
              to="/balances"
              className="text-sm text-indigo-600 font-semibold hover:text-indigo-700"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-4">

            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center font-semibold text-red-600">
                  R
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    Rahul
                  </p>

                  <p className="text-xs text-slate-500">
                    You owe Rahul
                  </p>
                </div>
              </div>

              <p className="font-bold text-red-600">
                ₹500
              </p>
            </div>

            <div className="flex items-center justify-between p-4 bg-emerald-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center font-semibold text-emerald-600">
                  P
                </div>

                <div>
                  <p className="font-semibold text-slate-800">
                    Priya
                  </p>

                  <p className="text-xs text-slate-500">
                    Priya owes you
                  </p>
                </div>
              </div>

              <p className="font-bold text-emerald-600">
                ₹350
              </p>
            </div>

          </div>

        </div>

        {/* Activity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5">

          <div className="mb-5">
            <h2 className="text-lg font-bold text-slate-900">
              Household Activity
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Recent activity from your roommates
            </p>
          </div>

          <div className="space-y-5">

            {activities.map((activity, index) => (
              <div key={index} className="flex gap-3">

                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                  {activity.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {activity.text}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {activity.detail}
                  </p>
                </div>

                <p className="text-xs text-slate-400 shrink-0">
                  {activity.time}
                </p>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard