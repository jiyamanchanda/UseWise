import { useMemo, useState } from 'react'

const initialChores = [
  {
    id: 1,
    title: 'Clean kitchen',
    description: 'Wipe counters and clean the sink',
    assignedTo: 'Rahul',
    dueDate: '2026-11-25',
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 2,
    title: 'Take out trash',
    description: 'Empty kitchen and bathroom bins',
    assignedTo: 'You',
    dueDate: '2026-11-24',
    priority: 'Medium',
    status: 'Pending',
  },
  {
    id: 3,
    title: 'Clean bathroom',
    description: 'Clean toilet, sink and floor',
    assignedTo: 'Priya',
    dueDate: '2026-11-26',
    priority: 'High',
    status: 'Pending',
  },
  {
    id: 4,
    title: 'Buy groceries',
    description: 'Get weekly groceries',
    assignedTo: 'Aman',
    dueDate: '2026-11-23',
    priority: 'Medium',
    status: 'Completed',
  },
  {
    id: 5,
    title: 'Vacuum living room',
    description: 'Vacuum the sofa and floor',
    assignedTo: 'You',
    dueDate: '2026-11-27',
    priority: 'Low',
    status: 'Pending',
  },
  {
    id: 6,
    title: 'Wash dishes',
    description: 'Wash dishes after dinner',
    assignedTo: 'Rahul',
    dueDate: '2026-11-23',
    priority: 'Low',
    status: 'Completed',
  },
]

const members = ['You', 'Rahul', 'Priya', 'Aman']
const priorities = ['Low', 'Medium', 'High']

