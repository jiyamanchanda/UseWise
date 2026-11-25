import mongoose from 'mongoose'

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    amount: {
      type: Number,
      required: true,
      min: 0.01
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Groceries',
        'Rent',
        'Electricity',
        'Water',
        'Internet',
        'Transportation',
        'Entertainment',
        'Other'
      ]
    },

    description: {
      type: String,
      trim: true,
      default: ''
    },

    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Household',
      required: true
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    date: {
      type: Date,
      default: Date.now
    },

    splitType: {
      type: String,
      enum: ['equal', 'custom'],
      default: 'equal'
    },

    splitAmong: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },

        share: {
          type: Number,
          required: true,
          min: 0
        }
      }
    ]
  },
  { timestamps: true }
)
const Expense = mongoose.models.Expense ||
  mongoose.model('Expense', expenseSchema)

export default Expense