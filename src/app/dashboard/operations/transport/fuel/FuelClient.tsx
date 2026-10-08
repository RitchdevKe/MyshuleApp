"use client";

import React, { useState } from "react";
import { Fuel, Search, Filter, Plus, TrendingDown, TrendingUp, Download, Receipt, X } from "lucide-react";
import { createFuelRecord, deleteFuelRecord } from "./actions";

type Vehicle = {
  id: string;
  registrationNumber: string;
  make: string | null;
  model: string | null;
};

type FuelRecord = {
  id: string;
  vehicle: {
    id: string;
    registrationNumber: string;
    driver: {
      firstName: string;
      lastName: string;
    } | null;
  };
  amount: number;
  cost: number;
  odometer: number | null;
  date: Date;
  notes: string | null;
};

export default function FuelClient({
  records,
  stats,
  vehicles,
}: {
  records: FuelRecord[];
  stats: { totalCost: number; totalVolume: number; recordCount: number };
  vehicles: Vehicle[];
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [vehicleFilter, setVehicleFilter] = useState("All Vehicles");

  // Form states
  const [vehicleId, setVehicleId] = useState("");
  const [amount, setAmount] = useState("");
  const [cost, setCost] = useState("");
  const [odometer, setOdometer] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");

  const filteredRecords = records.filter((r) => {
    const matchesSearch =
      r.vehicle.registrationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesVehicle = vehicleFilter === "All Vehicles" || r.vehicle.registrationNumber === vehicleFilter;
    
    return matchesSearch && matchesVehicle;
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!vehicleId || !amount || !cost) return;

    await createFuelRecord({
      vehicleId,
      amount: parseFloat(amount),
      cost: parseFloat(cost),
      odometer: odometer ? parseInt(odometer) : null,
      notes: notes || null,
      date: date ? new Date(date) : new Date(),
    });

    setIsModalOpen(false);
    setVehicleId("");
    setAmount("");
    setCost("");
    setOdometer("");
    setDate("");
    setNotes("");
  }

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 flex items-center justify-between">
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Fuel Cost</p>
               <h3 className="text-3xl font-black text-slate-800">${stats.totalCost.toFixed(2)}</h3>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
               <TrendingDown className="w-6 h-6" />
            </div>
         </div>
         <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 flex items-center justify-between">
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Liters</p>
               <h3 className="text-3xl font-black text-slate-800">{stats.totalVolume.toFixed(2)} L</h3>
            </div>
            <div className="p-4 bg-primary-50 text-primary-600 rounded-2xl">
               <Fuel className="w-6 h-6" />
            </div>
         </div>
         <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 flex items-center justify-between">
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Entries</p>
               <h3 className="text-3xl font-black text-slate-800">{stats.recordCount}</h3>
            </div>
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
               <Receipt className="w-6 h-6" />
            </div>
         </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl hidden md:block">
                 <Fuel className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Fuel Consumption Tracker</h2>
                 <p className="text-sm font-medium text-slate-500">Log fuel purchases and monitor fleet efficiency metrics.</p>
              </div>
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Download className="w-4 h-4" />
                 Export Data
              </button>
              <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
                 <Plus className="w-4 h-4" />
                 Log Fuel Entry
              </button>
           </div>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Vehicle or Log ID..." 
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <select 
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                 <option value="All Vehicles">All Vehicles</option>
                 {vehicles.map(v => (
                   <option key={v.id} value={v.registrationNumber}>{v.registrationNumber}</option>
                 ))}
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Date Range
              </button>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Entry Info</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle & Driver</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Fuel & Cost</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Odometer & Notes</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {filteredRecords.map((log) => (
                   <tr key={log.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm truncate max-w-[120px] block" title={log.id}>{log.id}</span>
                        <p className="text-xs font-medium text-slate-500 mt-0.5">{new Date(log.date).toLocaleDateString()}</p>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-primary-700 text-sm">{log.vehicle.registrationNumber}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                          {log.vehicle.driver ? `${log.vehicle.driver.firstName} ${log.vehicle.driver.lastName}` : "No Driver"}
                        </p>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-2 mb-1">
                           <Fuel className="w-3.5 h-3.5 text-slate-400" />
                           <span className="font-bold text-slate-700 text-sm">{log.amount} Liters</span>
                        </div>
                        <p className="text-xs font-black text-slate-800">${log.cost}</p>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-slate-600 text-sm">{log.odometer ? `${log.odometer.toLocaleString()} km` : "N/A"}</p>
                        <p className="text-xs font-medium text-slate-500 mt-1 max-w-[200px] truncate">{log.notes || "-"}</p>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this log?")) {
                              deleteFuelRecord(log.id);
                            }
                          }}
                          className="text-slate-400 hover:text-rose-600 hover:bg-rose-50 p-2 rounded-lg transition-colors inline-flex mr-2"
                          title="Delete"
                        >
                           <X className="w-5 h-5" />
                        </button>
                        <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                           <Receipt className="w-5 h-5" />
                        </button>
                     </td>
                   </tr>
                 ))}
                 {filteredRecords.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                       No fuel logs found.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {/* Log Fuel Entry Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-slate-800 text-lg">Log Fuel Entry</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Vehicle</label>
                <select
                  required
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.registrationNumber}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Volume (Liters)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                    placeholder="e.g. 45"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Cost</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                    placeholder="e.g. 50.00"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Odometer</label>
                  <input
                    type="number"
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900"
                    placeholder="Current km"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Notes</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200/60 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900 resize-none h-20"
                  placeholder="Additional details..."
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-sm shadow-primary-900/20 transition-colors"
                >
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
