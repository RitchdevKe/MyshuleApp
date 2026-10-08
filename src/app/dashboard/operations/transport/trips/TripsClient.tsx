"use client";

import React, { useState } from "react";
import { Truck, Search, Filter, Plus, Clock, Calendar, CheckCircle2, ChevronRight, User, X } from "lucide-react";
import { format } from "date-fns";
import { createTrip } from "./actions";

export default function TripsClient({ initialTrips, routes, vehicles, drivers }: { initialTrips: any[], routes: any[], vehicles: any[], drivers: any[] }) {
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    routeId: "",
    vehicleId: "",
    driverId: "",
    date: format(new Date(), "yyyy-MM-dd"),
    time: "",
    status: "SCHEDULED"
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.routeId || !formData.vehicleId) return;
    
    try {
      const newTrip = await createTrip({
        routeId: formData.routeId,
        vehicleId: formData.vehicleId,
        driverId: formData.driverId || undefined,
        date: new Date(`${formData.date}T${formData.time || "00:00"}`),
        status: formData.status,
        notes: formData.time
      });
      // Optionally we could reload or just optimistically add to the state:
      // Since it revalidates, if we refresh the page it will show. But for instant UI:
      // We can also fetch the relationships but the server action returns just the base model.
      // So let's rely on server action revalidation. 
      window.location.reload(); 
    } catch (err) {
      console.error(err);
    }
  };

  const filteredTrips = initialTrips.filter(trip => 
    trip.route?.name?.toLowerCase().includes(search.toLowerCase()) ||
    trip.vehicle?.registrationNumber?.toLowerCase().includes(search.toLowerCase()) ||
    trip.driver?.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    trip.driver?.lastName?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl hidden md:block">
                 <Truck className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Trip Log & Scheduling</h2>
                 <p className="text-sm font-medium text-slate-500">Track routine school runs and schedule ad-hoc trips.</p>
              </div>
           </div>
           <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
           >
              <Plus className="w-4 h-4" />
              Schedule Trip
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by Trip Title, Vehicle, or Driver..." 
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Types</option>
                 <option>Routine Runs</option>
                 <option>Ad-hoc Trips</option>
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
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Trip Details</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Timing</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Team</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {filteredTrips.map((trip) => {
                   const driverName = trip.driver ? `${trip.driver.firstName} ${trip.driver.lastName}` : "Unassigned";
                   const type = "Routine"; // Default for now
                   const isCompleted = trip.status === "COMPLETED";
                   const isInProgress = trip.status === "IN_PROGRESS";
                   const isScheduled = trip.status === "SCHEDULED";
                   
                   return (
                   <tr key={trip.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm">{trip.route?.name || "Unknown Route"}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{trip.id.slice(0, 8)}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                           <span className={`text-[10px] font-black uppercase tracking-wider text-indigo-600`}>
                              {type}
                           </span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 mb-1 text-sm">
                           <Calendar className="w-3.5 h-3.5 text-slate-400" />
                           <span className="font-bold text-slate-700">{format(new Date(trip.date), "MMM dd, yyyy")}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                           <Clock className="w-3.5 h-3.5" />
                           <span>{trip.notes || "No time set"}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 mb-1 text-sm">
                           <User className="w-3.5 h-3.5 text-slate-400" />
                           <span className="font-bold text-slate-700">{driverName}</span>
                        </div>
                        <p className="text-[10px] font-bold text-primary-600 uppercase tracking-wider bg-primary-50 px-2 py-0.5 rounded inline-block">
                           {trip.vehicle?.registrationNumber || "Unassigned"}
                        </p>
                     </td>
                     <td className="py-4 px-6">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                         isCompleted ? 'bg-emerald-50 text-emerald-600' : 
                         isInProgress ? 'bg-blue-50 text-blue-600' : 
                         'bg-slate-100 text-slate-600'
                       }`}>
                         {isCompleted && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {isInProgress && <Truck className="w-3.5 h-3.5" />}
                         {isScheduled && <Clock className="w-3.5 h-3.5" />}
                         {trip.status}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                           <ChevronRight className="w-5 h-5" />
                        </button>
                     </td>
                   </tr>
                 )})}
                 {filteredTrips.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-slate-500">
                       No trips found.
                     </td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-200 flex justify-between items-center">
              <h3 className="font-bold text-lg text-slate-800">Schedule Trip</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Route</label>
                <select 
                  className="w-full p-2 border border-slate-200 rounded-xl"
                  value={formData.routeId}
                  onChange={(e) => setFormData({...formData, routeId: e.target.value})}
                  required
                >
                  <option value="">Select Route</option>
                  {routes.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Vehicle</label>
                <select 
                  className="w-full p-2 border border-slate-200 rounded-xl"
                  value={formData.vehicleId}
                  onChange={(e) => setFormData({...formData, vehicleId: e.target.value})}
                  required
                >
                  <option value="">Select Vehicle</option>
                  {vehicles.map(v => (
                    <option key={v.id} value={v.id}>{v.registrationNumber}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Driver (Optional)</label>
                <select 
                  className="w-full p-2 border border-slate-200 rounded-xl"
                  value={formData.driverId}
                  onChange={(e) => setFormData({...formData, driverId: e.target.value})}
                >
                  <option value="">Select Driver</option>
                  {drivers.map(d => (
                    <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date</label>
                  <input 
                    type="date"
                    className="w-full p-2 border border-slate-200 rounded-xl"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Time Range</label>
                  <input 
                    type="text"
                    placeholder="e.g. 06:30 AM - 07:45 AM"
                    className="w-full p-2 border border-slate-200 rounded-xl"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-bold text-sm">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
