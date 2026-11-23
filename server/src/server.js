import app from './app.js'
import { PORT } from './config/env.js'

app.listen(PORT, () => {
  console.log(`UseWise server running on port ${PORT}`)
})