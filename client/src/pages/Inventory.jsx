
import { useEffect, useMemo, useState } from 'react'
import {
  getHouseholds,
  getInventoryItems,
  createInventoryItem,
  updateInventoryQuantity,
  deleteInventoryItem,
} from '../services/api'

const categories = ['Groceries', 'Household', 'Cleaning', 'Other']

function Inventory() {
  const [items, setItems] = useState([])
  const [householdId, setHouseholdId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [stockFilter, setStockFilter] = useState('All')

  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [pageError, setPageError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    unit: '',
    category: 'Groceries',
    location: '',
    lowStockAt: '1',
  })

  // Load household and its inventory from the backend
  const loadInventory = async () => {
    try {
      setLoading(true)
      setPageError('')

      const householdData = await getHouseholds()

      if (!householdData.households?.length) {
        setHouseholdId('')
        setItems([])
        setPageError('You have not joined a household yet.')
        return
      }

      const currentHouseholdId = householdData.households[0]._id
      setHouseholdId(currentHouseholdId)

      const inventoryData = await getInventoryItems(currentHouseholdId)
      setItems(inventoryData.inventoryItems || [])
    } catch (err) {
      setPageError(err.message || 'Failed to load inventory.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [])

  // Calculate inventory statistics
  const lowStockItems = items.filter(
    (item) => Number(item.quantity) <= Number(item.lowStockAt)
  )

  const totalQuantity = items.reduce(
    (total, item) => total + Number(item.quantity),
    0
  )

  // Search and filter inventory
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        (item.location || '').toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        categoryFilter === 'All' || item.category === categoryFilter

      const matchesStock =
        stockFilter === 'All' ||
        (stockFilter === 'Low Stock' &&
          Number(item.quantity) <= Number(item.lowStockAt)) ||
        (stockFilter === 'In Stock' &&
          Number(item.quantity) > Number(item.lowStockAt))

      return matchesSearch && matchesCategory && matchesStock
    })
  }, [items, search, categoryFilter, stockFilter])

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Reset and close modal
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

  // Add inventory item through backend
  const handleAddItem = async (e) => {
    e.preventDefault()
    setError('')

    if (!householdId) {
      setError('No household found.')
      return
    }

    const quantity = Number(formData.quantity)
    const lowStockAt = Number(formData.lowStockAt)

    if (!formData.name.trim()) {
      setError('Please enter an item name.')
      return
    }

    if (
      formData.quantity === '' ||
      !Number.isFinite(quantity) ||
      quantity < 0
    ) {
      setError('Please enter a valid quantity.')
      return
    }

    if (!formData.unit.trim()) {
      setError('Please enter a unit.')
      return
    }

    if (
      formData.lowStockAt === '' ||
      !Number.isFinite(lowStockAt) ||
      lowStockAt < 0
    ) {
      setError('Please enter a valid low-stock threshold.')
      return
    }

    try {
      setSaving(true)

      const response = await createInventoryItem({
        name: formData.name.trim(),
        quantity,
        unit: formData.unit.trim(),
        category: formData.category,
        location: formData.location.trim(),
        lowStockAt,
        householdId,
      })

      setItems((prev) => [response.inventoryItem, ...prev])
      closeModal()
    } catch (err) {
      setError(err.message || 'Failed to add inventory item.')
    } finally {
      setSaving(false)
    }
  }

  // Update quantity through backend
  const updateQuantity = async (id, change) => {
    const currentItem = items.find((item) => item._id === id)

    if (!currentItem) return

    const newQuantity = Math.max(
      0,
      Number(currentItem.quantity) + change
    )

    try {
      setPageError('')

      const response = await updateInventoryQuantity(id, newQuantity)

      setItems((prev) =>
        prev.map((item) =>
          item._id === id ? response.inventoryItem : item
        )
      )
    } catch (err) {
      setPageError(err.message || 'Failed to update quantity.')
    }
  }

  // Delete inventory item through backend
  const deleteItem = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this item?'
    )

    if (!confirmed) return

    try {
      setPageError('')

      await deleteInventoryItem(id)

      setItems((prev) => prev.filter((item) => item._id !== id))
    } catch (err) {
      setPageError(err.message || 'Failed to delete item.')
    }
  }

  // Category styling
  const getCategoryStyle = (category) => {
    const styles = {
      Groceries: 'bg-green-100 text-green-700',
      Household: 'bg-blue-100 text-blue-700',
      Cleaning: 'bg-purple-100 text-purple-700',
      Other: 'bg-gray-100 text-gray-700',
    }

    return styles[category] || styles.Other
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading inventory...
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Household Inventory
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage and track your household items.
          </p>
        </div>

        <button
          onClick={() => {
            setError('')
            setShowModal(true)
          }}
          disabled={!householdId}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          + Add Item
        </button>
      </div>

      {/* Error message */}
      {pageError && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-red-50 p-4 text-sm text-red-700">
          <span>{pageError}</span>
          <button
            onClick={loadInventory}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {items.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total Quantity</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">
            {totalQuantity}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Low Stock Items</p>
          <p className="mt-2 text-2xl font-bold text-red-600">
            {lowStockItems.length}
          </p>
        </div>
      </div>

      {/* Low stock alert */}
      {lowStockItems.length > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <h3 className="font-semibold text-amber-800">
            Low Stock Alert
          </h3>
          <p className="mt-1 text-sm text-amber-700">
            {lowStockItems.map((item) => item.name).join(', ')}{' '}
            {lowStockItems.length === 1 ? 'is' : 'are'} running low.
          </p>
        </div>
      )}

      {/* Search and filters */}
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search items or locations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="min-w-[200px] flex-1 rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-indigo-500"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="All">All Categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value)}
          className="rounded-lg border border-gray-300 px-4 py-2"
        >
          <option value="All">All Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="In Stock">In Stock</option>
        </select>
      </div>

      {/* Inventory list */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-5">
          <h2 className="font-semibold text-gray-900">
            Inventory Items
          </h2>
        </div>

        {filteredItems.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            {items.length === 0
              ? 'No inventory items yet. Add your first item!'
              : 'No items match your search or filters.'}
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredItems.map((item) => {
              const isLowStock =
                Number(item.quantity) <= Number(item.lowStockAt)

              return (
                <div
                  key={item._id}
                  className="flex flex-wrap items-center justify-between gap-4 p-5"
                >
                  <div className="min-w-[180px] flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {item.name}
                      </h3>

                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getCategoryStyle(
                          item.category
                        )}`}
                      >
                        {item.category}
                      </span>

                      {isLowStock && (
                        <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                          Low Stock
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm text-gray-500">
                      Location: {item.location || 'Not specified'}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      Added by {item.addedBy?.name || 'Unknown'}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item._id, -1)}
                      disabled={Number(item.quantity) <= 0}
                      className="h-8 w-8 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 disabled:opacity-40"
                    >
                      -
                    </button>

                    <div className="min-w-[90px] text-center">
                      <p className="font-semibold text-gray-900">
                        {item.quantity} {item.unit}
                      </p>
                      <p className="text-xs text-gray-400">
                        Quantity
                      </p>
                    </div>

                    <button
                      onClick={() => updateQuantity(item._id, 1)}
                      className="h-8 w-8 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      +
                    </button>

                    <button
                      onClick={() => deleteItem(item._id)}
                      className="ml-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Add item modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                Add Inventory Item
              </h2>

              <button
                onClick={closeModal}
                className="text-2xl text-gray-400 hover:text-gray-700"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Item Name *
                </label>
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rice"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    min="0"
                    step="any"
                    value={formData.quantity}
                    onChange={handleChange}
                    placeholder="e.g. 5"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Unit *
                  </label>
                  <input
                    name="unit"
                    value={formData.unit}
                    onChange={handleChange}
                    placeholder="e.g. kg"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Storage Location
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Kitchen cupboard"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  name="lowStockAt"
                  min="0"
                  step="any"
                  value={formData.lowStockAt}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-indigo-500"
                  required
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Add Item'}
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
