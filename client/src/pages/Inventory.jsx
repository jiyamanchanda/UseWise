import { useMemo, useState } from 'react'

const initialInventory = [
  {
    id: 1,
    name: 'Rice',
    quantity: 5,
    unit: 'kg',
    category: 'Groceries',
    location: 'Kitchen cupboard',
    addedBy: 'You',
    lowStockAt: 2,
  },
  {
    id: 2,
    name: 'Cooking Oil',
    quantity: 1,
    unit: 'litre',
    category: 'Groceries',
    location: 'Kitchen shelf',
    addedBy: 'Rahul',
    lowStockAt: 1,
  },
  {
    id: 3,
    name: 'Dish Soap',
    quantity: 2,
    unit: 'bottles',
    category: 'Cleaning',
    location: 'Kitchen sink',
    addedBy: 'Priya',
    lowStockAt: 1,
  },
  {
    id: 4,
    name: 'Toilet Paper',
    quantity: 3,
    unit: 'rolls',
    category: 'Household',
    location: 'Bathroom cabinet',
    addedBy: 'You',
    lowStockAt: 2,
  },
  {
    id: 5,
    name: 'Detergent',
    quantity: 1,
    unit: 'pack',
    category: 'Cleaning',
    location: 'Utility area',
    addedBy: 'Aman',
    lowStockAt: 1,
  },
  {
    id: 6,
    name: 'Coffee',
    quantity: 2,
    unit: 'jars',
    category: 'Groceries',
    location: 'Kitchen cupboard',
    addedBy: 'Rahul',
    lowStockAt: 1,
  },
  {
    id: 7,
    name: 'Light Bulbs',
    quantity: 4,
    unit: 'pieces',
    category: 'Household',
    location: 'Storage drawer',
    addedBy: 'Priya',
    lowStockAt: 1,
  },
]

const categories = ['Groceries', 'Household', 'Cleaning', 'Other']

