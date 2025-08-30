import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
        index: true
    },
    name: {
        type: String,
        required: [true, "Subscription name is required"],
        trim: true,
        minLength: 3,
        maxLength: 100
    },
    price: {
        type: Number,
        required: [true, "Subscription price is required"],
        min: [0, "Subscription price must be positive"],
        validate: {
            validator: Number.isFinite,
            message: "Price must be a number"
        }
    },
    currency: {
        type: String,
        enum: ["USD", "EUR", "GBP", "INR"],
        default: "USD"
    },
    plan: {
        type: String,
        enum: ["free", "premium"],
        default: "free"
    },
    status: {
        type: String,
        enum: ["active", "expired", "canceled"],
        default: "active"
    },
    startDate: {
        type: Date,
        default: Date.now,
        validate: {
            validator: function (value) {
                return value >= Date.now();
            },
            message: "Start date must be now or in the future"
        }
    },
    endDate: {
        type: Date,
        validate: {
            validator: function (value) {
                return !value || value > this.startDate;
            },
            message: "End date must be after start date"
        }
    },
    description: {
        type: String,
        trim: true,
        maxLength: 500
    }
}, {
    timestamps: true
});

subscriptionSchema.index({ user: 1, name: 1 }, { unique: true }); // Prevent duplicate subscriptions per user

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
