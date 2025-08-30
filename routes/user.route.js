import { Router } from "express";
import { getUserById, getUsers } from "../controllers/user.controller.js";
import authorize from "../middleware/auth.middleware.js";

const userRouter = Router();



userRouter.get("/", getUsers);

userRouter.get("/:id", authorize, getUserById);

userRouter.post("/", (req, res) => {
    res.send({ title: "User created successfully" });
});

userRouter.put("/:id", (req, res) => {
    res.send({ title: "User updated successfully" });
});

userRouter.delete("/:id", (req, res) => {
    // Handle deleting user
    res.send({ title: "User deleted successfully" });
});

export default userRouter;
