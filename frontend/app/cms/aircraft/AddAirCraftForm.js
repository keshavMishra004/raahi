"use client";
import { useState } from "react";
import api from "@/utils/axios";

export default function AddAircraftForm({ onClose }) {
  const [form, setForm] = useState({
    registration: "",
    model: "",
    type: "",
    crewCapacity: "",
    passengerCapacity: "",
    base: "",
    status: "In Service"
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setError("");
    try {
      await api.post("/cms/aircraft", {
        ...form,
        crewCapacity: Number(form.crewCapacity),
        passengerCapacity: Number(form.passengerCapacity)
      });
      setForm({
        registration: "",
        model: "",
        type: "",
        crewCapacity: "",
        passengerCapacity: "",
        base: "",
        status: "In Service"
      });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add aircraft");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-[500px]">
        <h2 className="text-lg font-semibold mb-4">Add New Aircraft</h2>
        {error && <div className="text-red-600 mb-2">{error}</div>}
        <div className="grid grid-cols-2 gap-4">
          <input name="registration" placeholder="Registration #" onChange={handleChange} className="border p-2" />
          <input name="model" placeholder="Aircraft Model" onChange={handleChange} className="border p-2" />
          <input name="type" placeholder="Type" onChange={handleChange} className="border p-2" />
          <input name="crewCapacity" type="number" placeholder="Crew Capacity" onChange={handleChange} className="border p-2" />
          <input name="passengerCapacity" type="number" placeholder="Passenger Capacity" onChange={handleChange} className="border p-2" />
          <input name="base" placeholder="Base (ICAO)" onChange={handleChange} className="border p-2" />
          <select name="status" onChange={handleChange} className="border p-2 col-span-2">
            <option>In Service</option>
            <option>Under Maintenance</option>
            <option>Retired</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
          <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
        </div>
      </div>
    </div>
  );
}
