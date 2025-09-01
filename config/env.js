import { config } from "dotenv";

config({
    path: `.env.${process.env.NODE_ENV || "development"}.local`
})

export const { PORT, MONGODB_URI, NODE_ENV, JWT_SECRET, JWT_EXPIRES_IN, ARCJET_KEY, ARCJET_ENV, QSTASH_URL, QSTASH_TOKEN, SERVER_URL } = process.env;