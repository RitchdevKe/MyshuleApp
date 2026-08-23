"use client";
import React, { useState, useEffect } from "react";
import { Search, Plus, MoreHorizontal, Table, CheckCircle2, Edit, Trash2, X } from "lucide-react";
import { getClassesAndStreams } from "@/app/actions/classes";
import { getAcademicYears } from "@/app/actions/academic";
import { getStaff } from "@/app/actions/staff";

interface Timetable {
  id: string;
  name: string;
  termId: string;
  termName: string;
  status: "Active" | "Draft" | "Scheduled";
  classIds: string[];
  staffId?: string;
  staffName?: string;
  lastUpdated: string;
}

const initialMockTimetables: Timetable[] = [
  { id: "TT-001", name: "Grade 4 Standard Timetable", termId: "term-2-2026", termName: "Term 2, 2026", status: "Active", classIds: [], staffId: "", lastUpdated: "2026-05-10" },
  { id: "TT-002", name: "Grade 5 Standard Timetable", termId: "term-2-2026", termName: "Term 2, 2026", status: "Active", classIds: [], staffId: "", lastUpdated: "2026-05-11" },
  { id: "TT-003", name: "Grade 6 Standard Timetable", termId: "term-2-2026", termName: "Term 2, 2026", status: "Draft", classIds: [], staffId: "", lastUpdated: "2026-08-01" },
  { id: "TT-004", name: "Exam Week Schedule", termId: "term-2-2026", termName: "Term 2, 2026", status: "Scheduled", classIds: [], staffId: "", lastUpdated: "2026-08-05" },
];

