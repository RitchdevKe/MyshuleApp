"use client";

import React, { useState } from "react";
import { Home, Search, Filter, Plus, Shield, Edit, Trash, X, Building, Users } from "lucide-react";
import { createHostel, updateHostel, deleteHostel } from "./actions";
import { useRouter } from "next/navigation";

export default function HostelsClient({ tenantId, initialHostels }: { tenantId: string, initialHostels: any[] }) {
  const router = useRouter();
  const [hostels, setHostels] = useState(initialHostels);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All Types");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedHostel, setSelectedHostel] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    type: "BOYS",
    capacity: 0,
    warden: "",
    status: "ACTIVE"
  });

  const [loading, setLoading] = useState(false);

  const totalHostels = hostels.length;
  const totalCapacity = hostels.reduce((acc, curr) => acc + curr.capacity, 0);
  const totalOccupied = hostels.reduce((acc, curr) => acc + (curr._count?.allocations || 0), 0);
  const totalAvailable = totalCapacity - totalOccupied;

  const filteredHostels = hostels.filter(h => {
    const matchesSearch = h.name.toLowerCase().includes(search.toLowerCase()) || 
                          (h.warden && h.warden.toLowerCase().includes(search.toLowerCase()));
    let matchesType = true;
    if (typeFilter !== "All Types") {
      matchesType = h.type === typeFilter.toUpperCase();
    }
    return matchesSearch && matchesType;
  });

  const handleOpenModal = (hostel: any = null) => {
    if (hostel) {
      setEditMode(true);
      setSelectedHostel(hostel);
      setFormData({
        name: hostel.name,
        type: hostel.type,
        capacity: hostel.capacity,
        warden: hostel.warden || "",
        status: hostel.status
      });
    } else {
      setEditMode(false);
      setSelectedHostel(null);
      setFormData({
        name: "",
        type: "BOYS",
        capacity: 0,
        warden: "",
        status: "ACTIVE"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedHostel(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editMode && selectedHostel) {
        const updated = await updateHostel(selectedHostel.id, {
          name: formData.name,
          type: formData.type,
          capacity: Number(formData.capacity),
          warden: formData.warden,
          status: formData.status
        });
        setHostels(hostels.map(h => h.id === selectedHostel.id ? { ...h, ...updated, _count: h._count } : h));
      } else {
        const created = await createHostel({
          tenantId,
          name: formData.name,
          type: formData.type,
          capacity: Number(formData.capacity),
          warden: formData.warden,
          status: formData.status
        });
        setHostels([{ ...created, _count: { allocations: 0 } }, ...hostels]);
      }
      handleCloseModal();
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Failed to save hostel.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this hostel?")) {
      try {
        await deleteHostel(id);
        setHostels(hostels.filter(h => h.id !== id));
        router.refresh();
      } catch (err) {
        console.error(err);
        alert("Failed to delete hostel.");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Hostels</p>
              <h3 className="text-2xl font-black text-slate-800">{totalHostels}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Capacity</p>
              <h3 className="text-2xl font-black text-slate-800">{totalCapacity}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Occupied</p>
              <h3 className="text-2xl font-black text-slate-800">{totalOccupied}</h3>
            </div>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Available Beds</p>
              <h3 className="text-2xl font-black text-slate-800">{totalAvailable}</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block">
                 <Home className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Hostel Buildings</h2>
                 <p className="text-sm font-medium text-slate-500">Manage hostel blocks, capacities, and assigned wardens.</p>
              </div>
           </div>
           <button 
             onClick={() => handleOpenModal()}
             className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
           >
              <Plus className="w-4 h-4" />
              Add Hostel
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by Hostel Name or Warden..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <select 
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                 <option>All Types</option>
                 <option>Boys</option>
                 <option>Girls</option>
                 <option>Mixed</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredHostels.length === 0 && (
            <div className="col-span-1 md:col-span-2 text-center py-10 text-slate-500 font-medium">
              No hostels found matching your criteria.
            </div>
          )}
          {filteredHostels.map((hostel) => {
            const occupied = hostel._count?.allocations || 0;
            const capacity = hostel.capacity || 0;
            const occupancyRate = capacity > 0 ? occupied / capacity : 0;
            
            return (
            <div key={hostel.id} className="border border-slate-200/80 rounded-2xl p-5 hover:shadow-md transition-shadow bg-white relative group">
               <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button 
                   onClick={() => handleOpenModal(hostel)}
                   className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                 >
                   <Edit className="w-4 h-4" />
                 </button>
                 <button 
                   onClick={() => handleDelete(hostel.id)}
                   className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-colors"
                 >
                   <Trash className="w-4 h-4" />
                 </button>
               </div>

               <div className="flex justify-between items-start mb-4">
                  <div>
                     <div className="flex items-center gap-2 mb-1 pr-16">
                        <h3 className="text-lg font-black text-slate-800">{hostel.name}</h3>
                        <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${
                           hostel.type === 'BOYS' ? 'bg-blue-50 text-blue-700' : 
                           hostel.type === 'GIRLS' ? 'bg-rose-50 text-rose-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                           {hostel.type}
                        </span>
                     </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-lg ${
                     hostel.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                  }`}>
                     {hostel.status}
                  </span>
               </div>
               
               <div className="flex items-center gap-6 py-4 border-y border-slate-100 mb-4">
                  <div className="flex-1">
                     <div className="flex justify-between items-end mb-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Occupancy</span>
                        <div className="text-right">
                           <span className="text-lg font-black text-slate-800">{occupied}</span>
                           <span className="text-sm font-medium text-slate-400"> / {capacity}</span>
                        </div>
                     </div>
                     <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                           className={`h-full rounded-full ${
                              occupancyRate > 0.9 ? 'bg-rose-500' : 'bg-emerald-500'
                           }`}
                           style={{ width: `${Math.min(occupancyRate * 100, 100)}%` }}
                        ></div>
                     </div>
                  </div>
                  <div className="w-px h-10 bg-slate-200"></div>
                  <div className="flex-1">
                     <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Availability</span>
                     <span className="text-lg font-black text-emerald-600">{Math.max(capacity - occupied, 0)} <span className="text-sm font-medium text-slate-400">Beds</span></span>
                  </div>
               </div>

               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <Shield className="w-5 h-5 text-slate-500" />
                     </div>
                     <div>
                        <p className="text-sm font-bold text-slate-800 leading-tight">{hostel.warden || 'No Warden'}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">Warden</p>
                     </div>
                  </div>
               </div>
            </div>
          )})}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <h3 className="text-lg font-black text-slate-800">
                {editMode ? "Edit Hostel" : "Add New Hostel"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Hostel Name *</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Type *</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  >
                    <option value="BOYS">Boys</option>
                    <option value="GIRLS">Girls</option>
                    <option value="MIXED">Mixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Capacity *</label>
                  <input 
                    type="number" 
                    required
                    min="0"
                    value={formData.capacity}
                    onChange={(e) => setFormData({...formData, capacity: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Warden Name</label>
                <input 
                  type="text" 
                  value={formData.warden}
                  onChange={(e) => setFormData({...formData, warden: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="MAINTENANCE">Maintenance</option>
                  <option value="INACTIVE">Inactive</option>
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-slate-500 hover:bg-slate-100 font-bold text-sm rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white font-bold text-sm rounded-xl transition-colors disabled:opacity-50"
                >
                  {loading ? "Saving..." : editMode ? "Save Changes" : "Add Hostel"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