function Inventory() {
  const [items, setItems] = useState(initialInventory)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [stockFilter, setStockFilter] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: '',
    category: 'Groceries',
    location: '',
    lowStockAt: '1',
  })

  const lowStockItems = items.filter(
    (item) => item.quantity <= item.lowStockAt
  )

  const totalQuantity = items.reduce(
    (total, item) => total + item.quantity,
    0
  )

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        categoryFilter === 'All' ||
        item.category === categoryFilter

      const matchesStock =
        stockFilter === 'All' ||
        (stockFilter === 'Low Stock' &&
          item.quantity <= item.lowStockAt) ||
        (stockFilter === 'Available' &&
          item.quantity > item.lowStockAt)

      return matchesSearch && matchesCategory && matchesStock
    })
  }, [items, search, categoryFilter, stockFilter])

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

    if (
      formData.quantity === '' ||
      Number(formData.quantity) < 0
    ) {
      setError('Please enter a valid quantity.')
      return
    }

    if (!formData.unit.trim()) {
      setError('Please enter a unit.')
      return
    }

    const newItem = {
      id: Date.now(),
      name: formData.name.trim(),
      quantity: Number(formData.quantity),
      unit: formData.unit.trim(),
      category: formData.category,
      location: formData.location.trim() || 'Not specified',
      addedBy: 'You',
      lowStockAt: Number(formData.lowStockAt),
    }

    setItems((prevItems) => [newItem, ...prevItems])

    closeModal()
  }

  const updateQuantity = (id, change) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: Math.max(0, item.quantity + change),
            }
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
      unit: '',
      category: 'Groceries',
      location: '',
      lowStockAt: '1',
    })
  }

  const getCategoryStyle = (category) => {
    switch (category) {
      case 'Groceries':
        return 'bg-green-100 text-green-700'
      case 'Household':
        return 'bg-blue-100 text-blue-700'
      case 'Cleaning':
        return 'bg-purple-100 text-purple-700'
      default:
        return 'bg-orange-100 text-orange-700'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Household Inventory
          </h1>

          <p className="text-slate-500 mt-1">
            Keep track of what your household already has.
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
          <p className="text-sm text-slate-500">Unique Items</p>

          <h2 className="text-2xl font-bold text-slate-800 mt-2">
            {items.length}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Stored in your household
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Total Quantity</p>

          <h2 className="text-2xl font-bold text-indigo-600 mt-2">
            {totalQuantity}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            Across all inventory items
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5">
          <p className="text-sm text-slate-500">Low Stock Items</p>

          <h2 className="text-2xl font-bold text-orange-600 mt-2">
            {lowStockItems.length}
          </h2>

          <p className="text-sm text-slate-400 mt-1">
            May need replenishment
          </p>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
          <div className="flex gap-3">
            <div className="text-xl">⚠️</div>

            <div>
              <h3 className="font-semibold text-orange-800">
                Low stock alert
              </h3>

              <p className="text-sm text-orange-700 mt-1">
                {lowStockItems.map((item) => item.name).join(', ')}{' '}
                {lowStockItems.length === 1
                  ? 'is running low.'
                  : 'are running low.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Inventory List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        {/* Filters */}
        <div className="p-5 border-b border-slate-200 space-y-4">
          <input
            type="text"
            placeholder="Search items or locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2.5 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Categories</option>

              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <div className="flex gap-2 flex-wrap">
              {['All', 'Available', 'Low Stock'].map((option) => (
                <button
                  key={option}
                  onClick={() => setStockFilter(option)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition ${
                    stockFilter === option
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Items */}
        <div className="divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-4xl mb-3">📦</div>

              <h3 className="font-semibold text-slate-700">
                No inventory items found
              </h3>

              <p className="text-sm text-slate-500 mt-1">
                Try changing your filters or add a new item.
              </p>
            </div>
          ) : (
            filteredItems.map((item) => {
              const isLowStock =
                item.quantity <= item.lowStockAt

              return (
                <div
                  key={item.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-slate-50 transition"
                >
                  {/* Item Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-slate-800">
                        {item.name}
                      </h3>

                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>

                      {isLowStock && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          Low Stock
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-slate-500 mt-1">
                      📍 {item.location}
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                      Added by {item.addedBy}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      disabled={item.quantity <= 0}
                      className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed font-medium"
                    >
                      −
                    </button>

                    <div className="min-w-[90px] text-center">
                      <span
                        className={`font-semibold ${
                          isLowStock
                            ? 'text-orange-600'
                            : 'text-slate-800'
                        }`}
                      >
                        {item.quantity}
                      </span>

                      <span className="text-sm text-slate-500 ml-1">
                        {item.unit}
                      </span>
                    </div>

                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-9 h-9 rounded-lg border border-slate-200 hover:bg-slate-100 font-medium"
                    >
                      +
                    </button>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => deleteItem(item.id)}
                    title="Delete item"
                    className="self-end sm:self-auto text-slate-400 hover:text-red-500 p-2 transition"
                  >
                    🗑️
                  </button>
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Add Item Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">
                  Add Inventory Item
                </h2>

                <p className="text-sm text-slate-500 mt-1">
                  Add something your household owns.
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
              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Item Name
                </label>

                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rice"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Quantity and Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    step="0.1"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 2"
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Unit
                  </label>

                  <input
                    type="text"
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="kg, packs..."
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
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
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 bg-white outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Storage Location
                </label>

                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kitchen cupboard"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Low Stock Threshold */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Low Stock Alert At
                </label>

                <input
                  type="number"
                  name="lowStockAt"
                  min="0"
                  step="0.1"
                  value={formData.lowStockAt}
                  onChange={handleChange}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500"
                />

                <p className="text-xs text-slate-400 mt-1">
                  Alert when quantity reaches this value or below.
                </p>
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

export default Inventory