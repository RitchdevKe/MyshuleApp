"use client";

import React, { useState } from "react";
import { Search, Plus, Filter, Calendar, CalendarCheck, CalendarDays, Clock, MoreHorizontal, Settings2, X, Edit, Trash, CheckCircle2 } from "lucide-react";
import { createAcademicYear, createAcademicTerm, updateAcademicTerm, setActiveAcademicTerm, setActiveAcademicYear, deleteAcademicTerm, deleteAcademicYear, updateAcademicYear } from "@/app/actions/academic";

export default function AcademicClient({ academicYears }: { academicYears: any[] }) {
  const [search, setSearch] = useState("");
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isYearListModalOpen, setIsYearListModalOpen] = useState(false);
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<any>(null);
  const [editingYear, setEditingYear] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Form states
  const [formData, setFormData] = useState({ name: "", startDate: "", endDate: "", academicYearId: "" });

  // Calculate KPIs
  const activeYear = academicYears.find(y => y.isActiveYear) || academicYears[0];
  const activeTerm = academicYears.flatMap(y => y.terms).find(t => t.isActiveTerm);
  
  const calculateWeeks = (start: string, end: string) => {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24 * 7)));
  };

  const totalWeeks = activeTerm ? calculateWeeks(activeTerm.startDate, activeTerm.endDate) : 0;

  // Flatten table
  const allTerms = academicYears.flatMap(y => 
    (y.terms && y.terms.length > 0 ? y.terms : []).map((t: any) => ({
      ...t,
      yearName: y.name,
      yearIsActive: y.isActiveYear,
    }))
  );

  const filtered = allTerms.filter(t => 
    t.yearName.toLowerCase().includes(search.toLowerCase()) || 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  const openNewYearModal = () => {
    setFormData({ name: "", startDate: "", endDate: "", academicYearId: "" });
    setEditingYear(null);
    setIsYearModalOpen(true);
  };

  const openNewTermModal = () => {
    if (academicYears.length === 0) return alert("Please create an Academic Year first.");
    setFormData({ name: "", startDate: "", endDate: "", academicYearId: academicYears[0].id });
    setEditingTerm(null);
    setIsTermModalOpen(true);
  };

  const handleSaveYear = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingYear) {
        await updateAcademicYear(editingYear.id, {
          name: formData.name,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate)
        });
      } else {
        await createAcademicYear({
          name: formData.name,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate)
        });
      }
      setIsYearModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTerm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editingTerm) {
        await updateAcademicTerm(editingTerm.id, {
          name: formData.name,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate)
        });
      } else {
        await createAcademicTerm({
          academicYearId: formData.academicYearId,
          name: formData.name,
          startDate: new Date(formData.startDate),
          endDate: new Date(formData.endDate)
        });
      }
      setIsTermModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTerm = async (id: string) => {
    if (!confirm("Are you sure you want to delete this term?")) return;
    setLoading(true);
    await deleteAcademicTerm(id);
    setLoading(false);
  };

  const handleDeleteYear = async (id: string) => {
    if (!confirm("Are you sure you want to delete this year? It will also delete all its terms.")) return;
    setLoading(true);
    await deleteAcademicYear(id);
    setLoading(false);
  };

  const handleSetActiveTerm = async (id: string, yearId: string) => {
    setLoading(true);
    await setActiveAcademicTerm(id);
    if (!academicYears.find(y => y.id === yearId)?.isActiveYear) {
      await setActiveAcademicYear(yearId);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 relative">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Current Year",  value: activeYear?.name || "N/A",      icon: Calendar,      color: "from-primary-600 to-primary-800" },
          { label: "Active Term",   value: activeTerm?.name || "N/A",    icon: CalendarCheck, color: "from-emerald-500 to-teal-600" },
          { label: "Total Weeks",   value: activeTerm ? `${totalWeeks} Weeks` : "N/A",  icon: Clock,         color: "from-indigo-500 to-violet-600" },
          { label: "Next Deadline", value: "N/A",  icon: CalendarDays,  color: "from-amber-500 to-orange-500" },
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
              placeholder="Search year or term..."
              className="pl-9 pr-4 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all w-64 placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={() => setIsYearListModalOpen(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm">
              <Settings2 className="w-4 h-4" /> Manage Years
            </button>
            <button onClick={openNewYearModal} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm">
              <Plus className="w-4 h-4" /> New Year
            </button>
            <button onClick={openNewTermModal} className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 hover:-translate-y-0.5 transition-all">
              <Plus className="w-4 h-4" /> New Term
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Academic Term</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Start Date</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">End Date</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Duration</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-slate-500 font-semibold">No academic terms found. Create a year and term to get started.</td>
                </tr>
              )}
              {filtered.map((t, i) => {
                const isActive = t.isActiveTerm;
                
                // Determine status logic (simple version)
                const now = new Date();
                const startDate = new Date(t.startDate);
                const endDate = new Date(t.endDate);
                
                let displayStatus = "Upcoming";
                if (isActive) displayStatus = "Active";
                else if (now > endDate) displayStatus = "Completed";
                else if (now >= startDate && now <= endDate) displayStatus = "Ongoing";

                const isCompleted = displayStatus === "Completed";
                const isUpcoming = displayStatus === "Upcoming";
                
                return (
                  <tr key={t.id} className={`hover:bg-primary-50/40 border-l-4 transition-all group ${isActive ? 'border-l-secondary-500 bg-secondary-50/10' : 'border-transparent hover:border-l-primary-400'}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-secondary-50 border-secondary-200 text-secondary-600' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                          <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                          <p className={`font-black text-sm ${isActive ? 'text-secondary-700' : 'text-slate-800'}`}>{t.name}</p>
                          <span className="text-[10px] font-black text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">{t.yearName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold text-slate-600">{startDate.toLocaleDateString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold text-slate-600">{endDate.toLocaleDateString()}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">{calculateWeeks(t.startDate, t.endDate)} Weeks</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black border ${
                        isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-sm' : 
                        isCompleted ? 'bg-slate-100 text-slate-600 border-slate-300' : 
                        isUpcoming ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                        'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!isActive && (
                          <button 
                            onClick={() => handleSetActiveTerm(t.id, t.academicYearId)}
                            className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-lg"
                            title="Set as Active Term"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setEditingTerm(t);
                            setFormData({
                              name: t.name,
                              startDate: new Date(t.startDate).toISOString().split('T')[0],
                              endDate: new Date(t.endDate).toISOString().split('T')[0],
                              academicYearId: t.academicYearId
                            });
                            setIsTermModalOpen(true);
                          }}
                          className="p-1.5 text-primary-600 bg-primary-50 hover:bg-primary-100 border border-primary-100 rounded-lg"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTerm(t.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Year Modal */}
      {isYearModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">{editingYear ? "Edit Academic Year" : "New Academic Year"}</h2>
              <button onClick={() => setIsYearModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveYear} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Year Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. 2026/2027" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                  <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                  <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsYearModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-black text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md disabled:opacity-50 transition-colors">
                  {loading ? "Saving..." : "Save Year"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Term Modal */}
      {isTermModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">{editingTerm ? "Edit Term" : "New Term"}</h2>
              <button onClick={() => setIsTermModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveTerm} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Academic Year</label>
                <select required value={formData.academicYearId} onChange={e => setFormData({...formData, academicYearId: e.target.value})} disabled={!!editingTerm} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none disabled:opacity-70">
                  {academicYears.map(y => (
                    <option key={y.id} value={y.id}>{y.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Term Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Term 1" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                  <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                  <input required type="date" value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2">
                <button type="button" onClick={() => setIsTermModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={loading} className="px-6 py-2 text-sm font-black text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md disabled:opacity-50 transition-colors">
                  {loading ? "Saving..." : "Save Term"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Year List Modal */}
      {isYearListModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">Manage Academic Years</h2>
              <button onClick={() => setIsYearListModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-0 max-h-[60vh] overflow-y-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-slate-100">
                    <th className="px-5 py-3 font-bold">Year Name</th>
                    <th className="px-5 py-3 font-bold">Duration</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {academicYears.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-slate-500">No years found.</td>
                    </tr>
                  )}
                  {academicYears.map(y => (
                    <tr key={y.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-black text-slate-700">{y.name}</td>
                      <td className="px-5 py-4 text-slate-600">
                        {new Date(y.startDate).toLocaleDateString()} - {new Date(y.endDate).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${y.isActiveYear ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {y.isActiveYear ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {!y.isActiveYear && (
                            <button onClick={async () => {
                              setLoading(true);
                              await setActiveAcademicYear(y.id);
                              setLoading(false);
                            }} className="p-1.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-lg" title="Set Active">
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                          )}
                          <button onClick={() => {
                            setEditingYear(y);
                            setFormData({
                              name: y.name,
                              startDate: new Date(y.startDate).toISOString().split('T')[0],
                              endDate: new Date(y.endDate).toISOString().split('T')[0],
                              academicYearId: ""
                            });
                            setIsYearModalOpen(true);
                          }} className="p-1.5 text-primary-600 bg-primary-50 hover:bg-primary-100 rounded-lg">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteYear(y.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button onClick={() => setIsYearListModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
