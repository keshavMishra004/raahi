"use client";
import { useEffect, useState } from "react";
import api from "@/utils/axios";
import AddAircraftForm from "./AddAirCraftForm";
import { Plane } from "lucide-react";

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
    <div className="w-full min-h-screen bg-gradient-to-br from-sky-50 to-blue-100">
      <div className="w-full max-w-full px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 md:py-6 lg:py-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 md:gap-6 mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Plane className="text-blue-600 flex-shrink-0" size={24} /> 
            <span className="truncate">Aircraft Fleet</span>
          </h1>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 md:py-3 rounded-lg md:rounded-xl shadow-md w-full sm:w-auto text-xs sm:text-sm md:text-base whitespace-nowrap"
          >
            + Add Aircraft
          </button>
        </div>

        {/* Table Container */}
        <div className="w-full overflow-x-auto rounded-lg md:rounded-2xl shadow-xl">
          <table className="w-full text-xs sm:text-sm text-gray-700 bg-white">
            <thead className="bg-blue-100/80 text-gray-800 font-semibold">
              <tr>
                <th className="p-2 sm:p-3 md:p-4 text-left">Registration</th>
                <th className="p-2 sm:p-3 md:p-4 text-left hidden sm:table-cell">Model</th>
                <th className="p-2 sm:p-3 md:p-4 text-left hidden md:table-cell">Type</th>
                <th className="p-2 sm:p-3 md:p-4 text-left hidden lg:table-cell">Capacity</th>
                <th className="p-2 sm:p-3 md:p-4 text-left">Base</th>
                <th className="p-2 sm:p-3 md:p-4 text-left">Status</th>
                <th className="p-2 sm:p-3 md:p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {aircrafts.map((air, index) => (
                <tr 
                  key={air._id || index}
                  className="hover:bg-blue-50 transition duration-200 border-b border-blue-100"
                >
                  <td className="p-2 sm:p-3 md:p-4 font-semibold text-xs sm:text-sm truncate">{air.registration}</td>
                  <td className="p-2 sm:p-3 md:p-4 hidden sm:table-cell text-xs sm:text-sm truncate">{air.model}</td>
                  <td className="p-2 sm:p-3 md:p-4 hidden md:table-cell text-xs sm:text-sm truncate">{air.type}</td>
                  <td className="p-2 sm:p-3 md:p-4 hidden lg:table-cell text-xs sm:text-sm truncate">{air.crewCapacity}C / {air.passengerCapacity}P</td>
                  <td className="p-2 sm:p-3 md:p-4 text-xs sm:text-sm truncate">{air.base}</td>
                  <td className="p-2 sm:p-3 md:p-4">
                    <span className={`px-2 sm:px-3 py-1 rounded-full border text-xs font-medium whitespace-nowrap ${getStatusColor(air.status)}`}>
                      {air.status}
                    </span>
                  </td>
                  <td className="p-2 sm:p-3 md:p-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 font-medium transition-all text-xs sm:text-sm">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
              {aircrafts.length === 0 && (
                <tr>
                  <td colSpan="7" className="p-4 sm:p-6 text-center text-gray-500 text-xs sm:text-sm">
                    No aircraft found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
