import express from "express"
import cors from "cors"
import mongoose from "mongoose"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.js"
import menuRoutes from "./routes/menu.js"
import { errorHandler } from "./middleware/errorHandler.js"
import morgan from "morgan";
import bodyParser from "body-parser";





dotenv.config()

const app = express()

// Middleware
app.use(
  cors(
    // {
      // origin: "https://public2-gqyq.onrender.com:5173", // Replace with your frontend URL
      // credentials: true,
      // }
      
    ),
  )
app.use(morgan("dev")); // Logs requests in a concise format
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//This is the added logging middleware


// Routes
app.use("/api/auth", authRoutes)
app.use("/api/menu", menuRoutes)

// Error handling middleware
app.use(errorHandler)
app.get("/api", (req, res) => {
  res.send("API is running....")
})

app.all("*", (req, res) => {
  res.send("invalid path")
})
// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB connected successfully")
  } catch (error) {
    console.error("MongoDB connection error:", error)
    process.exit(1)
  }
}

connectDB()

const PORT = process.env.PORT || 80

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

export default app

