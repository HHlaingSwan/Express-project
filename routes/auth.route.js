import { Router } from "express";
import { login, logout, register } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/register", register);

authRouter.post("/log-in", login);

authRouter.post("/log-out", logout);

export default authRouter;
