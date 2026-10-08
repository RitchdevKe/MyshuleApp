"use client";

import React, { useState, useMemo, useTransition } from "react";
import { Award, Search, Filter, Shield, MoreVertical, Edit2, Trash2, Plus, Users, AlertCircle, X, Check, User, Briefcase } from "lucide-react";
import { createLeadershipPosition, updateLeadershipPosition, deleteLeadershipPosition } from "../actions";
import { useRouter } from "next/navigation";

export default function PositionsClient({ initialPositions, students, staff }: { initialPositions: any[], students: any[], staff: any[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("All");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<any | null>(null);
  const [formData, setFormData] = useState<any>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const categories = ["All", "Executive", "Sports", "Welfare", "Academic"];

  const stats = useMemo(() => {
    const total = initialPositions.length;
    const active = initialPositions.filter((p) => p.status === "Active").length;
    const vacant = initialPositions.filter((p) => p.status === "Vacant").length;
    const executive = initialPositions.filter((p) => p.category === "Executive").length;

    return [
      { label: "Total Positions", value: total, icon: Award, color: "text-blue-600", bg: "bg-blue-50" },
      { label: "Active Roles", value: active, icon: Shield, color: "text-green-600", bg: "bg-green-50" },
      { label: "Vacant Roles", value: vacant, icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-50" },
      { label: "Executive Council", value: executive, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    ];
  }, [initialPositions]);

  const filteredPositions = useMemo(() => {
    return initialPositions.filter((pos) => {
      const holderName = pos.student?.user ? `${pos.student.user.firstName} ${pos.student.user.lastName}` : "";
      const matchesSearch = 
        pos.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        holderName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "All" || pos.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
  }, [initialPositions, searchQuery, filterCategory]);

  const handleOpenModal = (pos?: any) => {
    if (pos) {
      setEditingPosition(pos);
      setFormData(pos);
    } else {
      setEditingPosition(null);
      setFormData({
        title: "",
        category: "Executive",
        studentId: "",
        supervisorId: "",
        term: "2025 - 2026",
        status: "Vacant"
      });
    }
    setIsModalOpen(true);
    setOpenMenuId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPosition(null);
    setFormData({});
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.category) return;

    let finalStatus = formData.status || "Vacant";
    if (formData.studentId && formData.status === "Vacant") {
      finalStatus = "Active";
    } else if (!formData.studentId) {
      finalStatus = "Vacant";
    }

    const payload = {
      ...formData,
      status: finalStatus
    };

    startTransition(async () => {
      try {
        if (editingPosition) {
          await updateLeadershipPosition(editingPosition.id, payload);
        } else {
          await createLeadershipPosition(payload);
        }
        handleCloseModal();
      } catch (err) {
        console.error(err);
        alert("Error saving position.");
      }
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this position?")) {
      startTransition(async () => {
        try {
          await deleteLeadershipPosition(id);
        } catch(err) {
          console.error(err);
          alert("Error deleting position.");
        }
      });
    }
    setOpenMenuId(null);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6 relative">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Leadership Positions</h1>
        <p className="text-slate-500 mt-1">Manage student leadership roles and assignments</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">{stat.label}</div>
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 flex-1">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search positions or students..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all shadow-sm"
            />
          </div>
          
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 hide-scrollbar">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  filterCategory === cat 
                    ? 'bg-secondary-50 text-secondary-700 border-secondary-200 border' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          onClick={() => handleOpenModal()}
          disabled={isPending}
          className="flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm whitespace-nowrap disabled:opacity-50"
        >
          <Plus className="w-4 h-4" /> Add Position
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPositions.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white border border-slate-200 rounded-2xl border-dashed">
            <div className="mx-auto w-12 h-12 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No positions found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          filteredPositions.map((pos) => {
            const holder = pos.student;
            const holderName = holder?.user ? `${holder.user.firstName} ${holder.user.lastName}` : null;
            const holderGrade = holder?.currentClass?.name || "";
            const supervisorData = staff.find((s: any) => s.id === pos.supervisorId);
            const supervisorName = supervisorData ? `${supervisorData.firstName} ${supervisorData.lastName}` : null;

            return (
              <div key={pos.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all group relative">
                <div className="absolute top-4 right-4">
                  <button 
                    onClick={() => setOpenMenuId(openMenuId === pos.id ? null : pos.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                  
                  {openMenuId === pos.id && (
                    <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg z-10 py-1 overflow-hidden">
                      <button 
                        onClick={() => handleOpenModal(pos)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 transition-colors text-left"
                      >
                        <Edit2 className="w-4 h-4" /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(pos.id)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-900 shadow-inner shrink-0">
                    <Shield className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-secondary-600 bg-secondary-50 border border-secondary-100 px-2 py-0.5 rounded-full mb-1.5 inline-block">
                      {pos.category}
                    </span>
                    <h3 className="font-bold text-slate-800 line-clamp-1" title={pos.title}>{pos.title}</h3>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5" /> Current Holder
                    </div>
                    {holderName ? (
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                          {holderName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-slate-800 truncate">{holderName}</div>
                          <div className="text-xs text-slate-500">{holderGrade}</div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-slate-400 italic flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-400">
                          ?
                        </div>
                        Vacant Position
                      </div>
                    )}
                  </div>

                  <div>
                     <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> Staff Supervisor
                    </div>
                    {supervisorName ? (
                      <div className="text-sm font-medium text-slate-700 flex items-center gap-2">
                         <div className="w-6 h-6 rounded-md bg-purple-50 flex items-center justify-center text-purple-700 text-[10px] font-bold">
                           {supervisorName.charAt(0)}
                         </div>
                         {supervisorName}
                      </div>
                    ) : (
                      <div className="text-sm text-slate-400 italic">Unassigned</div>
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    <div>
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Term</div>
                      <div className="text-xs font-bold text-slate-700">{pos.term}</div>
                    </div>
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-lg border ${
                      pos.status === 'Active' ? 'bg-green-50 text-green-700 border-green-200' :
                      pos.status === 'Vacant' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {pos.status}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-800">
                {editingPosition ? "Edit Position" : "Add New Position"}
              </h2>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Position Title *</label>
                <input 
                  type="text" 
                  required
                  value={formData.title || ""}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  placeholder="e.g. Head Boy"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Category *</label>
                <select 
                  required
                  value={formData.category || "Executive"}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                >
                  {categories.filter(c => c !== "All").map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Assign Student (Holder)</label>
                <select 
                  value={formData.studentId || ""}
                  onChange={(e) => setFormData({...formData, studentId: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                >
                  <option value="">-- Unassigned (Vacant) --</option>
                  {students.map((s: any) => (
                    <option key={s.id} value={s.id}>{s.user.firstName} {s.user.lastName} ({s.currentClass?.name || 'No Class'})</option>
                  ))}
                </select>
                <p className="text-xs text-slate-500 mt-1">Leaving this blank sets the status to Vacant.</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Staff Supervisor</label>
                <select 
                  value={formData.supervisorId || ""}
                  onChange={(e) => setFormData({...formData, supervisorId: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                >
                  <option value="">-- Select Staff --</option>
                  {staff.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.jobTitle || 'Staff'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Term</label>
                  <input 
                    type="text" 
                    value={formData.term || ""}
                    onChange={(e) => setFormData({...formData, term: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                    placeholder="e.g. 2025 - 2026"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status Override</label>
                  <select 
                    value={formData.status || "Vacant"}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all"
                  >
                    <option value="Active">Active</option>
                    <option value="Vacant">Vacant</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-2 px-6 py-2 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm disabled:opacity-50"
                >
                  <Check className="w-4 h-4" /> {editingPosition ? "Save Changes" : "Create Position"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
