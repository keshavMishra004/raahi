import PricingCalendar from "../models/PricingCalendar.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

// Resolve operatorId safely (cmsAuth should set req.operatorId)
function getOperatorIdFromReq(req) {
	if (req?.operatorId) return req.operatorId;
	if (req?.user && (req.user.operatorId || req.user.id || req.user._id)) return req.user.operatorId || req.user.id || req.user._id;
	try {
		const auth = req?.headers?.authorization || req?.headers?.Authorization;
		if (auth && typeof auth === "string") {
			const [bearer, token] = auth.split(" ");
			if (/^Bearer$/i.test(bearer) && token) {
				const decoded = jwt.verify(token, process.env.JWT_SECRET);
				return decoded?.id || decoded?.userId || decoded?.operatorId || null;
			}
		}
	} catch { /* ignore */ }
	return req?.body?.operatorId || req?.query?.operatorId || null;
}

// GET /api/pricing/calendar/month?month=1-12&year=YYYY&serviceId=...
export async function getMonthlyData(req, res) {
	try {
		const operatorId = getOperatorIdFromReq(req);
		if (!operatorId) return res.status(401).json({ message: "Unauthorized" });

		const month = parseInt(req.query.month, 10);
		const year = parseInt(req.query.year, 10);
		const serviceId = req.query.serviceId;
		if (!month || !year || !serviceId) return res.status(400).json({ message: "Missing month, year, or serviceId" });

		const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
		const end = new Date(Date.UTC(year, month, 0, 23, 59, 59));

		const entries = await PricingCalendar.find({
			operatorId: new mongoose.Types.ObjectId(operatorId),
			serviceId,
			date: { $gte: start, $lte: end }
		}).lean();

		return res.json({ ok: true, entries, meta: { month, year, serviceId } });
	} catch (err) {
		console.error("getMonthlyData:", err);
		return res.status(500).json({ message: "Failed to fetch month data" });
	}
}

// POST /api/pricing/calendar/bulk  { serviceId, entries: [{ date, status?, slots?, booked?, basePrice?, customPrice? }] }
export async function bulkUpdateData(req, res) {
	try {
		const operatorId = getOperatorIdFromReq(req);
		if (!operatorId) return res.status(401).json({ message: "Unauthorized" });

		const { serviceId, entries } = req.body || {};
		if (!serviceId) return res.status(400).json({ message: "Missing serviceId" });
		if (!Array.isArray(entries) || entries.length === 0) return res.status(400).json({ message: "No entries provided" });

		const results = [];
		for (const raw of entries) {
			if (!raw?.date) continue;

			const d = new Date(raw.date);
			const utcDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

			const setDoc = {};
			const unsetDoc = {};

			if (typeof raw.status !== "undefined") setDoc.status = raw.status;
			if (typeof raw.slots !== "undefined") setDoc.slots = Number(raw.slots);
			if (typeof raw.booked !== "undefined") setDoc.booked = Number(raw.booked);
			if (typeof raw.basePrice !== "undefined") setDoc.basePrice = Number(raw.basePrice);

			if (Object.prototype.hasOwnProperty.call(raw, "customPrice")) {
				if (raw.customPrice === null) {
					unsetDoc.customPrice = "";
				} else if (typeof raw.customPrice !== "undefined") {
					setDoc.customPrice = Number(raw.customPrice);
				}
			}

			if (typeof setDoc.slots === "number" && typeof setDoc.booked === "number") {
				setDoc.available = Math.max(0, setDoc.slots - setDoc.booked);
			}

			const insertDefaults = {};
			if (!("status" in setDoc)) insertDefaults.status = "available";
			if (!("slots" in setDoc)) insertDefaults.slots = 5;
			if (!("booked" in setDoc)) insertDefaults.booked = 0;
			if (!("basePrice" in setDoc)) insertDefaults.basePrice = 0;
			const insSlots = ("slots" in setDoc) ? setDoc.slots : insertDefaults.slots;
			const insBooked = ("booked" in setDoc) ? setDoc.booked : insertDefaults.booked;
			// Only set insert default for 'available' if it's not already being set in $set
			if (!("available" in setDoc)) {
				insertDefaults.available = Math.max(
					0,
					(typeof insSlots === "number" ? insSlots : 0) - (typeof insBooked === "number" ? insBooked : 0)
				);
			}

			const query = { operatorId: new mongoose.Types.ObjectId(operatorId), serviceId, date: utcDate };
			const updateOps = { $set: setDoc };
			if (Object.keys(insertDefaults).length) updateOps.$setOnInsert = insertDefaults;
			if (Object.keys(unsetDoc).length) updateOps.$unset = unsetDoc;

			const updated = await PricingCalendar.findOneAndUpdate(query, updateOps, { upsert: true, new: true, setDefaultsOnInsert: true }).lean();
			results.push(updated);
		}

		return res.json({ ok: true, updated: results.length, entries: results });
	} catch (err) {
		console.error("bulkUpdateData:", err);
		return res.status(500).json({ message: "Failed to update calendar data" });
	}
}

