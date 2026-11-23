import { useState } from 'react'

const initialExpenses = [
  {
    id: 1,
    title: 'Groceries',
    category: 'Food & Groceries',
    paidBy: 'You',
    date: '2026-11-23',
    amount: 1250,
    icon: '🛒',
    splitBetween: ['You', 'Rahul', 'Priya'],
  },
  {
    id: 2,
    title: 'Electricity Bill',
    category: 'Utilities',
    paidBy: 'Rahul',
    date: '2026-11-22',
    amount: 2400,
    icon: '⚡',
    splitBetween: ['You', 'Rahul', 'Priya'],
  },
  {
    id: 3,
    title: 'Internet Bill',
    category: 'Utilities',
    paidBy: 'Priya',
    date: '2026-11-20',
    amount: 999,
    icon: '🌐',
    splitBetween: ['You', 'Rahul', 'Priya'],
  },
  {
    id: 4,
    title: 'Dinner',
    category: 'Food & Groceries',
    paidBy: 'You',
    date: '2026-11-19',
    amount: 850,
    icon: '🍕',
    splitBetween: ['You', 'Rahul'],
  },
  {
    id: 5,
    title: 'Cleaning Supplies',
    category: 'Household',
    paidBy: 'Rahul',
    date: '2026-11-18',
    amount: 560,
    icon: '🧹',
    splitBetween: ['You', 'Rahul', 'Priya'],
  },
  {
    id: 6,
    title: 'Water Bill',
    category: 'Utilities',
    paidBy: 'Priya',
    date: '2026-11-17',
    amount: 450,
    icon: '💧',
    splitBetween: ['You', 'Rahul', 'Priya'],
  },
]

const categories = [
  'Food & Groceries',
  'Utilities',
  'Household',
  'Transport',
  'Entertainment',
  'Other',
]

const members = ['You', 'Rahul', 'Priya']

const categoryIcons = {
  'Food & Groceries': '🛒',
  Utilities: '⚡',
  Household: '🏠',
  Transport: '🚗',
  Entertainment: '🎬',
  Other: '💰',
}

