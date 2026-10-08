"use client";

import React, { useState } from "react";
import { Monitor, Search, Filter, Plus, ArrowRight, Tag, ShieldCheck, AlertCircle, Edit, Trash2, X, DollarSign, Activity, Wrench } from "lucide-react";
import { createAsset, updateAsset, deleteAsset } from "./actions";

export default function AssetRegisterClient({ 
  initialAssets, 
  stats, 
  tenantId,
  facilities 
}: any) {
  const [assets, setAssets] = useState(initialAssets);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    assetTag: "",
    category: "Vehicles",
    status: "ACTIVE",
    condition: "GOOD",
    purchaseCost: 0,
    facilityId: ""
  });

  const categories = ["Vehicles", "IT Equipment", "Machinery", "Lab Equipment", "Furniture"];

  const filteredAssets = assets.filter((asset: any) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          asset.assetTag.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All Categories" || asset.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (asset?: any) => {
    if (asset) {
      setEditingAsset(asset);
      setFormData({
        name: asset.name,
        assetTag: asset.assetTag,
        category: asset.category,
        status: asset.status,
        condition: asset.condition,
        purchaseCost: asset.purchaseCost,
        facilityId: asset.facilityId || ""
      });
    } else {
      setEditingAsset(null);
      setFormData({
        name: "",
        assetTag: `AST-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        category: "Vehicles",
        status: "ACTIVE",
        condition: "GOOD",
        purchaseCost: 0,
        facilityId: facilities[0]?.id || ""
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAsset(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const dataToSubmit = {
        ...formData,
        purchaseCost: Number(formData.purchaseCost),
        facilityId: formData.facilityId === "" ? undefined : formData.facilityId
      };

      if (editingAsset) {
        const updated = await updateAsset(editingAsset.id, dataToSubmit);
        setAssets(assets.map((a: any) => a.id === editingAsset.id ? { ...a, ...updated, facility: facilities.find((f:any) => f.id === updated.facilityId) } : a));
      } else {
        const created = await createAsset({
          tenantId,
          ...dataToSubmit
        });
        setAssets([{ ...created, facility: facilities.find((f:any) => f.id === created.facilityId) }, ...assets]);
      }
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save asset", error);
      alert("Error saving asset");
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this asset?")) {
      try {
        await deleteAsset(id);
        setAssets(assets.filter((a: any) => a.id !== id));
      } catch (error) {
        console.error("Failed to delete asset", error);
        alert("Error deleting asset");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
            <Monitor className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Assets</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.totalAssets}</h3>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-amber-50 text-amber-600 rounded-2xl">
            <Wrench className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">In Maintenance</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.assetsInMaintenance}</h3>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Value</p>
            <h3 className="text-2xl font-black text-slate-800">${stats.totalValue.toLocaleString()}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block">
                 <Monitor className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Fixed Asset Register</h2>
                 <p className="text-sm font-medium text-slate-500">Track and manage high-value organizational assets.</p>
              </div>
           </div>
           <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Register Asset
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search by Asset Tag or Name..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <select 
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                 <option>All Categories</option>
                 {categories.map(c => <option key={c}>{c}</option>)}
              </select>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Asset Details</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Facility</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Condition</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Value</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map((asset: any) => (
                <tr key={asset.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className="flex items-start gap-3">
                       <div className="p-2 bg-slate-100 text-slate-500 rounded-lg shrink-0 mt-0.5">
                          <Tag className="w-4 h-4" />
                       </div>
                       <div>
                          <p className="font-bold text-slate-800 text-sm">{asset.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{asset.assetTag}</span>
                             <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                             <span className="text-xs font-medium text-slate-500">{asset.category}</span>
                          </div>
                       </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700 text-sm">{asset.facility?.name || "Unassigned"}</p>
                  </td>
                  <td className="py-4 px-6">
                     <span className={`inline-flex items-center gap-1.5 text-xs font-bold ${
                        asset.condition === 'EXCELLENT' || asset.condition === 'GOOD' ? 'text-emerald-600' :
                        asset.condition === 'FAIR' ? 'text-amber-600' : 'text-rose-600'
                     }`}>
                        {asset.condition}
                     </span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700 text-sm">${asset.purchaseCost.toLocaleString()}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      asset.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 
                      asset.status === 'MAINTENANCE' ? 'bg-amber-50 text-amber-600' : 
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {asset.status === 'ACTIVE' && <ShieldCheck className="w-3.5 h-3.5" />}
                      {asset.status === 'MAINTENANCE' && <AlertCircle className="w-3.5 h-3.5" />}
                      {asset.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(asset)} className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 p-2 rounded-lg transition-colors">
                           <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(asset.id)} className="text-sm font-bold text-rose-600 hover:text-rose-800 hover:bg-rose-50 p-2 rounded-lg transition-colors">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 font-medium">
                    No assets found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-black text-slate-800">{editingAsset ? "Edit Asset" : "Register Asset"}</h2>
              <button onClick={handleCloseModal} className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 overflow-y-auto space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Asset Tag</label>
                  <input required type="text" value={formData.assetTag} onChange={e => setFormData({...formData, assetTag: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600" />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Asset Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600">
                      {categories.map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Purchase Cost ($)</label>
                    <input type="number" value={formData.purchaseCost} onChange={e => setFormData({...formData, purchaseCost: Number(e.target.value)})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600">
                      <option value="ACTIVE">Active</option>
                      <option value="MAINTENANCE">Maintenance</option>
                      <option value="RETIRED">Retired</option>
                      <option value="LOST">Lost</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-slate-700">Condition</label>
                    <select value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600">
                      <option value="EXCELLENT">Excellent</option>
                      <option value="GOOD">Good</option>
                      <option value="FAIR">Fair</option>
                      <option value="POOR">Poor</option>
                      <option value="CRITICAL">Critical</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Facility / Location</label>
                  <select value={formData.facilityId} onChange={e => setFormData({...formData, facilityId: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-600">
                    <option value="">Unassigned</option>
                    {facilities.map((f: any) => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 mt-auto">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-colors shadow-sm shadow-primary-900/20">
                  {editingAsset ? "Save Changes" : "Register Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