// GET /api/pricing/calendar/day?date=YYYY-MM-DD&serviceId=...
export async function getDayData(req, res) {
	try {
		const operatorId = getOperatorIdFromReq(req);
		if (!operatorId) return res.status(401).json({ message: "Unauthorized" });
		const { date, serviceId } = req.query;
		if (!date || !serviceId) return res.status(400).json({ message: "Missing date or serviceId" });
		const d = new Date(date);
		const utcDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
		const entry = await PricingCalendar.findOne({
			operatorId: new mongoose.Types.ObjectId(operatorId),
			serviceId,
			date: utcDate
		}).lean();
		return res.json({ ok: true, entry });
	} catch (err) {
		console.error("getDayData:", err);
		return res.status(500).json({ message: "Failed to fetch day data" });
	}
}

// POST /api/pricing/calendar/bulk-timeslots  { serviceId, entries: [{ date, timeSlots: [{ time, status, slots, booked, basePrice, customPrice }] }] }
export async function bulkUpdateTimeSlots(req, res) {
	try {
		const operatorId = getOperatorIdFromReq(req);
		if (!operatorId) return res.status(401).json({ message: "Unauthorized" });
		const { serviceId, entries } = req.body || {};
		if (!serviceId) return res.status(400).json({ message: "Missing serviceId" });
		if (!Array.isArray(entries) || entries.length === 0) return res.status(400).json({ message: "No entries provided" });

		const results = [];
		for (const item of entries) {
			if (!item?.date) continue;
			const d = new Date(item.date);
			const utcDate = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
			let timeSlots = Array.isArray(item.timeSlots) ? item.timeSlots : [];

			// if disabling timeSlots (empty array), remove field
			let updateOps;
			if (timeSlots.length === 0) {
				updateOps = { $unset: { timeSlots: "" } };
			} else {
				const processed = timeSlots.map(ts => {
					const slots = Number(ts.slots) || 0;
					const booked = Number(ts.booked) || 0;
					return {
						time: String(ts.time).slice(0,5), // HH:MM
						status: ts.status === "blocked" ? "blocked" : "available",
						slots,
						booked,
						available: Math.max(0, slots - booked),
						basePrice: Math.round(Number(ts.basePrice || 0)),
						customPrice: ts.customPrice === "" || ts.customPrice == null
							? undefined
							: Math.round(Number(ts.customPrice))
					};
				});
				updateOps = { $set: { timeSlots: processed } };
			}

			const updated = await PricingCalendar.findOneAndUpdate(
				{
					operatorId: new mongoose.Types.ObjectId(operatorId),
					serviceId,
					date: utcDate
				},
				{
					...updateOps,
					$setOnInsert: {
						status: "available",
						slots: 5,
						booked: 0,
						available: 5,
						basePrice: 0
					}
				},
				{ upsert: true, new: true, setDefaultsOnInsert: true }
			).lean();
			results.push(updated);
		}
		return res.json({ ok: true, updated: results.length, entries: results });
	} catch (err) {
		console.error("bulkUpdateTimeSlots:", err);
		return res.status(500).json({ message: "Failed to update time slots" });
	}
}
