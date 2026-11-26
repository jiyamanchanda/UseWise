import express from 'express'

import {
  createHousehold,
  getHouseholds,
  getHouseholdById,
  addMember,
  removeMember,
  updateHousehold,
  leaveHousehold,
  joinHouseholdByCode
} from '../controllers/household.controller.js'

import protect from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/', protect, createHousehold)
router.get('/', protect, getHouseholds)
router.post('/join', protect, joinHouseholdByCode)
router.get('/:id', protect, getHouseholdById)
router.post('/:id/members', protect, addMember)
router.delete('/:id/members/:memberId', protect, removeMember)
router.patch('/:id', protect, updateHousehold)
router.delete('/:id/leave', protect, leaveHousehold)
export default router