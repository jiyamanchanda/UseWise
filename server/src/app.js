import express from 'express'
import cors from 'cors'
import { CLIENT_URL } from './config/env.js'

const app = express()

// Allow requests from our frontend
app.use(
  cors({
    origin: CLIENT_URL,
  })
)

// Allow Express to read JSON request bodies
app.use(express.json())

// Health-check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'UseWise API is running',
  })
})

export default app