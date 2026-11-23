import express from 'express'

import {
  register,
  login
} from '../controllers/auth.controller.js'

import { getMe } from '../controllers/user.controller.js'

import protect from '../middleware/auth.middleware.js'

const router = express.Router()

// Register user
router.post('/register', register)

// Login user
router.post('/login', login)

// Get logged-in user (protected)
router.get('/me', protect, getMe)

export default router