import express from "express"
import { PORT } from "./config/env.js"
import authRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import subscriptionRouter from "./routes/subscription.route.js"
import connectDB from "./database/db.js"
import errorHandler from "./middleware/error.middleware.js"
import cookieParser from "cookie-parser"
import arcjetMiddleware from "./middleware/arcjet.middleware.js"
import workflowRouter from "./routes/workflow.route.js"

const app = express();

// Middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false })) // Parse URL-encoded bodies
app.use(express.static("public")) // Serve static files
app.use(cookieParser())
// app.use(arcjetMiddleware)

// Use routes
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/workflow", workflowRouter)

// Error handling middleware
app.use(errorHandler)

app.listen(PORT, async () => {
    try {
        await connectDB();
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.error("Error connecting to the database:", error);
    }
})

export default app