export default function TimetablesPage() {
  const [timetables, setTimetables] = useState<Timetable[]>(initialMockTimetables);
  const [search, setSearch] = useState("");
  
  // Data for conceptual linkage
  const [classes, setClasses] = useState<any[]>([]);
  const [terms, setTerms] = useState<any[]>([]);
  const [staffList, setStaffList] = useState<any[]>([]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<{name: string, termId: string, status: "Active" | "Draft" | "Scheduled", classIds: string[], staffId: string}>({
    name: "", termId: "", status: "Draft", classIds: [], staffId: ""
  });

  useEffect(() => {
    async function loadData() {
      try {
        const clsData = await getClassesAndStreams();
        setClasses(clsData);
        
        const yrData = await getAcademicYears();
        const allTerms = yrData.flatMap((y: any) => y.terms.map((t: any) => ({ ...t, yearName: y.name })));
        setTerms(allTerms);

        const staffData = await getStaff();
        setStaffList(staffData);
      } catch (e) {
        console.error("Failed to load prerequisites", e);
      }
    }
    loadData();
  }, []);

  const handleOpenModal = (tt?: Timetable) => {
    if (tt) {
      setEditingId(tt.id);
      setFormData({ name: tt.name, termId: tt.termId, status: tt.status, classIds: tt.classIds, staffId: tt.staffId || "" });
    } else {
      setEditingId(null);
      setFormData({ name: "", termId: terms[0]?.id || "term-2-2026", status: "Draft", classIds: [], staffId: "" });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.name) return;
    const term = terms.find(t => t.id === formData.termId) || { name: formData.termId.replace(/-/g, " ") };
    const termName = term.name;
    const staff = staffList.find(s => s.id === formData.staffId);
    const staffName = staff ? `${staff.firstName} ${staff.lastName}` : "";
    
    if (editingId) {
      setTimetables(prev => prev.map(t => t.id === editingId ? { ...t, ...formData, termName, staffName, lastUpdated: new Date().toISOString().split('T')[0] } : t));
    } else {
      const newTt: Timetable = {
        id: `TT-${Math.floor(Math.random()*10000).toString().padStart(4, '0')}`,
        ...formData,
        termName,
        staffName,
        lastUpdated: new Date().toISOString().split('T')[0]
      };
      setTimetables(prev => [newTt, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if(confirm("Are you sure you want to delete this timetable?")) {
      setTimetables(prev => prev.filter(t => t.id !== id));
    }
  };

  const filtered = timetables.filter(t => t.name.toLowerCase().includes(search.toLowerCase()));
  
  // Calculations for summary card
  const totalTimetables = timetables.length;
  const activeCount = timetables.filter(t => t.status === "Active").length;
  const draftCount = timetables.filter(t => t.status === "Draft").length;
  const scheduledCount = timetables.filter(t => t.status === "Scheduled").length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-100/80 text-emerald-700 border-emerald-200";
      case "Draft": return "bg-slate-100/80 text-slate-700 border-slate-200";
      case "Scheduled": return "bg-blue-100/80 text-blue-700 border-blue-200";
      default: return "bg-slate-100/80 text-slate-700 border-slate-200";
    }
  };

  const handleClassToggle = (clsId: string) => {
    setFormData(prev => {
      const isSelected = prev.classIds.includes(clsId);
      return {
        ...prev,
        classIds: isSelected ? prev.classIds.filter(id => id !== clsId) : [...prev.classIds, clsId]
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 p-5 rounded-3xl shadow-sm flex flex-col transition-transform hover:-translate-y-1">
          <span className="text-slate-500 font-bold text-sm">Total Timetables</span>
          <span className="text-4xl font-black text-slate-800 mt-2">{totalTimetables}</span>
        </div>
        <div className="bg-emerald-50/60 backdrop-blur-xl border border-emerald-100/60 p-5 rounded-3xl shadow-sm flex flex-col transition-transform hover:-translate-y-1">
          <span className="text-emerald-600 font-bold text-sm">Active</span>
          <span className="text-4xl font-black text-emerald-800 mt-2">{activeCount}</span>
        </div>
        <div className="bg-blue-50/60 backdrop-blur-xl border border-blue-100/60 p-5 rounded-3xl shadow-sm flex flex-col transition-transform hover:-translate-y-1">
          <span className="text-blue-600 font-bold text-sm">Scheduled</span>
          <span className="text-4xl font-black text-blue-800 mt-2">{scheduledCount}</span>
        </div>
        <div className="bg-slate-50/60 backdrop-blur-xl border border-slate-200/60 p-5 rounded-3xl shadow-sm flex flex-col transition-transform hover:-translate-y-1">
          <span className="text-slate-600 font-bold text-sm">Drafts</span>
          <span className="text-4xl font-black text-slate-800 mt-2">{draftCount}</span>
        </div>
      </div>

      {/* Main Table Area */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search timetables..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Timetable
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
              <tr>
                <th className="px-6 py-4">Timetable Name</th>
                <th className="px-6 py-4">Term/Period</th>
                <th className="px-6 py-4">Coordinator</th>
                <th className="px-6 py-4">Classes Applied</th>
                <th className="px-6 py-4">Last Updated</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-bold">
                    No timetables found.
                  </td>
                </tr>
              ) : filtered.map((row) => (
                <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 text-primary-900 rounded-lg group-hover:bg-primary-100 transition-colors">
                        <Table className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{row.name}</span>
                        <span className="text-xs font-bold text-slate-400">{row.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{row.termName}</td>
                  <td className="px-6 py-4 font-bold text-slate-600">{row.staffName || <span className="text-slate-400 font-normal italic">None</span>}</td>
                  <td className="px-6 py-4 font-bold text-slate-600">{row.classIds.length || 0} Classes</td>
                  <td className="px-6 py-4 font-bold text-slate-600">{row.lastUpdated}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getStatusStyle(row.status)}`}>
                      {row.status === "Active" && <CheckCircle2 className="w-3 h-3" />}
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleOpenModal(row)}
                        className="p-1.5 text-slate-400 hover:text-primary-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Edit Timetable"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Timetable"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-200/60 flex items-center justify-between text-sm font-bold text-slate-500 bg-white/40 mt-auto">
          <span>Showing {filtered.length} of {timetables.length} timetables</span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-5 flex items-center justify-between border-b border-slate-100">
              <h2 className="text-xl font-black text-slate-800">
                {editingId ? "Edit Timetable" : "Create Timetable"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Timetable Name</label>
                <input 
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  placeholder="e.g. Grade 4 Standard Timetable"
                  className="w-full px-4 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Academic Term</label>
                <select
                  value={formData.termId}
                  onChange={e => setFormData({...formData, termId: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-colors"
                >
                  <option value="">Select a term...</option>
                  {terms.map(t => (
                    <option key={t.id} value={t.id}>{t.name} ({t.yearName})</option>
                  ))}
                  {terms.length === 0 && (
                    <option value="term-2-2026">Term 2, 2026</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Status</label>
                <div className="flex gap-3">
                  {["Draft", "Scheduled", "Active"].map(st => (
                    <button
                      key={st}
                      onClick={() => setFormData({...formData, status: st as any})}
                      className={`flex-1 py-2 text-sm font-bold rounded-xl border transition-all ${
                        formData.status === st 
                        ? "bg-primary-50 border-primary-900 text-primary-900 shadow-sm" 
                        : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Coordinator / Staff</label>
                <select
                  value={formData.staffId}
                  onChange={e => setFormData({...formData, staffId: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-colors"
                >
                  <option value="">No Coordinator</option>
                  {staffList.map(s => (
                    <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.staffNumber})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Apply to Classes</label>
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100">
                  {classes.length > 0 ? classes.map(cls => (
                    <label key={cls.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer transition-colors">
                      <input 
                        type="checkbox"
                        checked={formData.classIds.includes(cls.id)}
                        onChange={() => handleClassToggle(cls.id)}
                        className="w-4 h-4 rounded border-slate-300 text-primary-900 focus:ring-primary-900"
                      />
                      <span className="text-sm font-bold text-slate-700">{cls.name}</span>
                    </label>
                  )) : (
                    <div className="p-4 text-sm text-slate-500 font-medium text-center">
                      No classes available.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={!formData.name}
                className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Timetable
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}