function Chores() {
  const [chores, setChores] = useState(initialChores)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [memberFilter, setMemberFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignedTo: 'You',
    dueDate: '',
    priority: 'Medium',
  })

  const pendingChores = chores.filter(
    (chore) => chore.status === 'Pending'
  )

  const completedChores = chores.filter(
    (chore) => chore.status === 'Completed'
  )

  const overdueChores = chores.filter(
    (chore) =>
      chore.status === 'Pending' &&
      chore.dueDate < new Date().toISOString().split('T')[0]
  )

  const filteredChores = useMemo(() => {
    return chores.filter((chore) => {
      const matchesSearch =
        chore.title.toLowerCase().includes(search.toLowerCase()) ||
        chore.description.toLowerCase().includes(search.toLowerCase())

      const matchesStatus =
        statusFilter === 'All' ||
        chore.status === statusFilter

      const matchesMember =
        memberFilter === 'All' ||
        chore.assignedTo === memberFilter

      return matchesSearch && matchesStatus && matchesMember
    })
  }, [chores, search, statusFilter, memberFilter])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddChore = (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setError('Please enter a chore title.')
      return
    }

    if (!formData.dueDate) {
      setError('Please select a due date.')
      return
    }

    const newChore = {
      id: Date.now(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      assignedTo: formData.assignedTo,
      dueDate: formData.dueDate,
      priority: formData.priority,
      status: 'Pending',
    }

    setChores((prevChores) => [newChore, ...prevChores])

    closeModal()
  }

  const toggleStatus = (id) => {
    setChores((prevChores) =>
      prevChores.map((chore) =>
        chore.id === id
          ? {
              ...chore,
              status:
                chore.status === 'Pending'
                  ? 'Completed'
                  : 'Pending',
            }
          : chore
      )
    )
  }

  const deleteChore = (id) => {
    setChores((prevChores) =>
      prevChores.filter((chore) => chore.id !== id)
    )
  }

  const closeModal = () => {
    setShowModal(false)
    setError('')

    setFormData({
      title: '',
      description: '',
      assignedTo: 'You',
      dueDate: '',
      priority: 'Medium',
    })
  }

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700'
      case 'Medium':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-green-100 text-green-700'
    }
  }

  const getStatusStyle = (status) => {
    return status === 'Completed'
      ? 'bg-green-100 text-green-700'
      : 'bg-orange-100 text-orange-700'
  }

  const formatDate = (date) => {
    if (!date) return ''

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      'en-IN',
      {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }
    )
  }

  const isOverdue = (chore) => {
    return (
      chore.status === 'Pending' &&
      chore.dueDate < new Date().toISOString().split('T')[0]
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Household Chores
          </h1>

          <p className="text-slate-500 mt-1">
            Organize tasks and keep your household running smoothly.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium transition"
        >
          + Add Chore
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total Chores</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-2">
            {chores.length}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Household tasks
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Pending</p>

          <h2 className="text-2xl font-bold text-orange-600 mt-2">
            {pendingChores.length}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Tasks to complete
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Completed</p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            {completedChores.length}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Finished tasks
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Overdue</p>

          <h2 className="text-2xl font-bold text-red-600 mt-2">
            {overdueChores.length}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Past their due date
          </p>
        </div>
      </div>

      {/* Completion Progress */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-semibold text-slate-800">
              Household Progress
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {completedChores.length} of {chores.length} chores completed
            </p>
          </div>

          <span className="font-semibold text-indigo-600">
            {chores.length === 0
              ? 0
              : Math.round(
                  (completedChores.length / chores.length) * 100
                )}
            %
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{
              width: `${
                chores.length === 0
                  ? 0
                  : (completedChores.length / chores.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
        <input
          type="text"
          placeholder="Search chores..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex flex-wrap gap-2">
            {['All', 'Pending', 'Completed'].map((option) => (
              <button
                key={option}
                onClick={() => setStatusFilter(option)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                  statusFilter === option
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <select
            value={memberFilter}
            onChange={(e) => setMemberFilter(e.target.value)}
            className="border border-slate-200 rounded-xl px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Members</option>

            {members.map((member) => (
              <option key={member} value={member}>
                {member}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chore List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-slate-200">
          <h2 className="font-semibold text-slate-800">
            Chore List
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {filteredChores.length} tasks displayed
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredChores.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">🧹</div>

              <h3 className="font-semibold text-slate-700">
                No chores found
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Try changing your filters or add a new chore.
              </p>
            </div>
          ) : (
            filteredChores.map((chore) => (
              <div
                key={chore.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition"
              >
                {/* Completion Button */}
                <button
                  onClick={() => toggleStatus(chore.id)}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                    chore.status === 'Completed'
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-slate-300 hover:border-indigo-500'
                  }`}
                >
                  {chore.status === 'Completed' && '✓'}
                </button>

                {/* Chore Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`font-semibold ${
                        chore.status === 'Completed'
                          ? 'text-slate-400 line-through'
                          : 'text-slate-800'
                      }`}
                    >
                      {chore.title}
                    </h3>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityStyle(
                        chore.priority
                      )}`}
                    >
                      {chore.priority} Priority
                    </span>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        chore.status
                      )}`}
                    >
                      {chore.status}
                    </span>

                    {isOverdue(chore) && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        Overdue
                      </span>
                    )}
                  </div>

                  {chore.description && (
                    <p className="text-sm text-slate-500 mt-1">
                      {chore.description}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-3 text-sm text-slate-500 mt-2">
                    <span>👤 {chore.assignedTo}</span>

                    <span>📅 {formatDate(chore.dueDate)}</span>
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteChore(chore.id)}
                  title="Delete chore"
                  className="self-end sm:self-auto text-slate-400 hover:text-red-500 p-2 transition"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Chore Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Add New Chore
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Assign a task to a household member.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddChore} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Chore Title
                </label>

                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g. Clean kitchen"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description (Optional)
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Add details about the task..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Assigned Member */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Assign To
                </label>

                <select
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {members.map((member) => (
                    <option key={member} value={member}>
                      {member}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Due Date
                </label>

                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
                    </option>
                  ))}
                </select>
              </div>

              {error && (
                <p className="text-sm text-red-500">{error}</p>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 border border-slate-200 text-slate-600 rounded-xl py-3 font-medium hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl py-3 font-medium transition"
                >
                  Add Chore
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chores