import { useMemo, useState } from 'react'

const initialItems = [
  {
    id: 1,
    name: 'Milk',
    quantity: '2 litres',
    category: 'Groceries',
    addedBy: 'Rahul',
    purchased: false,
  },
  {
    id: 2,
    name: 'Bread',
    quantity: '2 packets',
    category: 'Groceries',
    addedBy: 'You',
    purchased: false,
  },
  {
    id: 3,
    name: 'Dishwashing liquid',
    quantity: '1 bottle',
    category: 'Household',
    addedBy: 'Priya',
    purchased: false,
  },
  {
    id: 4,
    name: 'Eggs',
    quantity: '12 pieces',
    category: 'Groceries',
    addedBy: 'Aman',
    purchased: true,
  },
  {
    id: 5,
    name: 'Toilet paper',
    quantity: '2 packs',
    category: 'Household',
    addedBy: 'You',
    purchased: false,
  },
  {
    id: 6,
    name: 'Maggi',
    quantity: '5 packets',
    category: 'Snacks',
    addedBy: 'Rahul',
    purchased: false,
  },
]

const categories = ['Groceries', 'Household', 'Snacks', 'Other']

function Shopping() {
  const [items, setItems] = useState(initialItems)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    category: 'Groceries',
  })

  const [error, setError] = useState('')

  const pendingItems = items.filter((item) => !item.purchased)
  const purchasedItems = items.filter((item) => item.purchased)

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesFilter =
        filter === 'All' ||
        (filter === 'Pending' && !item.purchased) ||
        (filter === 'Purchased' && item.purchased)

      return matchesSearch && matchesFilter
    })
  }, [items, search, filter])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAddItem = (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError('Please enter an item name.')
      return
    }

    if (!formData.quantity.trim()) {
      setError('Please enter a quantity.')
      return
    }

    const newItem = {
      id: Date.now(),
      name: formData.name.trim(),
      quantity: formData.quantity.trim(),
      category: formData.category,
      addedBy: 'You',
      purchased: false,
    }

    setItems((prevItems) => [newItem, ...prevItems])

    setFormData({
      name: '',
      quantity: '',
      category: 'Groceries',
    })

    setError('')
    setShowModal(false)
  }

  const togglePurchased = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, purchased: !item.purchased }
          : item
      )
    )
  }

  const deleteItem = (id) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.id !== id)
    )
  }

  const closeModal = () => {
    setShowModal(false)
    setError('')
    setFormData({
      name: '',
      quantity: '',
      category: 'Groceries',
    })
  }

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'Groceries':
        return 'bg-green-100 text-green-700'
      case 'Household':
        return 'bg-blue-100 text-blue-700'
      case 'Snacks':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-purple-100 text-purple-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Shopping List
          </h1>

          <p className="text-slate-500 mt-1">
            Keep track of everything your household needs.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl font-medium transition"
        >
          + Add Item
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total Items</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-2">
            {items.length}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            On your shopping list
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Pending</p>

          <h2 className="text-2xl font-bold text-orange-600 mt-2">
            {pendingItems.length}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Still need to buy
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Purchased</p>

          <h2 className="text-2xl font-bold text-green-600 mt-2">
            {purchasedItems.length}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Already completed
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-3">
          <div>
            <h3 className="font-semibold text-slate-800">
              Shopping Progress
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              {purchasedItems.length} of {items.length} items purchased
            </p>
          </div>

          <span className="font-semibold text-indigo-600">
            {items.length === 0
              ? 0
              : Math.round((purchasedItems.length / items.length) * 100)}
            %
          </span>
        </div>

        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-300"
            style={{
              width: `${
                items.length === 0
                  ? 0
                  : (purchasedItems.length / items.length) * 100
              }%`,
            }}
          />
        </div>
      </div>

      {/* List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <input
              type="text"
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-2">
            {['All', 'Pending', 'Purchased'].map((option) => (
              <button
                key={option}
                onClick={() => setFilter(option)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  filter === option
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Items */}
        <div className="divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">🛒</div>

              <h3 className="font-semibold text-slate-700">
                No items found
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Try changing your search or add a new item.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-4 sm:p-5 flex items-center gap-4 hover:bg-slate-50 transition"
              >
                {/* Checkbox */}
                <button
                  onClick={() => togglePurchased(item.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
                    item.purchased
                      ? 'bg-green-500 border-green-500 text-white'
                      : 'border-slate-300 hover:border-indigo-500'
                  }`}
                >
                  {item.purchased && '✓'}
                </button>

                {/* Item details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3
                      className={`font-medium ${
                        item.purchased
                          ? 'text-slate-400 line-through'
                          : 'text-slate-800'
                      }`}
                    >
                      {item.name}
                    </h3>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                  </div>

                  <p className="text-sm text-slate-500 mt-1">
                    {item.quantity} · Added by {item.addedBy}
                  </p>
                </div>

                {/* Status */}
                <span
                  className={`hidden sm:block text-xs font-medium px-3 py-1 rounded-full ${
                    item.purchased
                      ? 'bg-green-100 text-green-700'
                      : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {item.purchased ? 'Purchased' : 'Pending'}
                </span>

                {/* Delete */}
                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-slate-400 hover:text-red-500 transition p-2"
                  title="Delete item"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Add Shopping Item
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Add something your household needs.
                </p>
              </div>

              <button
                onClick={closeModal}
                className="text-slate-400 hover:text-slate-700 text-xl"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Item Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Milk"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Quantity
                </label>

                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="e.g. 2 litres, 1 packet"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
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
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Shopping