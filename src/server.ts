import dotenv from "dotenv"
import app from "./app"
import connect from "./db"

dotenv.config()

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await connect()
    console.log("✅ Connected to MongoDB")

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("❌ Failed to connect to MongoDB:", error)
    process.exit(1)
  }
}

startServer()
