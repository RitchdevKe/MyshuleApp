"use client";

import React, { useState, useEffect } from "react";
import { Truck, Search, Filter, Plus, ShieldCheck, AlertCircle, Wrench, MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { createVehicle, updateVehicle, deleteVehicle, getDrivers } from "./actions";

export default function VehiclesClient({ initialVehicles, initialStats }: { initialVehicles: any[], initialStats: any }) {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [stats, setStats] = useState(initialStats);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [drivers, setDrivers] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    registrationNumber: "",
    make: "",
    model: "",
    capacity: 0,
    status: "ACTIVE",
    driverId: ""
  });

  useEffect(() => {
    getDrivers().then(setDrivers).catch(console.error);
  }, []);

  const openModal = (vehicle?: any) => {
    if (vehicle) {
      setEditingId(vehicle.id);
      setFormData({
        registrationNumber: vehicle.registrationNumber,
        make: vehicle.make || "",
        model: vehicle.model || "",
        capacity: vehicle.capacity || 0,
        status: vehicle.status,
        driverId: vehicle.driverId || ""
      });
    } else {
      setEditingId(null);
      setFormData({
        registrationNumber: "",
        make: "",
        model: "",
        capacity: 0,
        status: "ACTIVE",
        driverId: ""
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const updated = await updateVehicle(editingId, formData);
        setVehicles(vehicles.map(v => v.id === editingId ? { ...v, ...formData } : v));
      } else {
        await createVehicle(formData);
        // Simply reloading the page to get the freshest data and stats since layout needs it too.
        window.location.reload();
      }
      closeModal();
    } catch (error) {
      console.error(error);
      alert("Error saving vehicle");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      try {
        await deleteVehicle(id);
        setVehicles(vehicles.filter(v => v.id !== id));
        window.location.reload();
      } catch (error) {
        console.error(error);
        alert("Error deleting vehicle");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block">
                 <Truck className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Fleet Management</h2>
                 <p className="text-sm font-medium text-slate-500">Track and manage the school's fleet of buses and vehicles.</p>
              </div>
           </div>
           <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Register Vehicle
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Plate, Type, or Driver..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Types</option>
                 <option>ACTIVE</option>
                 <option>MAINTENANCE</option>
                 <option>INACTIVE</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 More Filters
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Vehicle Details</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Driver</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Capacity</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div>
                       <span className="font-bold text-slate-800 text-sm bg-slate-100 px-2 py-0.5 rounded border border-slate-200/60">{vehicle.registrationNumber}</span>
                       <p className="text-xs font-bold text-slate-600 mt-1.5">{vehicle.make} {vehicle.model}</p>
                       <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-wider">{vehicle.id}</p>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700 text-sm">{vehicle.driver ? `${vehicle.driver.firstName} ${vehicle.driver.lastName}` : "Unassigned"}</p>
                  </td>
                  <td className="py-4 px-6">
                     <span className="text-xs font-bold text-slate-600">
                        {vehicle.capacity} Seater
                     </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      vehicle.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 
                      vehicle.status === 'MAINTENANCE' ? 'bg-amber-50 text-amber-600' : 
                      'bg-rose-50 text-rose-600'
                    }`}>
                      {vehicle.status === 'ACTIVE' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {vehicle.status === 'MAINTENANCE' && <Wrench className="w-3.5 h-3.5" />}
                      {vehicle.status === 'INACTIVE' && <AlertCircle className="w-3.5 h-3.5" />}
                      {vehicle.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button onClick={() => openModal(vehicle)} className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                       </button>
                       <button onClick={() => handleDelete(vehicle.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                       </button>
                     </div>
                  </td>
                </tr>
              ))}
              {vehicles.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">
                    No vehicles found. Click "Register Vehicle" to add one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">{editingId ? "Edit Vehicle" : "Register Vehicle"}</h3>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <Plus className="w-6 h-6 rotate-45" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Registration Number</label>
                <input required type="text" value={formData.registrationNumber} onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900" placeholder="e.g. KBC 123Z" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Make</label>
                  <input type="text" value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900" placeholder="e.g. Toyota" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Model</label>
                  <input type="text" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900" placeholder="e.g. Hiace" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Capacity (Seats)</label>
                  <input type="number" value={formData.capacity} onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900">
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="MAINTENANCE">MAINTENANCE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Assigned Driver</label>
                <select value={formData.driverId} onChange={(e) => setFormData({...formData, driverId: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-900">
                  <option value="">Unassigned</option>
                  {drivers.map(driver => (
                    <option key={driver.id} value={driver.id}>{driver.firstName} {driver.lastName}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors">{editingId ? "Save Changes" : "Register Vehicle"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
