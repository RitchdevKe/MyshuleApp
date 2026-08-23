"use client";

import React, { useState } from "react";
import { Search, Plus, Sparkles, Calendar as CalendarIcon, Clock, BellRing, Target, Edit, Trash, CheckCircle2, Settings2, X } from "lucide-react";
import { createAcademicYear, createAcademicTerm, updateAcademicTerm, setActiveAcademicTerm, setActiveAcademicYear, deleteAcademicTerm, deleteAcademicYear, updateAcademicYear } from "@/app/actions/academic";

export default function CalendarClient({ academicYears }: { academicYears: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [isYearModalOpen, setIsYearModalOpen] = useState(false);
  const [isYearListModalOpen, setIsYearListModalOpen] = useState(false);
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [editingTerm, setEditingTerm] = useState<any>(null);
  const [editingYear, setEditingYear] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({ name: "", startDate: "", endDate: "", academicYearId: "" });

  const [now] = useState(() => Date.now());
  const activeTerm = academicYears.flatMap(y => y.terms).find(t => t.isActiveTerm);
  
  const calculateWeeks = (start: string, end: string) => {
    const ms = new Date(end).getTime() - new Date(start).getTime();
    return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24 * 7)));
  };
  
  const getDaysRemaining = (end: string) => {
    const ms = new Date(end).getTime() - now;
    return Math.max(0, Math.ceil(ms / (1000 * 60 * 60 * 24)));
  };

  const allTerms = academicYears.flatMap(y => 
    (y.terms && y.terms.length > 0 ? y.terms : []).map((t: any) => ({
      ...t,
      yearName: y.name,
      yearIsActive: y.isActiveYear,
    }))
  );
  
  const upcomingTermsCount = allTerms.filter(t => new Date(t.startDate).getTime() > now).length;

  const filteredData = allTerms.filter(t => 
    t.yearName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="space-y-4">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Term",      value: activeTerm ? activeTerm.name : "None", icon: CalendarIcon, color: "from-primary-600 to-primary-800" },
          { label: "Days Remaining",   value: activeTerm ? getDaysRemaining(activeTerm.endDate).toString() : "0", icon: Clock, color: "from-emerald-500 to-teal-600" },
          { label: "Upcoming Terms",   value: upcomingTermsCount.toString(), icon: BellRing, color: "from-rose-500 to-pink-600" },
          { label: "Academic Weeks",   value: activeTerm ? calculateWeeks(activeTerm.startDate, activeTerm.endDate).toString() : "0", icon: Target, color: "from-blue-500 to-indigo-600" },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 text-white shadow-md flex items-center gap-3 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="relative z-10">
                <p className="text-2xl font-black leading-tight">{c.value}</p>
                <p className="text-xs font-bold text-white/80">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white/80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Calendar..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all w-64 placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button onClick={() => setIsYearListModalOpen(true)} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
              <Settings2 className="w-4 h-4" /> Manage Years
            </button>
            <button onClick={openNewYearModal} className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
              <Plus className="w-4 h-4" /> New Year
            </button>
            <button 
              onClick={openNewTermModal}
              className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" /> New Term
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
              <tr>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Event Name</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Type</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Start Date</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">End Date</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((row) => {
                const isActive = row.isActiveTerm;
                
                const currentTime = new Date(now);
                const startDate = new Date(row.startDate);
                const endDate = new Date(row.endDate);
                
                let displayStatus = "Upcoming";
                if (isActive) displayStatus = "Active";
                else if (currentTime > endDate) displayStatus = "Completed";
                else if (currentTime >= startDate && currentTime <= endDate) displayStatus = "Ongoing";

                return (
                  <tr key={row.id} className="hover:bg-primary-50/40 border-l-4 border-transparent hover:border-l-secondary-500 transition-all group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border bg-primary-50 text-primary-700 border-primary-200">
                          <CalendarIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="font-bold text-slate-800 block">{row.name}</span>
                          <span className="text-[10px] font-black text-primary-700 bg-primary-50 px-1.5 py-0.5 rounded inline-block">{row.yearName}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border bg-white border-slate-200 text-slate-600">
                        Academic Term
                      </span>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-600">{startDate.toLocaleDateString()}</td>
                    <td className="px-5 py-4 font-bold text-slate-600">{endDate.toLocaleDateString()}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black border ${
                        isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        displayStatus === 'Completed' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                        displayStatus === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? 'bg-emerald-500' : 
                          displayStatus === 'Completed' ? 'bg-slate-400' : 
                          displayStatus === 'Upcoming' ? 'bg-blue-500' :
                          'bg-amber-500'
                        }`}></span>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!isActive && (
                          <button 
                            onClick={() => handleSetActiveTerm(row.id, row.academicYearId)}
                            className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Set as Active"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button 
                          onClick={() => {
                            setEditingTerm(row);
                            setFormData({
                              name: row.name,
                              startDate: new Date(row.startDate).toISOString().split('T')[0],
                              endDate: new Date(row.endDate).toISOString().split('T')[0],
                              academicYearId: row.academicYearId
                            });
                            setIsTermModalOpen(true);
                          }}
                          className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTerm(row.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
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
          
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Sparkles className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-bold text-lg text-slate-500">No events found</p>
              <p className="text-sm font-medium mt-1">Try adjusting your search criteria or add a new term</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60 mt-auto">
          <span className="font-bold">Showing <span className="text-primary-900">{filteredData.length}</span> events</span>
        </div>
      </div>

      {/* Modals from AcademicClient */}
      
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
                            }} className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg" title="Set Active">
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
                          }} className="p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg">
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
