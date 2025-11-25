import dotenv from "dotenv"
dotenv.config()
import app from "./app"
import supabase from "./db"

const PORT = process.env.PORT || 3000
const isVercel = !!process.env.VERCEL

// Vercel serverless entrypoint: export the Express handler.
export default app

// Local dev/server mode only.
if (!isVercel) {
  ;(async function startServer() {
    try {
      const { error } = await supabase.from("user").select("id").limit(1)
      if (error) throw error

      console.log("Connected to Supabase")

      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`)
      })
    } catch (error) {
      console.error("Failed to connect to Supabase:", error)
      process.exit(1)
    }
  })()
}