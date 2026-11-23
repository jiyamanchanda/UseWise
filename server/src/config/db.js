
import mongoose from 'mongoose'
import { MONGODB_URI } from './env.js'

const connectDB = async () => {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI is missing in .env')
    }

    await mongoose.connect(MONGODB_URI)

    console.log('MongoDB connected successfully')
  } catch (error) {
    console.error('MongoDB connection failed:', error.message)
    process.exit(1)
  }
}

export default connectDB
