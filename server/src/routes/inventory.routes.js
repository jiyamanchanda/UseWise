
import express from 'express'

import {
  createInventoryItem,
  getInventoryItems,
  getInventoryItemById,
  updateInventoryItem,
  updateInventoryQuantity,
  deleteInventoryItem
} from '../controllers/inventory.controller.js'

import protect from '../middleware/auth.middleware.js'

const router = express.Router()

// Create a new inventory item
router.post('/', protect, createInventoryItem)

// Get all inventory items of a household
router.get('/', protect, getInventoryItems)

// Get a single inventory item
router.get('/:id', protect, getInventoryItemById)

// Update inventory item details
router.patch('/:id', protect, updateInventoryItem)

// Update inventory quantity
router.patch('/:id/quantity', protect, updateInventoryQuantity)

// Delete an inventory item
router.delete('/:id', protect, deleteInventoryItem)

export default router
