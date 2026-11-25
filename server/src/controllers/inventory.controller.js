
import Inventory from '../models/inventory.js'
import Household from '../models/household.js'
import mongoose from 'mongoose'

// Allowed inventory categories
const allowedCategories = [
  'Groceries',
  'Household',
  'Cleaning',
  'Other'
]

// Check whether a user belongs to a household
const checkHouseholdMembership = async (householdId, userId) => {
  const household = await Household.findById(householdId)

  if (!household) {
    return { status: 404, message: 'Household not found' }
  }

  const isMember = household.members.some(
    member => member.user.toString() === userId
  )

  if (!isMember) {
    return {
      status: 403,
      message: 'You are not a member of this household'
    }
  }

  return { household }
}


// 1. Create inventory item
export const createInventoryItem = async (req, res) => {
  try {
    const {
      name,
      quantity,
      unit,
      category,
      location,
      lowStockAt,
      householdId
    } = req.body

    // Validate required fields
    if (
      typeof name !== 'string' ||
      !name.trim() ||
      quantity === undefined ||
      quantity === null ||
      quantity === '' ||
      typeof unit !== 'string' ||
      !unit.trim() ||
      !householdId
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, quantity, unit and household ID'
      })
    }

    // Validate household ID
    if (!mongoose.isValidObjectId(householdId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid household ID'
      })
    }

    // Validate quantity
    if (
      typeof quantity !== 'number' &&
      typeof quantity !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a number'
      })
    }

    const itemQuantity = Number(quantity)

    if (!Number.isFinite(itemQuantity) || itemQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a valid non-negative number'
      })
    }

    // Validate category
    const itemCategory = category || 'Other'

    if (!allowedCategories.includes(itemCategory)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid inventory category'
      })
    }

    // Validate location
    if (location !== undefined && typeof location !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Location must be a string'
      })
    }

    // Validate low stock threshold
    if (
      lowStockAt !== undefined &&
      lowStockAt !== null &&
      typeof lowStockAt !== 'number' &&
      typeof lowStockAt !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Low stock threshold must be a number'
      })
    }

    if (lowStockAt === null || lowStockAt === '') {
      return res.status(400).json({
        success: false,
        message: 'Low stock threshold must be non-negative'
      })
    }

    const threshold = lowStockAt === undefined
      ? 1
      : Number(lowStockAt)

    if (!Number.isFinite(threshold) || threshold < 0) {
      return res.status(400).json({
        success: false,
        message: 'Low stock threshold must be non-negative'
      })
    }

    // Check household membership
    const access = await checkHouseholdMembership(
      householdId,
      req.userId
    )

    if (access.status) {
      return res.status(access.status).json({
        success: false,
        message: access.message
      })
    }

    // Create inventory item
    const inventoryItem = await Inventory.create({
      name: name.trim(),
      quantity: itemQuantity,
      unit: unit.trim(),
      category: itemCategory,
      location: location?.trim() || 'Not specified',
      lowStockAt: threshold,
      household: householdId,
      addedBy: req.userId
    })

    const populatedItem = await Inventory.findById(inventoryItem._id)
      .populate('addedBy', 'name email')

    return res.status(201).json({
      success: true,
      message: 'Inventory item added successfully',
      inventoryItem: populatedItem
    })

  } catch (error) {
    console.error('Create inventory error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to add inventory item'
    })
  }
}


// 2. Get all inventory items of a household
export const getInventoryItems = async (req, res) => {
  try {
    const {
      householdId,
      search,
      category,
      stockStatus
    } = req.query

    // Validate search
    if (search !== undefined && typeof search !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Search must be a string'
      })
    }

    if (!householdId) {
      return res.status(400).json({
        success: false,
        message: 'Household ID is required'
      })
    }

    if (!mongoose.isValidObjectId(householdId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid household ID'
      })
    }

    // Check household membership
    const access = await checkHouseholdMembership(
      householdId,
      req.userId
    )

    if (access.status) {
      return res.status(access.status).json({
        success: false,
        message: access.message
      })
    }

    // Build database query
    const query = {
      household: householdId
    }

    // Search by item name
    if (search && search.trim()) {
      const escapedSearch = search.trim().replace(
        /[.*+?^${}()|[\]\\]/g,
        '\\$&'
      )

      query.name = {
        $regex: escapedSearch,
        $options: 'i'
      }
    }

    // Filter by category
    if (category) {
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid inventory category'
        })
      }

      query.category = category
    }

    // Filter by stock status
    if (stockStatus === 'low') {
      query.$expr = {
        $lte: ['$quantity', '$lowStockAt']
      }
    } else if (stockStatus === 'inStock') {
      query.$expr = {
        $gt: ['$quantity', '$lowStockAt']
      }
    } else if (stockStatus) {
      return res.status(400).json({
        success: false,
        message: 'Invalid stock status'
      })
    }

    const inventoryItems = await Inventory.find(query)
      .populate('addedBy', 'name email')
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: inventoryItems.length,
      inventoryItems
    })

  } catch (error) {
    console.error('Get inventory error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory items'
    })
  }
}


