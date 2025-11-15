import mongoose from "mongoose";

/**
 * Per-operator, per-service (or global), per-day pricing & availability.
 * Pricing stored in cents (integer). customPrice overrides basePrice if set.
 * Unique per (operatorId, serviceId, date).
 */
const pricingCalendarSchema = new mongoose.Schema({
	operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Operator", required: true },
	serviceId: { type: String, default: null }, // null => Global (Default)
	date: { type: Date, required: true },       // store at UTC midnight for uniqueness
	status: {
		type: String,
		enum: ["available", "blocked"],
		default: "available"
	},
	slots: { type: Number, default: 5 },
	booked: { type: Number, default: 0 },
	available: { type: Number, default: 5 }, // convenience cache (slots - booked)
	basePrice: { type: Number, required: true, default: 0 }, // cents
	customPrice: { type: Number }, // cents (optional override)
}, { timestamps: true });

// Unique compound index
pricingCalendarSchema.index({ operatorId: 1, serviceId: 1, date: 1 }, { unique: true });

// Normalize date & keep availability consistent
pricingCalendarSchema.pre("validate", function (next) {
	if (this.date) {
		const d = new Date(this.date);
		this.date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
	}
	next();
});

pricingCalendarSchema.pre("save", function (next) {
	if (typeof this.available === "undefined" || this.isModified("slots") || this.isModified("booked")) {
		this.available = Math.max(0, (this.slots ?? 0) - (this.booked ?? 0));
	}
	next();
});

const PricingCalendar = mongoose.model("PricingCalendar", pricingCalendarSchema);
export default PricingCalendar;
