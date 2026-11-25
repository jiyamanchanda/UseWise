import express from 'express'
import { createExpense ,getExpenses, getExpenseById,updateExpense, deleteExpense} from '../controllers/expense.controller.js'
import protect from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/', protect, createExpense)
router.get('/', protect, getExpenses)
router.get('/:id', protect, getExpenseById)
router.patch('/:id', protect, updateExpense)
router.delete('/:id', protect, deleteExpense)
export default router