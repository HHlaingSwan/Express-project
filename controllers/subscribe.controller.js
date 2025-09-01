import { SERVER_URL } from "../config/env.js";
import { workflowClient } from "../config/upstash.js";
import Subscription from "../model/subscribe.model.js";

export const createSubscription = async (req, res, next) => {
    try {
        const subscription = await Subscription.create({
            ...req.body,
            user: req.user._id
        });
        workflowClient.trigger({
            url: `${SERVER_URL}`
        });
        res.status(201).json({ success: true, message: "Subscription created", data: subscription });
    } catch (error) {
        next(error);
    }
};

export const getuserSubscriptions = async (req, res, next) => {
    try {

        if (req.user._id.toString() !== req.params.id) {
            return res.status(403).json({ success: false, message: "Unauthorized access" });
        }
        const subscriptions = await Subscription.find({ user: req.params.id });
        res.status(200).json({ success: true, data: subscriptions });
    } catch (error) {
        next(error);
    }
}
