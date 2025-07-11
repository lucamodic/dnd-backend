import dotenv from "dotenv"
dotenv.config()
import app from "./app"
import supabase from "./db"

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    const { error } = await supabase.from("admin").select("id").limit(1)
    if (error) throw error

    console.log("✅ Connected to Supabase")

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error("❌ Failed to connect to Supabase:", error)
    process.exit(1)
  }
}

startServer()
