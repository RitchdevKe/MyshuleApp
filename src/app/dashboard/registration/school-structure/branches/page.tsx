"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, Filter, Building2, MapPin, Users, Crown, Settings, Map, ChevronRight, ChevronLeft, Building, Edit, Trash2 } from "lucide-react";
import { getBranches, createBranch, updateBranch, deleteBranch } from "@/app/actions/branches";

// A mock tenantId for now, usually you'd get this from context or auth session
const TENANT_ID = "cm01z2a6n000008ldexnwb08h";

interface Branch {
  id: string;
  name: string;
  type?: string;
  address?: string | null;
  head?: string | null;
  capacity?: number | null;
  status: string;
  founded?: string | null;
  levelTypes: string[];
  _count?: {
    classes: number;
    tenantUsers: number;
  };
  // Mock field for enrollment visualization
  current?: number;
}

export default function BranchesPage() {
  const [search, setSearch] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    head: "",
    capacity: "",
    status: "Active",
    founded: "",
  });

  const fetchBranches = async () => {
    setLoading(true);
    // In a real app, tenantId is fetched from user context. 
    // If you have a different default tenantId in your local DB, use it or fetch it.
    // For this demonstration, if the first fetch returns empty, we might just show an empty list.
    const res = await getBranches(TENANT_ID);
    if (res.success && res.data) {
      // mapping current as a random or 0 for UI purposes since it's not in DB
      const mapped = res.data.map(b => ({
        ...b,
        current: Math.floor(Math.random() * (b.capacity || 100))
      }));
      setBranches(mapped);
    }
    setLoading(false);
  };

  useEffect(() => {
    // Attempt to fetch branches
    // If TENANT_ID is strictly required to match DB, we might want to fetch a valid tenant first
    // For the sake of the page, let's fetch any tenant's branches if TENANT_ID doesn't exist?
    // Actually we will just pass TENANT_ID.
    fetchBranches();
  }, []);

  const filtered = branches.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    (b.head && b.head.toLowerCase().includes(search.toLowerCase()))
  );

  const totalBranches = branches.length;
  const totalCapacity = branches.reduce((acc, b) => acc + (b.capacity || 0), 0);
  const enrolled = branches.reduce((acc, b) => acc + (b.current || 0), 0);
  const avgUtilisation = totalCapacity > 0 ? Math.round((enrolled / totalCapacity) * 100) : 0;

  const handleOpenModal = (branch?: Branch) => {
    if (branch) {
      setIsEditing(true);
      setSelectedBranchId(branch.id);
      setFormData({
        name: branch.name,
        address: branch.address || "",
        head: branch.head || "",
        capacity: branch.capacity ? String(branch.capacity) : "",
        status: branch.status || "Active",
        founded: branch.founded || "",
      });
    } else {
      setIsEditing(false);
      setSelectedBranchId(null);
      setFormData({
        name: "",
        address: "",
        head: "",
        capacity: "",
        status: "Active",
        founded: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && selectedBranchId) {
      const res = await updateBranch(selectedBranchId, {
        name: formData.name,
        address: formData.address,
        head: formData.head,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
        status: formData.status,
        founded: formData.founded,
      });
      if (res.success) {
        fetchBranches();
        handleCloseModal();
      } else {
        alert("Failed to update branch");
      }
    } else {
      // Need a valid tenant ID to create. We use our fallback if not present.
      const res = await createBranch({
        tenantId: TENANT_ID,
        name: formData.name,
        address: formData.address,
        head: formData.head,
        capacity: formData.capacity ? Number(formData.capacity) : undefined,
        status: formData.status,
        founded: formData.founded,
      });
      if (res.success) {
        fetchBranches();
        handleCloseModal();
      } else {
        alert("Failed to create branch");
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this branch?")) {
      const res = await deleteBranch(id);
      if (res.success) {
        fetchBranches();
      } else {
        alert("Failed to delete branch");
      }
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Branches", value: totalBranches, icon: Building2, color: "from-primary-600 to-primary-800" },
          { label: "Total Capacity", value: totalCapacity.toLocaleString(), icon: Users, color: "from-indigo-500 to-violet-600" },
          { label: "Enrolled", value: enrolled.toLocaleString(), icon: Users, color: "from-emerald-500 to-teal-600" },
          { label: "Avg Utilisation", value: `${avgUtilisation}%`, icon: Crown, color: "from-amber-500 to-orange-500" },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 text-white shadow-md flex items-center gap-3`}>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-2xl font-black leading-tight">{c.value}</p>
                <p className="text-xs font-bold text-white/80">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden">
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white/80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search branches..."
              className="pl-9 pr-4 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all w-64 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 hover:-translate-y-0.5 transition-all">
              <Plus className="w-4 h-4" /> Add Branch
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="p-10 text-center text-sm font-bold text-slate-500">Loading branches...</div>
          ) : filtered.length === 0 ? (
            <div className="p-10 text-center text-sm font-bold text-slate-500">No branches found.</div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Branch Details</th>
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Location</th>
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Head of School</th>
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Capacity</th>
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Status</th>
                  <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(b => {
                  const isFull = b.status === "Full";
                  const isActive = b.status === "Active";
                  
                  return (
                    <tr key={b.id} className="hover:bg-primary-50/40 border-l-4 border-transparent hover:border-l-secondary-500 transition-all group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                            <Building className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="font-bold text-slate-800 text-sm">{b.name}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span className="text-[10px] font-black text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded truncate max-w-[80px]" title={b.id}>{b.id}</span>
                              <span className="text-[10px] font-bold text-slate-500">• Founded {b.founded || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col">
                          <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" /> {b.address || 'No Address'}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500 mt-1 pl-4.5">{b.levelTypes && b.levelTypes.length > 0 ? b.levelTypes.join(', ') : 'Mixed'}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {b.head ? (
                          <span className="flex items-center gap-2 text-xs font-bold text-slate-700">
                            <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-[10px] uppercase text-slate-600">
                              {b.head.charAt(0)}
                            </div>
                            {b.head}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 font-bold">Unassigned</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex flex-col gap-1 w-32">
                          <div className="flex justify-between text-xs font-bold">
                            <span className={isFull ? "text-rose-600" : "text-slate-700"}>{b.current || 0} / {b.capacity || 0}</span>
                            <span className="text-slate-500">{b.capacity ? Math.round(((b.current || 0)/b.capacity)*100) : 0}%</span>
                          </div>
                          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${isFull ? 'bg-rose-500' : isActive ? 'bg-emerald-500' : 'bg-amber-400'}`}
                              style={{ width: `${b.capacity ? Math.min(((b.current || 0)/b.capacity)*100, 100) : 0}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black border ${
                          isFull ? 'bg-rose-50 text-rose-700 border-rose-200' : 
                          isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                          'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => handleOpenModal(b)} className="p-1.5 text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-100 rounded-lg" title="Edit Branch">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(b.id)} className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100" title="Delete Branch">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-800">{isEditing ? "Edit Branch" : "Add New Branch"}</h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Branch Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="e.g. Main Campus" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Address</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="e.g. Nairobi CBD" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Head of School</label>
                <input type="text" value={formData.head} onChange={e => setFormData({...formData, head: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="e.g. Mrs. J. Kariuki" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capacity</label>
                  <input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="e.g. 800" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400">
                    <option value="Active">Active</option>
                    <option value="Full">Full</option>
                    <option value="Onboarding">Onboarding</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Founded Year</label>
                <input type="text" value={formData.founded} onChange={e => setFormData({...formData, founded: e.target.value})} className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400" placeholder="e.g. 2010" />
              </div>
              
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={handleCloseModal} className="flex-1 px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 transition-all">
                  {isEditing ? "Save Changes" : "Create Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}