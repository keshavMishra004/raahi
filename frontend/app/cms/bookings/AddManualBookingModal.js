"use client";
import { useState } from "react";
import api from "@/utils/axios";
import { X } from "lucide-react";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-elevation">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-neutral-200 bg-gradient-to-r from-sky-50 via-neutral-50 to-transparent flex-shrink-0">
          <div>
            <h2 className="text-2xl font-bold text-sky-900">Add Manual Booking</h2>
            <p className="text-sm text-neutral-600 mt-1">Step {step} of 3</p>
          </div>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-600 transition-colors p-2 hover:bg-neutral-100 rounded-lg flex-shrink-0">
            <X size={20} />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="px-8 pt-6 pb-4 flex justify-center items-center gap-6 flex-shrink-0">
          {[1, 2, 3].map((s, i) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold text-sm transition-all duration-300 flex-shrink-0 ${
                s < step ? "bg-status-success text-white shadow-md" : 
                s === step ? "bg-gradient-to-br from-sky-600 to-sky-500 text-white shadow-lg scale-110" : 
                "bg-neutral-200 text-neutral-600"
              }`}>
                {s < step ? "✓" : s}
              </div>
              {i < 2 && <div className={`h-1 w-12 rounded-full transition-all duration-300 flex-shrink-0 ${s < step ? "bg-status-success" : "bg-neutral-300"}`}></div>}
            </div>
          ))}
        </div>

        {/* Body - Scrollable */}
        <form onSubmit={(e) => e.preventDefault()} className="flex-1 overflow-y-auto px-8 py-6">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-semibold text-sky-900 mb-6">Customer Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Full Name *</label>
                  <input value={form.customerName} onChange={(e) => update("customerName", e.target.value)} className={`w-full h-10 px-4 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm ${errors.customerName ? "border-status-error bg-status-error-light" : "border-neutral-300 bg-neutral-50 hover:bg-white"}`} placeholder="Enter full name" />
                  {errors.customerName && <span className="text-xs text-status-error mt-1 block font-medium">* {errors.customerName}</span>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Email</label>
                  <input value={form.email} onChange={(e) => update("email", e.target.value)} className="w-full h-10 px-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm bg-neutral-50 hover:bg-white" placeholder="user@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Phone</label>
                  <input value={form.customerPhone} onChange={(e) => update("customerPhone", e.target.value)} className={`w-full h-10 px-4 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm ${errors.customerPhone ? "border-status-error bg-status-error-light" : "border-neutral-300 bg-neutral-50 hover:bg-white"}`} placeholder="+91 9876543210" />
                  {errors.customerPhone && <span className="text-xs text-status-error mt-1 block font-medium">* {errors.customerPhone}</span>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Company</label>
                  <input value={form.company} onChange={(e) => update("company", e.target.value)} className="w-full h-10 px-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm bg-neutral-50 hover:bg-white" placeholder="Company name (optional)" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="text-lg font-semibold text-sky-900 mb-6">Flight Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Service *</label>
                  <select value={form.service} onChange={(e) => update("service", e.target.value)} className={`w-full h-10 px-4 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm ${errors.service ? "border-status-error bg-status-error-light" : "border-neutral-300 bg-neutral-50 hover:bg-white"}`}>
                    <option value="">Select service type</option>
                    <option>Air Ambulance</option>
                    <option>Private Charter</option>
                    <option>Pilgrimage</option>
                    <option>Udaan Flight</option>
                    <option>Aerial Service</option>
                  </select>
                  {errors.service && <span className="text-xs text-status-error mt-1 block font-medium">* {errors.service}</span>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Route</label>
                  <input value={form.route} onChange={(e) => update("route", e.target.value)} className="w-full h-10 px-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm bg-neutral-50 hover:bg-white" placeholder="e.g., DEL → BOM" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className={`w-full h-10 px-4 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm ${errors.date ? "border-status-error bg-status-error-light" : "border-neutral-300 bg-neutral-50 hover:bg-white"}`} />
                  {errors.date && <span className="text-xs text-status-error mt-1 block font-medium">* {errors.date}</span>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Time *</label>
                  <input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} className={`w-full h-10 px-4 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm ${errors.time ? "border-status-error bg-status-error-light" : "border-neutral-300 bg-neutral-50 hover:bg-white"}`} />
                  {errors.time && <span className="text-xs text-status-error mt-1 block font-medium">* {errors.time}</span>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Aircraft</label>
                  <input value={form.aircraft} onChange={(e) => update("aircraft", e.target.value)} className="w-full h-10 px-4 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm bg-neutral-50 hover:bg-white" placeholder="Aircraft registration" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Passengers *</label>
                  <input type="number" min="1" value={form.pax} onChange={(e) => update("pax", e.target.value)} className={`w-full h-10 px-4 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm ${errors.pax ? "border-status-error bg-status-error-light" : "border-neutral-300 bg-neutral-50 hover:bg-white"}`} />
                  {errors.pax && <span className="text-xs text-status-error mt-1 block font-medium">* {errors.pax}</span>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">Operational Notes</label>
                  <textarea value={form.operationalNotes} onChange={(e) => update("operationalNotes", e.target.value)} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm bg-neutral-50 hover:bg-white resize-none" style={{ minHeight: "100px" }} placeholder="Add any special notes or requirements..." />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="text-lg font-semibold text-sky-900 mb-6">Review & Confirm</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <SummaryRow label="Customer" value={form.customerName} />
                <SummaryRow label="Email" value={form.email} />
                <SummaryRow label="Phone" value={form.customerPhone} />
                <SummaryRow label="Service" value={form.service} />
                <SummaryRow label="Route" value={form.route} />
                <SummaryRow label="Date" value={new Date(form.date).toLocaleDateString()} />
                <SummaryRow label="Time" value={form.time} />
                <SummaryRow label="Aircraft" value={form.aircraft} />
                <SummaryRow label="Passengers" value={form.pax} />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Amount (₹)</label>
                <input value={form.amount} onChange={(e) => update("amount", e.target.value)} className={`w-full h-10 px-4 border rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm ${errors.amount ? "border-status-error bg-status-error-light" : "border-neutral-300 bg-neutral-50 hover:bg-white"}`} placeholder="0.00" />
                {errors.amount && <span className="text-xs text-status-error mt-1 block font-medium">* {errors.amount}</span>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">Extra Care Notes</label>
                <textarea value={form.extraCareNotes} onChange={(e) => update("extraCareNotes", e.target.value)} className="w-full px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent outline-none transition-all text-sm bg-neutral-50 hover:bg-white resize-none" style={{ minHeight: "80px" }} placeholder="Special handling, medical requirements, etc..." />
              </div>
            </div>
          )}
        </form>

        {/* Footer - Fixed */}
        <div className="flex justify-between items-center px-8 py-6 border-t border-neutral-200 bg-neutral-50 rounded-b-2xl gap-3 flex-shrink-0 h-20">
          {step > 1 && <button onClick={back} className="px-6 py-2.5 h-10 border-2 border-neutral-300 text-neutral-700 rounded-lg font-medium hover:bg-neutral-100 hover:border-neutral-400 transition-all duration-200 flex items-center justify-center whitespace-nowrap">← Back</button>}
          <div className="flex-1"></div>
          {step < 3 && <button onClick={next} className="px-6 py-2.5 h-10 bg-gradient-to-r from-sky-600 to-sky-500 text-white rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center whitespace-nowrap">Next →</button>}
          {step === 3 && <button onClick={handleSubmit} disabled={submitting} className="px-6 py-2.5 h-10 bg-gradient-to-r from-status-success to-green-500 text-white rounded-lg font-medium hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center whitespace-nowrap">{submitting ? "Saving..." : "✓ Confirm"}</button>}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="p-4 bg-sky-50 rounded-lg border border-sky-200 hover:border-sky-300 hover:shadow-sm transition-all min-h-20 flex flex-col justify-center">
      <div className="text-xs uppercase font-bold text-sky-700 tracking-wider mb-1">{label}</div>
      <div className="text-base font-semibold text-sky-900 break-words">{value || "—"}</div>
    </div>
  );
}
