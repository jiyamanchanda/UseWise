
import mongoose from 'mongoose'

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    quantity: {
      type: Number,
      required: true,
      min: 0
    },

    unit: {
      type: String,
      required: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      enum: [
        'Groceries',
        'Household',
        'Cleaning',
        'Other'
      ],
      default: 'Other'
    },

    location: {
      type: String,
      trim: true,
      default: 'Not specified'
    },

    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    lowStockAt: {
      type: Number,
      default: 1,
      min: 0
    },

    household: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Household',
      required: true
    }
  },
  { timestamps: true }
)

const Inventory = mongoose.models.Inventory ||
  mongoose.model('Inventory', inventorySchema)

export default Inventory
