import { JWT_SECRET } from "../config/env.js";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

const authorize = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).send({ message: "Unauthorized" });
        }
        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password"); // <-- Use userId
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ message: "Unauthorized" });
    }
}

export default authorize;
