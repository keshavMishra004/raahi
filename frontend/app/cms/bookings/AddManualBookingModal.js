"use client";
import { useState } from "react";
import api from "@/utils/axios";

export default function AddManualBookingModal({ onClose, onSuccess }) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    customerName: "",
    email: "",
    customerPhone: "",
    company: "",
    service: "",
    route: "",
    date: "",
    time: "",
    aircraft: "",
    pax: 1,
    operationalNotes: "",
    amount: "",
    extraCareNotes: "",
  });

  const update = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.customerName.trim()) e.customerName = "Required";
      if (form.customerPhone && !/^\d*$/.test(form.customerPhone)) e.customerPhone = "Digits only";
    }
    if (s === 2) {
      if (!form.service) e.service = "Required";
      if (!form.date) e.date = "Required";
      if (!form.time) e.time = "Required";
      if (!form.pax || Number(form.pax) < 1) e.pax = "Minimum 1";
    }
    if (s === 3) {
      if (form.amount && !/^\d*\.?\d*$/.test(String(form.amount))) e.amount = "Digits only";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
  };
  const back = () => setStep((s) => Math.max(1, s - 1));

  const handleSubmit = async () => {
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      setStep(1);
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        ...form,
        pax: Number(form.pax),
        amount: form.amount ? Number(form.amount) : 0,
      };
      await api.post("/cms/bookings", payload);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error("create booking", err);
      alert(err?.response?.data?.message || "Failed to create booking");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-[720px] max-w-full p-6 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Add Manual Booking — Step {step}/3</h3>
          <button className="text-sm text-gray-500" onClick={onClose}>Close</button>
        </div>

        <div>
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Full Name *</label>
                <input value={form.customerName} onChange={(e) => update("customerName", e.target.value)} className="w-full border rounded px-3 py-2" />
                {errors.customerName && <span className="text-red-500 text-sm">{errors.customerName}</span>}
              </div>
              <div>
                <label className="text-sm">Email</label>
                <input value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
              <div>
                <label className="text-sm">Phone</label>
                <input value={form.customerPhone} onChange={(e) => update("customerPhone", e.target.value)} className="w-full border rounded px-3 py-2" />
                {errors.customerPhone && <span className="text-red-500 text-sm">{errors.customerPhone}</span>}
              </div>
              <div>
                <label className="text-sm">Company</label>
                <input value={form.company} onChange={(e) => update("company", e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm">Service *</label>
                <select value={form.service} onChange={(e) => update("service", e.target.value)} className="w-full border rounded px-3 py-2">
                  <option value="">Select</option>
                  <option>Air Ambulance</option>
                  <option>Private Charter</option>
                  <option>Pilgrimage</option>
                  <option>Udaan Flight</option>
                  <option>Aerial Service</option>
                </select>
                {errors.service && <span className="text-red-500 text-sm">{errors.service}</span>}
              </div>

              <div>
                <label className="text-sm">Route</label>
                <input value={form.route} onChange={(e) => update("route", e.target.value)} className="w-full border rounded px-3 py-2" placeholder={form.service === "Air Ambulance" ? "Not Applicable" : ""} />
              </div>

              <div>
                <label className="text-sm">Date *</label>
                <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="w-full border rounded px-3 py-2" />
                {errors.date && <span className="text-red-500 text-sm">{errors.date}</span>}
              </div>

              <div>
                <label className="text-sm">Time *</label>
                <input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} className="w-full border rounded px-3 py-2" />
                {errors.time && <span className="text-red-500 text-sm">{errors.time}</span>}
              </div>

              <div>
                <label className="text-sm">Assign Aircraft</label>
                <input value={form.aircraft} onChange={(e) => update("aircraft", e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>

              <div>
                <label className="text-sm">PAX *</label>
                <input type="number" min="1" value={form.pax} onChange={(e) => update("pax", e.target.value)} className="w-full border rounded px-3 py-2" />
                {errors.pax && <span className="text-red-500 text-sm">{errors.pax}</span>}
              </div>

              <div className="col-span-2">
                <label className="text-sm">Operational Notes</label>
                <textarea value={form.operationalNotes} onChange={(e) => update("operationalNotes", e.target.value)} className="w-full border rounded px-3 py-2" />
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h4 className="font-semibold mb-2">Review & Confirm</h4>
              <div className="grid grid-cols-2 gap-3">
                <SummaryRow label="Customer" value={form.customerName} />
                <SummaryRow label="Email" value={form.email} />
                <SummaryRow label="Phone" value={form.customerPhone} />
                <SummaryRow label="Company" value={form.company} />
                <SummaryRow label="Service" value={form.service} />
                <SummaryRow label="Route" value={form.route} />
                <SummaryRow label="Date" value={form.date} />
                <SummaryRow label="Time" value={form.time} />
                <SummaryRow label="PAX" value={form.pax} />
                <div className="col-span-2">
                  <label className="text-sm">Amount</label>
                  <input value={form.amount} onChange={(e) => update("amount", e.target.value)} className="w-full border rounded px-3 py-2" />
                  {errors.amount && <span className="text-red-500 text-sm">{errors.amount}</span>}
                </div>
                <div className="col-span-2">
                  <label className="text-sm">Extra Care Notes</label>
                  <textarea value={form.extraCareNotes} onChange={(e) => update("extraCareNotes", e.target.value)} className="w-full border rounded px-3 py-2" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div>
            {step > 1 && <button type="button" onClick={back} className="px-4 py-2 mr-2 border rounded">Back</button>}
          </div>

          <div className="flex items-center gap-2">
            {step < 3 && <button type="button" onClick={next} className="px-4 py-2 bg-blue-600 text-white rounded">Next</button>}
            {step === 3 && <button type="button" onClick={handleSubmit} disabled={submitting} className="px-4 py-2 bg-green-600 text-white rounded">{submitting ? "Saving..." : "Confirm Booking"}</button>}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-sm text-gray-500">{label}</span>
      <span className="text-sm font-medium">{value || "-"}</span>
    </div>
  );
}
