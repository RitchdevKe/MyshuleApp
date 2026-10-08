"use client";

import React, { useState } from "react";
import { Building2, MapPin, Search, Plus, BarChart3, AlertCircle, Edit, Trash2, X } from "lucide-react";
import { createStore, updateStore, deleteStore } from "./actions";

export default function StoreClient({ 
  stores, 
  staffList, 
  topCards 
}: { 
  stores: any[]; 
  staffList: any[]; 
  topCards: any; 
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", location: "", managerId: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(val);
  };

  const handleOpenModal = (store?: any) => {
    if (store) {
      setEditingStore(store);
      setFormData({ name: store.name, location: store.location || "", managerId: store.managerId || "" });
    } else {
      setEditingStore(null);
      setFormData({ name: "", location: "", managerId: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingStore(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingStore) {
        await updateStore(editingStore.id, formData);
      } else {
        await createStore(formData);
      }
      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this store?")) {
      try {
        await deleteStore(id);
      } catch (error) {
        console.error(error);
        alert("An error occurred while deleting");
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
         <h2 className="text-lg font-black text-slate-800">Store & Warehouse Management</h2>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Search className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
            >
               <Plus className="w-4 h-4" />
               Add Store Location
            </button>
         </div>
      </div>

      {/* Top Cards for Aggregated Data */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/60 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Stores</p>
          <p className="text-2xl font-black text-slate-800">{topCards.totalStores}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/60 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Unique Items</p>
          <p className="text-2xl font-black text-slate-800">{topCards.totalUniqueItems}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/60 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Inventory Value</p>
          <p className="text-2xl font-black text-primary-600">{formatCurrency(topCards.totalValue)}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-slate-200/60 shadow-sm flex flex-col justify-center">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Avg Capacity Util.</p>
          <p className="text-2xl font-black text-slate-800">{topCards.avgCapacity}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
         {stores.map((store) => (
            <div key={store.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col sm:flex-row group">
               
               {/* Identity Section */}
               <div className="p-6 sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-200/60 bg-slate-50/50 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute -left-6 -bottom-6 w-32 h-32 bg-primary-50 rounded-full opacity-50 group-hover:scale-110 transition-transform"></div>
                  <div className="relative z-10">
                     <div className="flex justify-between items-start mb-2">
                        <div className="p-2.5 bg-primary-100 text-primary-600 rounded-xl inline-block mb-3">
                           <Building2 className="w-5 h-5" />
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenModal(store)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(store.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                     </div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider bg-white px-2 py-1 rounded-md shadow-sm border border-slate-100">{store.id.split('-')[0]}</span>
                     </div>
                     <h3 className="text-lg font-black text-slate-800 leading-tight">{store.name}</h3>
                     
                     <div className="mt-4 space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                           <MapPin className="w-4 h-4 text-slate-400" />
                           {store.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                           <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                              <span className="text-[8px] font-black text-slate-600">{(store.managerName?.[0] || '?').toUpperCase()}</span>
                           </div>
                           Manager: <span className="font-bold text-slate-700">{store.managerName}</span>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Metrics Section */}
               <div className="p-6 sm:w-1/2 flex flex-col justify-between bg-white z-10 relative">
                  <div>
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Capacity Utilization</p>
                     <div className="flex items-end gap-2 mb-2">
                        <span className={`text-3xl font-black ${store.capacity >= 90 ? 'text-rose-600' : 'text-slate-800'}`}>
                           {store.capacity}%
                        </span>
                        {store.capacity >= 90 && (
                           <span className="flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-md uppercase tracking-wider mb-1.5">
                              <AlertCircle className="w-3 h-3" /> Near Limit
                           </span>
                        )}
                     </div>
                     <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
                        <div className={`h-full rounded-full transition-all duration-1000 ${
                           store.capacity >= 90 ? 'bg-rose-500' : store.capacity >= 70 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`} style={{ width: `${store.capacity}%` }}></div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Unique Items</p>
                           <p className="text-xl font-black text-slate-800">{store.itemsCount}</p>
                        </div>
                        <div>
                           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total Value</p>
                           <p className="text-xl font-black text-primary-600">{formatCurrency(store.totalValue)}</p>
                        </div>
                     </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-slate-100">
                     <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                        <BarChart3 className="w-4 h-4" /> View Inventory Report
                     </button>
                  </div>
               </div>

            </div>
         ))}
         
         {stores.length === 0 && (
           <div className="col-span-full py-12 flex flex-col items-center justify-center text-slate-500 bg-white/50 rounded-3xl border border-slate-200/60 border-dashed">
             <Building2 className="w-12 h-12 mb-4 text-slate-300" />
             <p className="font-medium">No stores found</p>
             <button onClick={() => handleOpenModal()} className="mt-4 text-primary-600 font-bold hover:underline">Add your first store</button>
           </div>
         )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-black text-slate-800">{editingStore ? "Edit Store" : "Add Store"}</h3>
              <button onClick={handleCloseModal} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Store Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-slate-800"
                  placeholder="e.g. Main Warehouse"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Location</label>
                <input 
                  required
                  type="text" 
                  value={formData.location}
                  onChange={e => setFormData({...formData, location: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-slate-800"
                  placeholder="e.g. Building A, Floor 1"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Manager (Optional)</label>
                <select
                  value={formData.managerId}
                  onChange={e => setFormData({...formData, managerId: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all font-medium text-slate-800"
                >
                  <option value="">Unassigned</option>
                  {staffList.map(staff => (
                    <option key={staff.id} value={staff.id}>{staff.name}</option>
                  ))}
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-primary-900 hover:bg-primary-800 text-white font-bold rounded-xl shadow-sm shadow-primary-900/20 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingStore ? "Save Changes" : "Create Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
