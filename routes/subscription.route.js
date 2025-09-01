import { Router } from "express";
import authorize from "../middleware/auth.middleware.js";
import { createSubscription, getuserSubscriptions } from "../controllers/subscribe.controller.js";

const subscriptionRouter = Router();

subscriptionRouter.post("/", authorize, createSubscription);

subscriptionRouter.get("/", (req, res) => {
    res.send({ title: "Get All Subscriptions" });
});

subscriptionRouter.get("/:id", (req, res) => {
    res.send({ title: `Get Subscription with ID: ${req.params.id}` });
});

subscriptionRouter.put("/:id", (req, res) => {
    res.send({ title: "Subscription updated successfully" });
});

subscriptionRouter.delete("/:id", (req, res) => {
    res.send({ title: "Subscription deleted successfully" });
});

subscriptionRouter.get("/users/:id", authorize, getuserSubscriptions);

subscriptionRouter.delete("/:id/cancel", (req, res) => {
    res.send({ title: `Delete Subscriptions for User with ID: ${req.params.id}` });
});

export default subscriptionRouter;