// 3. Get a single inventory item
export const getInventoryItemById = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid inventory item ID'
      })
    }

    const inventoryItem = await Inventory.findById(id)
      .populate('addedBy', 'name email')

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      })
    }

    // Check household membership
    const access = await checkHouseholdMembership(
      inventoryItem.household,
      req.userId
    )

    if (access.status) {
      return res.status(access.status).json({
        success: false,
        message: access.message
      })
    }

    return res.status(200).json({
      success: true,
      inventoryItem
    })

  } catch (error) {
    console.error('Get inventory item error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch inventory item'
    })
  }
}


// 4. Update inventory item details
export const updateInventoryItem = async (req, res) => {
  try {
    const { id } = req.params

    const {
      name,
      unit,
      category,
      location,
      lowStockAt
    } = req.body

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid inventory item ID'
      })
    }

    const inventoryItem = await Inventory.findById(id)

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      })
    }

    // Check household membership
    const access = await checkHouseholdMembership(
      inventoryItem.household,
      req.userId
    )

    if (access.status) {
      return res.status(access.status).json({
        success: false,
        message: access.message
      })
    }

    // Only allow these fields to be updated
    const allowedFields = [
      'name',
      'unit',
      'category',
      'location',
      'lowStockAt'
    ]

    const invalidFields = Object.keys(req.body).filter(
      field => !allowedFields.includes(field)
    )

    if (invalidFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid fields in update request',
        invalidFields
      })
    }

    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least one field to update'
      })
    }

    if (name !== undefined) {
      if (typeof name !== 'string' || !name.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Item name cannot be empty'
        })
      }

      inventoryItem.name = name.trim()
    }

    if (unit !== undefined) {
      if (typeof unit !== 'string' || !unit.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Unit cannot be empty'
        })
      }

      inventoryItem.unit = unit.trim()
    }

    if (category !== undefined) {
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid inventory category'
        })
      }

      inventoryItem.category = category
    }

    if (location !== undefined) {
      if (typeof location !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Location must be a string'
        })
      }

      inventoryItem.location = location.trim()
    }

    if (lowStockAt !== undefined) {
      if (
        lowStockAt === null ||
        lowStockAt === '' ||
        (typeof lowStockAt !== 'number' && typeof lowStockAt !== 'string')
      ) {
        return res.status(400).json({
          success: false,
          message: 'Low stock threshold must be a valid number'
        })
      }

      const threshold = Number(lowStockAt)

      if (!Number.isFinite(threshold) || threshold < 0) {
        return res.status(400).json({
          success: false,
          message: 'Low stock threshold must be non-negative'
        })
      }

      inventoryItem.lowStockAt = threshold
    }

    await inventoryItem.save()

    const updatedItem = await Inventory.findById(id)
      .populate('addedBy', 'name email')

    return res.status(200).json({
      success: true,
      message: 'Inventory item updated successfully',
      inventoryItem: updatedItem
    })

  } catch (error) {
    console.error('Update inventory error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to update inventory item'
    })
  }
}


// 5. Update inventory quantity
export const updateInventoryQuantity = async (req, res) => {
  try {
    const { id } = req.params
    const { quantity } = req.body

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid inventory item ID'
      })
    }

    if (
      quantity === undefined ||
      quantity === null ||
      quantity === ''
    ) {
      return res.status(400).json({
        success: false,
        message: 'Quantity is required'
      })
    }

    if (
      typeof quantity !== 'number' &&
      typeof quantity !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a number'
      })
    }

    const newQuantity = Number(quantity)

    if (!Number.isFinite(newQuantity) || newQuantity < 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a valid non-negative number'
      })
    }

    const inventoryItem = await Inventory.findById(id)

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      })
    }

    // Check household membership
    const access = await checkHouseholdMembership(
      inventoryItem.household,
      req.userId
    )

    if (access.status) {
      return res.status(access.status).json({
        success: false,
        message: access.message
      })
    }

    inventoryItem.quantity = newQuantity

    await inventoryItem.save()

    const updatedItem = await Inventory.findById(id)
      .populate('addedBy', 'name email')

    return res.status(200).json({
      success: true,
      message: 'Inventory quantity updated successfully',
      inventoryItem: updatedItem
    })

  } catch (error) {
    console.error('Update quantity error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to update inventory quantity'
    })
  }
}


// 6. Delete inventory item
export const deleteInventoryItem = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid inventory item ID'
      })
    }

    const inventoryItem = await Inventory.findById(id)

    if (!inventoryItem) {
      return res.status(404).json({
        success: false,
        message: 'Inventory item not found'
      })
    }

    // Check household membership
    const access = await checkHouseholdMembership(
      inventoryItem.household,
      req.userId
    )

    if (access.status) {
      return res.status(access.status).json({
        success: false,
        message: access.message
      })
    }

    await Inventory.findByIdAndDelete(id)

    return res.status(200).json({
      success: true,
      message: 'Inventory item deleted successfully'
    })

  } catch (error) {
    console.error('Delete inventory error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to delete inventory item'
    })
  }
}
