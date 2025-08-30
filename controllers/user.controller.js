import User from "../model/user.model.js"

export const getUsers = async (req, res, next) => {
    try {

        const users = await User.find().select("-password") // Exclude password field
        res.status(200).send({
            success: true, message: "Users retrieved successfully",
            data: users
        })
    } catch (error) {
        next(error)
    }
}
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select("-password") // Exclude password field
        if (!user) {
            return res.status(404).send({ message: "User not found" })
        }
        res.status(200).send({
            success: true, message: "User retrieved successfully",
            data: user
        })
    } catch (error) {
        next(error)
    }
}