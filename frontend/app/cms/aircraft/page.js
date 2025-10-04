"use client";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import AddAircraftForm from "./AddAirCraftForm";

export default function AircraftPage() {
  const [aircrafts, setAircrafts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchAircrafts = async () => {
    const { data } = await api.get("/cms/aircrafts");
    setAircrafts(data.aircrafts || []);
  };

  useEffect(() => { fetchAircrafts(); }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Aircraft Fleet Management</h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add New Aircraft
        </button>
      </div>

      <table className="w-full border-collapse bg-white shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 border">Registration</th>
            <th className="p-3 border">Model</th>
            <th className="p-3 border">Type</th>
            <th className="p-3 border">Capacity</th>
            <th className="p-3 border">Base</th>
            <th className="p-3 border">Status</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {aircrafts.map((air) => (
            <tr key={air._id} className="text-center border-t">
              <td className="p-3">{air.registration}</td>
              <td className="p-3">{air.model}</td>
              <td className="p-3">{air.type}</td>
              <td className="p-3">{air.crewCapacity} Crew / {air.passengerCapacity} PAX</td>
              <td className="p-3">{air.base}</td>
              <td className="p-3">{air.status}</td>
              <td className="p-3 text-blue-500 cursor-pointer">Manage</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showForm && <AddAircraftForm onClose={() => { setShowForm(false); fetchAircrafts(); }} />}
    </div>
  );
}
