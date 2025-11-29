"use client";
import React, { useEffect, useMemo, useState } from "react";
import "../css/policy.css";
import api from "../../../utils/axios";

// Services (remove Global)
const SERVICES = [
	{ label: "Fly Bharat", value: "68cfd9098270da3ebbc66e82" },
	{ label: "Aerial Service", value: "68cfd9098270da3ebbc66e83" },
	{ label: "Pilgrimage", value: "68cfd90a8270da3ebbc66e84" },
	{ label: "Private Charter", value: "68cfd90a8270da3ebbc66e85" },
	{ label: "Empty Leg", value: "68cfd90a8270da3ebbc66e86" },
	{ label: "Air Ambulance", value: "68cfd90a8270da3ebbc66e87" }
];

const PRICING_TABS = [
	{ key: "calendar", label: "Calendar" },
	{ key: "rules", label: "Pricing Rules" },
	{ key: "availability", label: "Availability Settings" }
];

const MODES = [
	{ key: "single", label: "Single" },
	{ key: "bulk", label: "Bulk Edit" },
	{ key: "block", label: "Block Dates" }
];

const DAY_LABELS = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

export default function PricingPage() {
	// Tabs
	const [activeTab, setActiveTab] = useState("calendar");

	// Service & month
	const today = useMemo(() => new Date(), []);
	const [selectedServiceId, setSelectedServiceId] = useState(SERVICES[0].value);
	const [monthView, setMonthView] = useState({
		month: today.getMonth() + 1, // 1-12
		year: today.getFullYear()
	});

	// Calendar state
	const [mode, setMode] = useState("single");
	const [selectedDates, setSelectedDates] = useState([]); // array of YYYY-MM-DD
	const [calendarData, setCalendarData] = useState({});   // key: date -> record
	const [isDragging, setIsDragging] = useState(false);
	// Cache pricing/availability per service + month (YYYY-MM) so switching restores previous data
	const [serviceCalendars, setServiceCalendars] = useState({}); // { "<serviceId>::YYYY-MM": { ...calendarData } }

	// Form (applies to selected date(s))
	const [form, setForm] = useState({
		status: "available",
		slots: 5,
		booked: 0,
		available: 5,
		basePrice: 0,      // major units (visual)
		customPrice: ""    // blank => unset
	});
	// Multiplier for quick price adjustments (applies on Save)
	const [multiplier, setMultiplier] = useState("1");
	// Time slot editing state
	const [timeSlotsEnabled, setTimeSlotsEnabled] = useState(false);
	const [timeSlotRows, setTimeSlotRows] = useState([]); // { time, slots, booked, basePrice, customPrice, status }
	function resetTimeSlots() { setTimeSlotRows([]); setTimeSlotsEnabled(false); }

	// Helper to build per-service, per-month cache key
	function calKey(serviceId, mv) {
		return `${serviceId}::${mv.year}-${String(mv.month).padStart(2, "0")}`;
	}

	// Fetch data (when month/service changes)
	useEffect(() => {
		if (activeTab === "calendar") {
			// restore cached month view (if any) before any fetch
			const key = calKey(selectedServiceId, monthView);
			setCalendarData(serviceCalendars[key] || {});
			loadMonth();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedServiceId, monthView, activeTab]);

	// ---------------- Data Helpers ----------------
	function dateKey(d) {
		const dt = new Date(d);
		return dt.toISOString().slice(0, 10);
	}

	function normalizeDateKey(iso) {
		return iso;
	}

	async function loadMonth() {
		try {
			const params = { month: monthView.month, year: monthView.year, serviceId: selectedServiceId };
			const res = await api.get("/api/pricing/calendar/month", { params });
			const entries = res.data?.entries || [];
			const map = {};
			for (const it of entries) {
				const key = new Date(it.date).toISOString().slice(0, 10);
				map[key] = { ...it, source: "specific" };
			}
			setCalendarData(map);
			setServiceCalendars(prev => ({ ...prev, [calKey(selectedServiceId, monthView)]: map }));
		} catch (e) {
			console.warn("Month fetch failed", e);
			setCalendarData({});
		}
	}

	function buildMonthDays() {
		const { month, year } = monthView;
		const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
		const out = [];
		for (let i = 1; i <= daysInMonth; i++) {
			const dt = new Date(Date.UTC(year, month - 1, i));
			const key = dt.toISOString().slice(0, 10);
			out.push({ key, day: i, record: calendarData[key] });
		}
		return out;
	}

	// ---------------- Calendar Interactions ----------------
	function changeMonth(delta) {
		// Persist current month data for current service before navigating
		setServiceCalendars(prev => ({ ...prev, [calKey(selectedServiceId, monthView)]: calendarData }));
		setMonthView(prev => {
			let m = prev.month + delta;
			let y = prev.year;
			if (m < 1) { m = 12; y--; }
			if (m > 12) { m = 1; y++; }
			return { month: m, year: y };
		});
		setSelectedDates([]);
	}

	// Change service and persist current data for previous service/month
	function changeService(nextId) {
		setServiceCalendars(prev => ({ ...prev, [calKey(selectedServiceId, monthView)]: calendarData }));
		setSelectedServiceId(nextId);
		setSelectedDates([]);
	}

	function toggleDate(key) {
		if (mode === "single") {
			setSelectedDates([key]);
			loadFormFromDate(key);
		} else {
			setSelectedDates(prev =>
				prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]
			);
		}
	}
	// Drag-select (bulk / block modes)
	function startDragSelect(key) {
		if (mode === "single") {
			toggleDate(key);
			return;
		}
		setIsDragging(true);
		setSelectedDates(prev => (
			prev.includes(key) ? prev.filter(d => d !== key) : [...prev, key]
		));
	}
	function dragOverDate(key) {
		if (!isDragging) return;
		if (mode === "bulk" || mode === "block") {
			setSelectedDates(prev => (prev.includes(key) ? prev : [...prev, key]));
		}
	}
	function endDrag() {
		if (isDragging) setIsDragging(false);
	}
	// Global mouseup to end drag even if cursor leaves grid
	useEffect(() => {
		const handleUp = () => setIsDragging(false);
		window.addEventListener("mouseup", handleUp);
		return () => window.removeEventListener("mouseup", handleUp);
	}, []);

	function handleModeChange(nextMode) {
		setMode(nextMode);
		setSelectedDates([]);
		// auto-set status for block mode
		setForm(prev => ({
			...prev,
			status: nextMode === "block" ? "blocked" : "available"
		}));
	}

	function loadFormFromDate(key) {
		const rec = calendarData[key];
		if (!rec) return;
		setForm({
			status: rec.status || "available",
			slots: rec.slots ?? 5,
			booked: rec.booked ?? 0,
			available: rec.available ?? Math.max(0, (rec.slots ?? 5) - (rec.booked ?? 0)),
			basePrice: typeof rec.basePrice === "number" ? (rec.basePrice / 100) : 0,
			customPrice: typeof rec.customPrice === "number" ? (rec.customPrice / 100) : ""
		});
		// load time slots for single date (if present)
		const timeRec = calendarData[key];
		if (timeRec?.timeSlots && Array.isArray(timeRec.timeSlots) && mode === "single") {
			setTimeSlotsEnabled(timeRec.timeSlots.length > 0);
			setTimeSlotRows(timeRec.timeSlots.map(ts => ({
				time: ts.time,
				status: ts.status || "available",
				slots: ts.slots ?? 0,
				booked: ts.booked ?? 0,
				basePrice: typeof ts.basePrice === "number" ? (ts.basePrice / 100) : 0,
				customPrice: typeof ts.customPrice === "number" ? (ts.customPrice / 100) : ""
			})));
		} else {
			resetTimeSlots();
		}
	}

	// Time slot row helpers
	function addTimeSlotRow() {
		setTimeSlotsEnabled(true);
		setTimeSlotRows(r => [...r, { time: "09:00", status: "available", slots: 5, booked: 0, basePrice: 0, customPrice: "" }]);
	}
	function updateTimeSlotRow(idx, field, value) {
		setTimeSlotRows(rows => {
			const copy = [...rows];
			copy[idx] = { ...copy[idx], [field]: value };
			// auto available compute when slots/booked change (visual only)
			if (field === "slots" || field === "booked") {
				const s = Number(copy[idx].slots);
				const b = Number(copy[idx].booked);
				copy[idx].available = Math.max(0, s - b);
			}
			return copy;
		});
	}
	function removeTimeSlotRow(idx) {
		setTimeSlotRows(rows => {
			const copy = rows.filter((_, i) => i !== idx);
			if (copy.length === 0) setTimeSlotsEnabled(false);
			return copy;
		});
	}
	function toggleTimeSlotsEnabled(val) {
		setTimeSlotsEnabled(val);
		if (!val) resetTimeSlots();
		if (val && timeSlotRows.length === 0) addTimeSlotRow();
	}

	function handleFormChange(field, value) {
		setForm(prev => {
			const next = { ...prev, [field]: value };
			// Auto compute available if slots or booked changes
			if (field === "slots" || field === "booked") {
				const s = Number(next.slots);
				const b = Number(next.booked);
				if (!Number.isNaN(s) && !Number.isNaN(b)) {
					next.available = Math.max(0, s - b);
				}
			}
			return next;
		});
	}

	function applyChanges() {
		if (selectedDates.length === 0) return;
		const updates = {};
		const multiplierNum = Number(multiplier);
		const useMultiplier = !Number.isNaN(multiplierNum) && multiplierNum > 0 && multiplierNum !== 1;

		for (const d of selectedDates) {
			const existing = calendarData[d] || {};
			// Preserve existing base if not explicitly set in form to avoid wiping basePrice
			const formBaseCents = Math.round(Number(form.basePrice) * 100);
			const basePriceCents = Number.isFinite(formBaseCents) && formBaseCents > 0
				? formBaseCents
				: (typeof existing.basePrice === "number" ? existing.basePrice : 0);
			
			// Start from form custom (if provided), else existing custom, else fallback to base for this date
			let customPriceCents = form.customPrice === ""
				? (typeof existing.customPrice === "number" ? existing.customPrice : undefined)
				: Math.round(Number(form.customPrice) * 100);
			
			// If multiplier is active, compute effective reference price per date and set as customPrice
			if (useMultiplier && form.status !== "blocked") {
				const ref = (typeof existing.customPrice === "number")
					? existing.customPrice
					: (typeof existing.basePrice === "number" ? existing.basePrice : basePriceCents);
				customPriceCents = Math.round(ref * multiplierNum);
			}

			updates[d] = {
				...existing,
				status: form.status,
				slots: Number(form.slots),
				booked: Number(form.booked),
				available: Number(form.available),
				basePrice: basePriceCents,
				customPrice: customPriceCents,
				serviceId: selectedServiceId,
				source: selectedServiceId ? "specific" : "global"
			};
		}
		// optimistic UI + cache
		setCalendarData(prev => {
			const next = { ...prev, ...updates };
			setServiceCalendars(sc => ({ ...sc, [calKey(selectedServiceId, monthView)]: next }));
			return next;
		});
		// persist to backend and refresh normalized data
		const payload = {
			serviceId: selectedServiceId,
			entries: selectedDates.map(d => {
				const existing = calendarData[d] || {};
				const formBaseCents = Math.round(Number(form.basePrice) * 100);
				const basePriceCents = Number.isFinite(formBaseCents) && formBaseCents > 0
					? formBaseCents
					: (typeof existing.basePrice === "number" ? existing.basePrice : 0);
				let entry = {
					date: d,
					status: form.status,
					slots: Number(form.slots),
					booked: Number(form.booked),
					basePrice: basePriceCents
				};
				// customPrice: if user typed, use it; else if multiplier active, set computed value; else omit
				if (form.customPrice !== "") {
					entry.customPrice = Math.round(Number(form.customPrice) * 100);
				} else if (useMultiplier) {
					const ref = (typeof existing.customPrice === "number")
						? existing.customPrice
						: (typeof existing.basePrice === "number" ? existing.basePrice : basePriceCents);
					entry.customPrice = Math.round(ref * multiplierNum);
				}
				return entry;
			})
		};
		api.post("/api/pricing/calendar/bulk", payload)
			.then(() => loadMonth())
			.catch(err => console.warn("Bulk save failed", err));
	}

	async function applyTimeSlotsChanges() {
		if (selectedDates.length === 0) return;
		// Prepare payload; if disabled send empty array to unset
		const payload = {
			serviceId: selectedServiceId,
			entries: selectedDates.map(d => ({
				date: d,
				timeSlots: timeSlotsEnabled ? timeSlotRows.map(r => ({
					time: r.time,
					status: r.status === "blocked" ? "blocked" : "available",
					slots: Number(r.slots),
					booked: Number(r.booked),
					basePrice: Math.round(Number(r.basePrice) * 100),
					customPrice: r.customPrice === "" ? undefined : Math.round(Number(r.customPrice) * 100)
				})) : []
			}))
		};
		try {
			await api.post("/api/pricing/calendar/timeslots/bulk", payload);
			await loadMonth();
		} catch (err) {
			console.warn("Time slots save failed", err);
		}
	}

	// Reset selection when mode changes
	useEffect(() => {
		setSelectedDates([]);
	}, [selectedServiceId]);

	// ---------------- Tab Content Renderers ----------------
	function renderCalendarTab() {
		const days = buildMonthDays();
		// compute leading blanks for alignment
		const { month, year } = monthView;
		const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay(); // 0 = Sun, 1 = Mon, ...
		// Shift so Monday=0, Tuesday=1, ... Sunday=6
		const startOffset = (firstDay + 6) % 7;
		const blanks = Array.from({ length: startOffset }, (_, i) => ({ blank: true, key: `blank-${i}` }));
		const allCells = [...blanks, ...days];
		return (
			<div className="space-y-6">
				{/* Month navigation */}
				<div className="flex items-center gap-3">
					<button
						type="button"
						className="border rounded px-2 py-1 text-sm"
						onClick={() => changeMonth(-1)}
						aria-label="Previous Month"
					>&lt;</button>
					<span className="font-semibold text-sm">
						{new Date(Date.UTC(monthView.year, monthView.month - 1, 1)).toLocaleString("default", { month: "long" })} {monthView.year}
					</span>
					<button
						type="button"
						className="border rounded px-2 py-1 text-sm"
						onClick={() => changeMonth(1)}
						aria-label="Next Month"
					>&gt;</button>
				</div>

				<div className="flex flex-col md:flex-row gap-6">
					{/* Calendar (left) */}
					<div className="space-y-2 w-full max-w-[480px]">
						<div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-gray-600">
							{DAY_LABELS.map(d => <div key={d}>{d}</div>)}
						</div>
						<div
							className="grid grid-cols-7 gap-1 text-xs select-none"
							onMouseLeave={endDrag}
							onMouseUp={endDrag}
						>
							{allCells.map(c => {
								if (c.blank) return <div key={c.key} className="h-14" />;
								const selected = selectedDates.includes(c.key);
								const rec = c.record;
								const isBlocked = rec?.status === "blocked";
								const availableSeats = isBlocked
									? 0
									: (rec?.available ?? Math.max(0, (rec?.slots ?? 0) - (rec?.booked ?? 0)));
								const priceCents = rec?.customPrice ?? rec?.basePrice;
								const hasSlots = Array.isArray(rec?.timeSlots) && rec.timeSlots.length > 0;

								const bgClasses = isBlocked ? "bg-gray-200 text-gray-600" : (selected ? "bg-blue-100" : "bg-white");
								const borderBase = isBlocked && !selected
									? "border-gray-400"
									: (selected ? "border-blue-500" : "border-gray-500");
								const selectedOutline = selected ? "ring-2 ring-blue-500 ring-offset-1" : "";
								const hoverState = !selected ? "hover:border-gray-500 transition-colors" : "";

								return (
									<button
										key={c.key}
										type="button"
										onMouseDown={() => startDragSelect(c.key)}
										onMouseEnter={() => dragOverDate(c.key)}
										className={`h-14 px-1 py-1 border rounded flex flex-col items-start justify-start gap-0.5 ${bgClasses} ${borderBase} ${selectedOutline} ${hoverState}`}
										title={c.key}
									>
										<span className="text-[11px] font-semibold">{c.day}</span>
										{rec && (
											<>
												{isBlocked ? (
													<span className="text-[10px] leading-tight font-medium">Blocked</span>
												) : (
													<span className="text-[10px] leading-tight text-green-700">{availableSeats} seats</span>
												)}
												{!isBlocked && typeof priceCents === "number" && (
													<span className="text-[10px]">₹ {(priceCents / 100).toFixed(2)}</span>
												)}
												{hasSlots && (
													<span className="text-[9px] px-1 rounded bg-[#054972] text-white">TS</span>
												)}
											</>
										)}
									</button>
								);
							})}
						</div>
						<div className="text-[11px] text-gray-500">
							Selected: {selectedDates.length === 0 ? "None" : selectedDates.join(", ")}
						</div>
					</div>

					{/* Mode selection (right) */}
					<div className="flex flex-col gap-4">
						<div className="space-y-2">
							<p className="text-xs font-semibold text-gray-700">Selection Mode</p>
							<div className="flex flex-col gap-1">
								{MODES.map(m => (
									<label key={m.key} className="flex items-center gap-2 text-xs cursor-pointer">
										<input
											type="radio"
											name="mode"
											value={m.key}
											checked={mode === m.key}
											onChange={() => handleModeChange(m.key)}
										/>
										<span>{m.label}</span>
									</label>
								))}
							</div>
							<p className="text-[10px] text-gray-500">
								Block Dates marks selected days as unavailable.
							</p>
						</div>
					</div>
				</div>

				{/* Edit Panel (single apply button here) */}
				<div className="policy-panel">
					<div className="policy-panel-head">
						<h3 className="text-lg font-semibold text-[#054972]">Edit Date Settings</h3>
					</div>
					<div className="policy-panel-body space-y-4">
						{/* Status / Slots */}
						{/*
							Apply grey styling to disabled fields when status === "blocked"
						*/}
						{/** helper class for blocked status */}
						{/* We inline logic below instead of separate function for brevity */}
						<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
							<div>
								<label className="text-xs font-medium text-gray-600 block">Status</label>
								<select
									className={`mt-1 w-full border rounded px-2 py-1 ${mode === "block" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
									value={form.status}
									onChange={e => handleFormChange("status", e.target.value)}
									disabled={mode === "block"}
								>
									<option value="available">Available</option>
									<option value="blocked">Blocked</option>
								</select>
								{mode === "block" && <p className="mt-1 text-[10px] text-gray-500">Blocked by mode</p>}
							</div>
							<div>
								<label className="text-xs font-medium text-gray-600 block">Slots</label>
								<input
									type="number"
									min={0}
									className={`mt-1 w-full border rounded px-2 py-1 ${form.status === "blocked" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
									value={form.slots}
									onChange={e => handleFormChange("slots", e.target.value)}
									disabled={form.status === "blocked"}
								/>
							</div>
							<div>
								<label className="text-xs font-medium text-gray-600 block">Booked</label>
								<input
									type="number"
									min={0}
									className={`mt-1 w-full border rounded px-2 py-1 ${form.status === "blocked" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
									value={form.booked}
									onChange={e => handleFormChange("booked", e.target.value)}
									disabled={form.status === "blocked"}
								/>
							</div>
							<div>
								<label className="text-xs font-medium text-gray-600 block">Available</label>
								<input
									type="number"
									min={0}
									className={`mt-1 w-full border rounded px-2 py-1 ${form.status === "blocked" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
									value={form.available}
									readOnly
									disabled={form.status === "blocked"}
								/>
							</div>
						</div>
						{/* Pricing */}
						<div>
							<h4 className="text-sm font-semibold text-gray-700 mb-2">Price</h4>
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<div>
									<label className="text-xs font-medium text-gray-600 block">Base Price (₹)</label>
									<input
										type="number"
										min={0}
										className={`mt-1 w-full border rounded px-2 py-1 ${form.status === "blocked" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
										value={form.basePrice}
										onChange={e => handleFormChange("basePrice", e.target.value)}
										disabled={form.status === "blocked"}
									/>
								</div>
								<div>
									<label className="text-xs font-medium text-gray-600 block">Custom Price Override (₹)</label>
									<div className="mt-1 flex items-center gap-2">
										<input
											type="number"
											min={0}
											className={`w-full border rounded px-2 py-1 ${form.status === "blocked" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
											value={form.customPrice}
											onChange={e => handleFormChange("customPrice", e.target.value)}
											placeholder="(blank = use base)"
											disabled={form.status === "blocked"}
										/>
										{/* Multiplier next to custom price */}
										<input
											type="number"
											min={0}
											step="0.01"
											className={`w-24 border rounded px-2 py-1 text-xs ${form.status === "blocked" ? "bg-gray-100 text-gray-500 cursor-not-allowed" : "bg-white"}`}
											value={multiplier}
											onChange={(e) => setMultiplier(e.target.value)}
											title="Price Multiplier (e.g. 1.2 = +20%)"
											disabled={form.status === "blocked"}
										/>
									</div>
									<p className="text-[10px] text-gray-500 mt-1">Multiplier applies on Save to selected dates and stores as custom price.</p>
								</div>
								<div className="flex items-end">
									<button
										type="button"
										onClick={applyChanges}
										disabled={selectedDates.length === 0}
										className="w-full px-3 py-2 rounded bg-[#054972] text-white text-sm disabled:opacity-50"
									>Save</button>
								</div>
							</div>
							<p className="text-[11px] text-gray-500 mt-2">
								Prices stored in cents server-side. Custom price overrides base. Global fills gaps if no specific entry.
							</p>
						</div>

						{/* Time Slots Section */}
						<div className="mt-6 border-t pt-4">
							<h4 className="text-sm font-semibold text-gray-700 mb-2">Time Slots</h4>
							<label className="flex items-center gap-2 text-xs mb-2 cursor-pointer">
								<input
									type="checkbox"
									checked={timeSlotsEnabled}
									onChange={e => toggleTimeSlotsEnabled(e.target.checked)}
								/>
								<span>Enable time-based booking for selected date(s)</span>
							</label>
							{timeSlotsEnabled && (
								<div className="space-y-3">
									<div className="grid grid-cols-6 gap-2 text-[11px] font-medium text-gray-600">
										<div>Time</div>
										<div>Slots</div>
										<div>Booked</div>
										<div>Base ₹</div>
										<div>Custom ₹</div>
										<div>Status</div>
									</div>
									{timeSlotRows.map((r, idx) => (
										<div key={idx} className="grid grid-cols-6 gap-2">
											<input
												type="time"
												value={r.time}
												onChange={e => updateTimeSlotRow(idx, "time", e.target.value)}
												className="border rounded px-1 py-1 text-[11px]"
											/>
											<input
												type="number"
												min={0}
												value={r.slots}
												onChange={e => updateTimeSlotRow(idx, "slots", e.target.value)}
												className="border rounded px-1 py-1 text-[11px]"
											/>
											<input
												type="number"
												min={0}
												value={r.booked}
												onChange={e => updateTimeSlotRow(idx, "booked", e.target.value)}
												className="border rounded px-1 py-1 text-[11px]"
											/>
											<input
												type="number"
												min={0}
												value={r.basePrice}
												onChange={e => updateTimeSlotRow(idx, "basePrice", e.target.value)}
												className="border rounded px-1 py-1 text-[11px]"
											/>
											<input
												type="number"
												min={0}
												value={r.customPrice}
												onChange={e => updateTimeSlotRow(idx, "customPrice", e.target.value)}
												placeholder="(opt)"
												className="border rounded px-1 py-1 text-[11px]"
											/>
											<select
												value={r.status}
												onChange={e => updateTimeSlotRow(idx, "status", e.target.value)}
												className="border rounded px-1 py-1 text-[11px]"
											>
												<option value="available">Available</option>
												<option value="blocked">Blocked</option>
											</select>
											<div className="col-span-6 text-right">
												<button
													type="button"
													onClick={() => removeTimeSlotRow(idx)}
													className="text-[10px] text-red-600"
												>Remove</button>
											</div>
										</div>
									))}
									<div className="flex items-center justify-between">
										<button
											type="button"
											onClick={addTimeSlotRow}
											className="text-xs px-2 py-1 border rounded bg-white"
										>Add Slot</button>
										<button
											type="button"
											disabled={selectedDates.length === 0}
											onClick={applyTimeSlotsChanges}
											className="text-xs px-3 py-1 rounded bg-[#054972] text-white disabled:opacity-50"
										>Save Time Slots</button>
									</div>
									<p className="text-[10px] text-gray-500">
										Saving replaces time slots for all selected dates. Leave disabled to use whole-day pricing.
									</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	function renderPricingRulesTab() {
		return (
			<div className="policy-panel">
				<div className="policy-panel-head">
					<h3 className="text-lg font-semibold text-[#054972]">Pricing Rules (Placeholder)</h3>
				</div>
				<div className="policy-panel-body space-y-4 text-sm text-gray-600">
					<p>Define future automation (e.g. weekend multipliers, seasonal adjustments). This tab is a placeholder pending specification.</p>
					<p>Selected Service: {selectedServiceId === null ? "Global (Default)" : selectedServiceId}</p>
				</div>
			</div>
		);
	}

	function renderAvailabilitySettingsTab() {
		return (
			<div className="policy-panel">
				<div className="policy-panel-head">
					<h3 className="text-lg font-semibold text-[#054972]">Availability Settings (Placeholder)</h3>
				</div>
				<div className="policy-panel-body space-y-4 text-sm text-gray-600">
					<p>Configure rolling windows, lead time requirements, blackout patterns, etc. Placeholder for future enhancements.</p>
					<p>Selected Service: {selectedServiceId === null ? "Global (Default)" : selectedServiceId}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="policy-container py-8 px-6">
			<div className="max-w-6xl mx-auto">
				<h1 className="policy-title">Pricing Management</h1>
				<p className="policy-desc mb-6">
					Manage day-level pricing, blocking and availability per service.
				</p>
				<div className="policy-tabs mb-4">
					{PRICING_TABS.map(t => (
						<button
							key={t.key}
							onClick={() => { setActiveTab(t.key); setSelectedDates([]); }}
							className={`policy-tab-btn ${activeTab === t.key ? "active" : ""}`}
						>{t.label}</button>
					))}
				</div>
				{activeTab === "calendar" && (
					<div className="mb-6">
						<label className="block text-xs font-medium text-gray-600 mb-1">Service</label>
						<select
							className="border rounded px-3 py-2 w-full max-w-xs"
							value={selectedServiceId}
							onChange={e => changeService(e.target.value)}
						>
							{SERVICES.map(s => (
								<option key={s.value} value={s.value}>{s.label}</option>
							))}
						</select>
					</div>
				)}
				<div className="space-y-6">
					{activeTab === "calendar" && renderCalendarTab()}
					{activeTab === "rules" && renderPricingRulesTab()}
					{activeTab === "availability" && renderAvailabilitySettingsTab()}
				</div>
			</div>
		</div>
	);
}