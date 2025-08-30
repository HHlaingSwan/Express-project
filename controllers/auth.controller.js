import mongoose from "mongoose"
import User from "../model/user.model.js"
import bcrypt from "bcryptjs"
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/env.js"
import jwt from "jsonwebtoken"


export const register = async (req, res, next) => {
    // Handle user registration
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const { name, email, password } = req.body
        // check if user exist
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(409).send({ message: "User already exists" })
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new User({ name, email, password: hashedPassword })
        await newUser.save({ session }) // <-- Save the user to the database
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

        await session.commitTransaction()
        session.endSession()
        res.status(201).send({
            success: true, message: "User created successfully",
            data: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                token
            }
        })
    } catch (error) {
        await session.abortTransaction()
        next(error)
    } finally {
        session.endSession()
    }
}

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).send({ message: "Invalid email or password" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid email or password" })
        }

        // Exclude password from response
        const { password: pwd, ...userWithoutPassword } = user.toObject()

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
        res.status(200).send({
            success: true, message: "User logged in successfully",
            data: {
                user: userWithoutPassword,
                token
            }
        })
    } catch (error) {
        next(error)
    }
}

export const logout = async (req, res, next) => {
    try {
        // Invalidate the user's token
        const token = req.headers.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).send({ message: "Unauthorized" })
        }

        // Here you can implement token invalidation logic (e.g., blacklist the token)

        res.status(200).send({
            success: true, message: "User logged out successfully"
        })
    } catch (error) {
        next(error)
    }
}
