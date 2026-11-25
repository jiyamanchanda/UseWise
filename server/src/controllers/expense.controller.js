import Expense from '../models/expense.js'
import Household from '../models/household.js'
import mongoose from 'mongoose'

export const createExpense = async (req, res) => {
  try {
    const {
      title,
      amount,
      category,
      description,
      householdId,
      date
    } = req.body

    // Validate required fields
    if (!title || !amount || !category || !householdId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      })
    }

    // Validate amount
    const expenseAmount = Number(amount)

    if (!Number.isFinite(expenseAmount) || expenseAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero'
      })
    }

    // Check household
    const household = await Household.findById(householdId)

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      })
    }

    // Check membership
    const isMember = household.members.some(
      member => member.user.toString() === req.userId
    )

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this household'
      })
    }

    // Get all household members
    const memberIds = household.members.map(
      member => member.user.toString()
    )

    // Calculate equal shares in paise to avoid rounding errors
    const totalPaise = Math.round(expenseAmount * 100)
    const baseShare = Math.floor(totalPaise / memberIds.length)
    const remainder = totalPaise % memberIds.length

    const splitAmong = memberIds.map((userId, index) => ({
      user: userId,
      share: (baseShare + (index < remainder ? 1 : 0)) / 100
    }))

    // Create expense
    const expense = await Expense.create({
      title: title.trim(),
      amount: totalPaise / 100,
      category,
      description,
      household: householdId,
      paidBy: req.userId,
      date: date || Date.now(),
      splitType: 'equal',
      splitAmong
    })

    return res.status(201).json({
      success: true,
      message: 'Expense created successfully',
      expense
    })

  } catch (error) {
    console.error('Create expense error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to create expense'
    })
  }
}


export const getExpenses = async (req, res) => {
  try {
    const { householdId } = req.query

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

    const household = await Household.findById(householdId)

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      })
    }

    const isMember = household.members.some(
      member => member.user.toString() === req.userId
    )

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this household'
      })
    }

    const expenses = await Expense.find({
      household: householdId
    })
      .populate('paidBy', 'name email')
      .populate('splitAmong.user', 'name email')
      .sort({ date: -1 })

    return res.status(200).json({
      success: true,
      count: expenses.length,
      expenses
    })

  } catch (error) {
    console.error('Get expenses error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch expenses'
    })
  }
}


export const getExpenseById = async (req, res) => {
  try {
    const { id } = req.params

    // Validate expense ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      })
    }

    // Find expense
    const expense = await Expense.findById(id)
      .populate('paidBy', 'name email')
      .populate('splitAmong.user', 'name email')

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      })
    }

    // Check household
    const household = await Household.findById(expense.household)

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      })
    }

    // Check membership
    const isMember = household.members.some(
      member => member.user.toString() === req.userId
    )

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this expense'
      })
    }

    return res.status(200).json({
      success: true,
      expense
    })

  } catch (error) {
    console.error('Get expense error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to fetch expense'
    })
  }
}


export const updateExpense = async (req, res) => {
  try {
    const { id } = req.params
    const { title, amount, category, description, date } = req.body

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      })
    }

    const expense = await Expense.findById(id)

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      })
    }

    const household = await Household.findById(expense.household)

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      })
    }

    const isMember = household.members.some(
      member => member.user.toString() === req.userId
    )

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to update this expense'
      })
    }

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Title cannot be empty'
        })
      }
      expense.title = title.trim()
    }

    if (category !== undefined) {
      const allowedCategories = [
        'Groceries', 'Rent', 'Electricity', 'Water',
        'Internet', 'Transportation', 'Entertainment', 'Other'
      ]

      if (!allowedCategories.includes(category)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid expense category'
        })
      }
      expense.category = category
    }

    if (description !== undefined) {
      expense.description = description
    }

    if (date !== undefined) {
      const parsedDate = new Date(date)

      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid expense date'
        })
      }
      expense.date = parsedDate
    }

    if (amount !== undefined) {
      const newAmount = Number(amount)

      if (!Number.isFinite(newAmount) || newAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than zero'
        })
      }

      const totalPaise = Math.round(newAmount * 100)

      if (expense.splitType === 'equal') {
        const memberIds = expense.splitAmong.map(
          item => item.user.toString()
        )

        if (memberIds.length === 0) {
          return res.status(400).json({
            success: false,
            message: 'No split members found'
          })
        }

        const baseShare = Math.floor(totalPaise / memberIds.length)
        const remainder = totalPaise % memberIds.length

        expense.splitAmong = memberIds.map((userId, index) => ({
          user: userId,
          share: (baseShare + (index < remainder ? 1 : 0)) / 100
        }))
      } else {
        return res.status(400).json({
          success: false,
          message: 'Custom split amount updates require recalculating custom shares'
        })
      }

      expense.amount = totalPaise / 100
    }

    await expense.save()

    return res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      expense
    })

  } catch (error) {
    console.error('Update expense error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to update expense'
    })
  }
}


export const deleteExpense = async (req, res) => {
  try {
    const { id } = req.params

    // Validate expense ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      })
    }

    // Find expense
    const expense = await Expense.findById(id)

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      })
    }

    // Find household
    const household = await Household.findById(expense.household)

    if (!household) {
      return res.status(404).json({
        success: false,
        message: 'Household not found'
      })
    }

    // Check membership
    const member = household.members.find(
      member => member.user.toString() === req.userId
    )

    if (!member) {
      return res.status(403).json({
        success: false,
        message: 'You are not a member of this household'
      })
    }

    // Only payer or admin can delete
    const isPayer = expense.paidBy.toString() === req.userId
    const isAdmin = member.role === 'admin'

    if (!isPayer && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Only the payer or household admin can delete this expense'
      })
    }

    await Expense.findByIdAndDelete(id)

    return res.status(200).json({
      success: true,
      message: 'Expense deleted successfully'
    })

  } catch (error) {
    console.error('Delete expense error:', error.message)

    return res.status(500).json({
      success: false,
      message: 'Failed to delete expense'
    })
  }
}