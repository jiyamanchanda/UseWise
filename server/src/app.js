import express from 'express'
import cors from 'cors'
import { CLIENT_URL } from './config/env.js'
import authRoutes from './routes/auth.routes.js'
import householdRoutes from './routes/household.routes.js'
import expenseRoutes from './routes/expense.routes.js'    
import inventoryRoutes from './routes/inventory.routes.js'

const app = express()

// Allow requests from our frontend
app.use(
  cors({
    origin: CLIENT_URL,
  })
)

// Allow Express to read JSON request bodies
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/households', householdRoutes)
app.use('/api/expenses', expenseRoutes)
app.use('/api/inventory', inventoryRoutes)

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'UseWise API is running',
  })
})

export default app