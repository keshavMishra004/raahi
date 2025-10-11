"use client";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import AddAircraftForm from "./AddAirCraftForm";
import { Plane, Wrench, CheckCircle, XCircle } from "lucide-react";

export default function AircraftPage() {
  const [aircrafts, setAircrafts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const fetchAircrafts = async () => {
    const { data } = await api.get("/cms/aircrafts");
    setAircrafts(data.aircrafts || []);
  };

  useEffect(() => { fetchAircrafts(); }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "in service": return "bg-green-100 text-green-700 border-green-300";
      case "under maintenance": return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "retired": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-blue-100 p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Plane className="text-blue-600" size={30} /> Aircraft Fleet Management
        </h1>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-5 py-2.5 rounded-xl shadow-md"
        >
          + Add New Aircraft
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl shadow-xl backdrop-blur bg-white/60 border border-blue-100">
        <table className="w-full text-sm text-gray-700">
          <thead className="bg-blue-100/80 text-gray-800 text-base">
            <tr>
              <th className="p-4 text-left">Registration</th>
              <th className="p-4 text-left">Model</th>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Capacity</th>
              <th className="p-4 text-left">Base</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {aircrafts.map((air, index) => (
              <tr 
                key={air._id || index}
                className="hover:bg-blue-50 transition duration-200 border-b border-blue-100"
              >
                <td className="p-4 font-semibold">{air.registration}</td>
                <td className="p-4">{air.model}</td>
                <td className="p-4">{air.type}</td>
                <td className="p-4">{air.crewCapacity} Crew / {air.passengerCapacity} PAX</td>
                <td className="p-4">{air.base}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full border text-xs font-medium ${getStatusColor(air.status)}`}>
                    {air.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button className="text-blue-600 hover:text-blue-800 font-medium transition-all">
                    Manage
                  </button>
                </td>
              </tr>
            ))}
            {aircrafts.length === 0 && (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  No aircraft found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <AddAircraftForm 
          onClose={() => { 
            setShowForm(false); 
            fetchAircrafts(); 
          }} 
        />
      )}
    </div>
  );
}
