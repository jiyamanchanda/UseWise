import 'dotenv/config'

const PORT = process.env.PORT || 5000

const CLIENT_URL =
  process.env.CLIENT_URL || 'http://localhost:5173'


const MONGODB_URI = process.env.MONGODB_URI

export { PORT, CLIENT_URL, MONGODB_URI }