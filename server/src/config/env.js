import 'dotenv/config'

const PORT = process.env.PORT || 5000

const CLIENT_URL =
  process.env.CLIENT_URL || 'http://localhost:5173'

export { PORT, CLIENT_URL }