function Expenses() {
  const [expenses, setExpenses] = useState(initialExpenses)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')
  const [monthFilter, setMonthFilter] = useState('All Time')

  // Modal state
  const [showModal, setShowModal] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food & Groceries')
  const [paidBy, setPaidBy] = useState('You')
  const [date, setDate] = useState('2026-11-23')
  const [splitBetween, setSplitBetween] = useState(['You', 'Rahul', 'Priya'])
  const [error, setError] = useState('')

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.title.toLowerCase().includes(search.toLowerCase()) ||
      expense.paidBy.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      categoryFilter === 'All Categories' ||
      expense.category === categoryFilter

    const matchesMonth =
      monthFilter === 'All Time' ||
      expense.date.startsWith(monthFilter)

    return matchesSearch && matchesCategory && matchesMonth
  })

  const totalExpenses = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  )

  const myExpenses = expenses
    .filter((expense) => expense.paidBy === 'You')
    .reduce((total, expense) => total + expense.amount, 0)

  const transactionCount = expenses.length

  const equalShare =
    splitBetween.length > 0 && amount
      ? Number(amount) / splitBetween.length
      : 0

  const handleMemberToggle = (member) => {
    setSplitBetween((previous) =>
      previous.includes(member)
        ? previous.filter((item) => item !== member)
        : [...previous, member]
    )
  }

  const resetForm = () => {
    setTitle('')
    setAmount('')
    setCategory('Food & Groceries')
    setPaidBy('You')
    setDate('2026-11-23')
    setSplitBetween(['You', 'Rahul', 'Priya'])
    setError('')
  }

  const handleSaveExpense = () => {
    setError('')

    if (!title.trim()) {
      setError('Please enter an expense title.')
      return
    }

    if (!amount || Number(amount) <= 0) {
      setError('Please enter a valid amount greater than zero.')
      return
    }

    if (!date) {
      setError('Please select an expense date.')
      return
    }

    if (splitBetween.length === 0) {
      setError('Please select at least one member to split the expense.')
      return
    }

    const newExpense = {
      id: Date.now(),
      title: title.trim(),
      category,
      paidBy,
      date,
      amount: Number(amount),
      icon: categoryIcons[category] || '💰',
      splitBetween,
    }

    setExpenses((previous) => [newExpense, ...previous])

    resetForm()
    setShowModal(false)
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
            Expenses
          </h1>

          <p className="text-slate-500 mt-2">
            Track and manage your household expenses.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-semibold transition-colors"
        >
          + Add Expense
        </button>

      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Total Household Expenses
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-2">
            ₹{totalExpenses.toLocaleString('en-IN')}
          </h2>

          <p className="text-xs text-slate-400 mt-2">
            Across all transactions
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Paid by You
          </p>

          <h2 className="text-2xl font-bold text-indigo-600 mt-2">
            ₹{myExpenses.toLocaleString('en-IN')}
          </h2>

          <p className="text-xs text-slate-400 mt-2">
            Your contributions
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">
            Transactions
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-2">
            {transactionCount}
          </h2>

          <p className="text-xs text-slate-400 mt-2">
            Recorded expenses
          </p>
        </div>

      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Search */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Search expenses
            </label>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by expense or person..."
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Category
            </label>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option>All Categories</option>

              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">
              Date
            </label>

            <select
              value={monthFilter}
              onChange={(e) => setMonthFilter(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            >
              <option value="All Time">All Time</option>
              <option value="2026-11">November 2026</option>
              <option value="2026-10">October 2026</option>
              <option value="2026-09">September 2026</option>
            </select>
          </div>

        </div>

      </div>

      {/* Expense list */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">

        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">
            All Transactions
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {filteredExpenses.length} transactions found
          </p>
        </div>

        {filteredExpenses.length === 0 ? (
          <div className="text-center py-12 px-4">
            <div className="text-4xl mb-3">🔍</div>

            <h3 className="font-semibold text-slate-800">
              No expenses found
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Try changing your search or filters.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">

            {filteredExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between gap-4 p-4 hover:bg-slate-50 transition-colors"
              >

                <div className="flex items-center gap-3 min-w-0">

                  <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                    {expense.icon}
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-semibold text-slate-800">
                      {expense.title}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {expense.category} · Paid by {expense.paidBy}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(expense.date + 'T00:00:00').toLocaleDateString(
                        'en-IN',
                        {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        }
                      )}
                    </p>
                  </div>

                </div>

                <div className="text-right shrink-0">
                  <p className="font-bold text-slate-900">
                    ₹{expense.amount.toLocaleString('en-IN')}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    Split {expense.splitBetween?.length || 1} ways
                  </p>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">

          <div className="bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">

            {/* Modal header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Add Expense
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Record a shared household expense.
                </p>
              </div>

              <button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-500 text-xl"
              >
                ×
              </button>
            </div>

            {/* Form */}
            <div className="p-5 space-y-5">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Expense title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Groceries, Electricity bill"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Amount (₹)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Category + Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Category
                  </label>

                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Date
                  </label>

                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

              </div>

              {/* Paid by */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Paid by
                </label>

                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {members.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>

              {/* Split between */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-3">
                  Split expense between
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {members.map((member) => {
                    const isSelected = splitBetween.includes(member)

                    return (
                      <button
                        key={member}
                        type="button"
                        onClick={() => handleMemberToggle(member)}
                        className={`p-3 rounded-xl border text-sm font-medium transition-colors ${
                          isSelected
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}
                        {member}
                      </button>
                    )
                  })}
                </div>

                {/* Split preview */}
                {splitBetween.length > 0 && amount && Number(amount) > 0 && (
                  <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-4">

                    <p className="text-sm font-semibold text-slate-700 mb-2">
                      Equal split preview
                    </p>

                    <p className="text-lg font-bold text-indigo-600">
                      ₹{equalShare.toLocaleString('en-IN', {
                        maximumFractionDigits: 2,
                      })}{' '}
                      per person
                    </p>

                    <p className="text-xs text-slate-500 mt-1">
                      ₹{Number(amount).toLocaleString('en-IN')} divided among{' '}
                      {splitBetween.length} member
                      {splitBetween.length !== 1 ? 's' : ''}
                    </p>

                  </div>
                )}
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
                  {error}
                </div>
              )}

            </div>

            {/* Modal footer */}
            <div className="flex gap-3 p-5 border-t border-slate-200">

              <button
                onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}
                className="flex-1 border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSaveExpense}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                Save Expense
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  )
}

export default Expenses