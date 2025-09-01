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
        enum: ["free", "premium", "gift"],
        default: "free"
    },
    status: {
        type: String,
        enum: ["active", "expired", "canceled"],
        default: "active"
    },
    startDate: {
        type: Date,
        default: Date.now, // Uses user input if provided, otherwise defaults to now
        validate: {
            validator: function (value) {
                return value <= Date.now();
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
    },
    duration: {
        type: String,
        enum: ["1d", "3d", "7d", "30d", "365d"],
        required: true
    }
}, {
    timestamps: true
});

// Auto-calculate endDate before saving
subscriptionSchema.pre("save", function (next) {
    if (this.isModified("startDate") || this.isModified("duration") || !this.endDate) {
        const durations = {
            "1d": 1,
            "3d": 3,
            "7d": 7,
            "30d": 30,
            "365d": 365
        };
        const days = durations[this.duration] || 0;
        this.endDate = new Date(this.startDate.getTime() + days * 24 * 60 * 60 * 1000);
    }
    next();
});

subscriptionSchema.index({ user: 1, name: 1 }, { unique: true }); // Prevent duplicate subscriptions per user

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
