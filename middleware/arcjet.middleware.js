import { aj } from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
    try {
        const decision = await aj.protect(req, { requested: 5 }); // Deduct 5 tokens from the bucket
        console.log("Arcjet decision", decision);

        if (decision.isDenied()) {
            if (decision.reason.isRateLimit()) {
                res.writeHead(429, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Too Many Requests" }));
            } else if (decision.reason.isBot()) {
                res.writeHead(403, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "No bots allowed" }));
            } else {
                res.writeHead(403, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ error: "Forbidden" }));
            }
        } else if (decision.ip.isHosting()) {
            // Requests from hosting IPs are likely from bots, so they can usually be
            // blocked. However, consider your use case - if this is an API endpoint
            // then hosting IPs might be legitimate.
            // https://docs.arcjet.com/blueprints/vpn-proxy-detection
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Forbidden" }));
        } else if (decision.results.some(isSpoofedBot)) {
            // Paid Arcjet accounts include additional verification checks using IP data.
            // Verification isn't always possible, so we recommend checking the decision
            // separately.
            // https://docs.arcjet.com/bot-protection/reference#bot-verification
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Forbidden" }));
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ message: "Hello World" }));
        }
    } catch (error) {
        console.error("Arcjet middleware error:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Internal Server Error" }));
    }
}

export default arcjetMiddleware;
