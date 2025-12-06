import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema({
	startTime: { type: String, required: true }, // "HH:MM"
	endTime: { type: String, required: true },   // "HH:MM"
	status: { type: String, enum: ["available", "blocked"], default: "available" },
	slots: { type: Number, default: 0 },
	booked: { type: Number, default: 0 },
	available: { type: Number, default: 0 },
	basePrice: { type: Number, default: 0 },   // cents
	customPrice: { type: Number }              // cents
}, { _id: false });

const schema = new mongoose.Schema({
	operatorId: { type: mongoose.Schema.Types.ObjectId, ref: "Operator", required: true },
	serviceId: { type: String, required: true },
	date: { type: Date, required: true }, // UTC midnight

	status: { type: String, enum: ["available", "blocked"], default: "available" },

	slots: { type: Number, default: 5 },
	booked: { type: Number, default: 0 },
	available: { type: Number, default: 5 },

	basePrice: { type: Number, default: 0 }, // cents
	customPrice: { type: Number }            // cents (optional)
}, { timestamps: true });

schema.index({ operatorId: 1, serviceId: 1, date: 1 }, { unique: true });

schema.pre("validate", function (next) {
	if (this.date) {
		const d = new Date(this.date);
		this.date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
	}
	next();
});

schema.pre("save", function (next) {
	const s = typeof this.slots === "number" ? this.slots : 0;
	const b = typeof this.booked === "number" ? this.booked : 0;
	if (this.isModified("slots") || this.isModified("booked") || typeof this.available === "undefined") {
		this.available = Math.max(0, s - b);
	}
	next();
});

schema.add({ timeSlots: [ timeSlotSchema ] });

const PricingCalendar = mongoose.model("PricingCalendar", schema);
export default PricingCalendar;
