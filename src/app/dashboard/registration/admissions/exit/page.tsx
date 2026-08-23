'use client';

import React, { useState, useEffect } from "react";
import {
  Search, Plus, CheckCircle2, Clock,
  XCircle, AlertTriangle, LogOut, FileText,
  Activity, GraduationCap, Edit, Trash2, X
} from "lucide-react";
import { getStudentExits } from "@/app/actions/exits";
import { getStudentsDirectory } from "@/app/actions/students";

const typeConfig: Record<string, { color: string; icon: any }> = {
  Graduation: { color: "bg-indigo-50 text-indigo-700 border-indigo-200",      icon: GraduationCap },
  Transfer:   { color: "bg-sky-50 text-sky-700 border-sky-200",               icon: Activity },
  Withdrawal: { color: "bg-amber-50 text-amber-700 border-amber-200",         icon: LogOut },
  Expulsion:  { color: "bg-rose-50 text-rose-700 border-rose-200",          icon: XCircle },
};

const statusConfig: Record<string, { pill: string; icon: any }> = {
  Complete:   { pill: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  Pending:    { pill: "bg-amber-50 text-amber-700 border-amber-200",       icon: Clock },
  Incomplete: { pill: "bg-rose-50 text-rose-700 border-rose-200",          icon: AlertTriangle },
};

const clearanceConfig: Record<string, string> = {
  "Cleared":      "text-emerald-700 bg-emerald-50 border-emerald-200",
  "Pending":      "text-amber-700 bg-amber-50 border-amber-200",
  "Not Cleared":  "text-rose-700 bg-rose-50 border-rose-200",
};

const feesConfig: Record<string, string> = {
  "Settled": "text-emerald-700 bg-emerald-50 border-emerald-200",
  "Balance": "text-rose-700 bg-rose-50 border-rose-200",
};

const avatarGrads = [
  "from-primary-700 to-primary-900", "from-secondary-500 to-secondary-700",
  "from-indigo-500 to-violet-600",   "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-500",    "from-sky-500 to-blue-600",
  "from-pink-500 to-rose-600",
];

const EXIT_TYPES = ["All", "Graduation", "Transfer", "Withdrawal", "Expulsion"];
const STATUSES   = ["All", "Complete", "Pending", "Incomplete"];

const defaultFormData = {
  id: "",
  name: "",
  initials: "",
  exitType: "Transfer",
  date: new Date().toISOString().split('T')[0],
  reason: "",
  dest: "",
  finance: "Settled",
  library: "Cleared",
  sports: "Cleared",
  status: "Complete"
};

export default function ExitPage() {
  const [search, setSearch]  = useState("");
  const [typeF, setTypeF]    = useState("All");
  const [statusF, setStatusF] = useState("All");
  const [exitData, setExitData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal & form states
  const [showModal, setShowModal] = useState(false);
  const [activeStudents, setActiveStudents] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ ...defaultFormData });
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    fetchExits();
  }, []);

  const fetchExits = () => {
    setLoading(true);
    getStudentExits().then(res => {
      if (res.success) {
        const mapped = res.data.map((s: any) => {
          let eType = "Transfer";
          if (s.status === "ALUMNI") eType = "Graduation";

          return {
            id: s.admissionNumber || s.id,
            name: `${s.firstName} ${s.lastName}`,
            initials: `${s.firstName?.[0] || ""}${s.lastName?.[0] || ""}`.toUpperCase(),
            exitType: eType,
            date: new Date().toLocaleDateString(), // mocked exit date
            status: "Complete",
            reason: eType === "Graduation" ? "Completed studies" : "Transferred out",
            dest: eType === "Graduation" ? "High School / University" : "Another Institution",
            finance: "Settled",
            library: "Cleared",
            sports: "Cleared"
          };
        });
        setExitData(mapped);
      }
      setLoading(false);
    });
  };

  const fetchActiveStudents = () => {
    setLoadingStudents(true);
    getStudentsDirectory().then(res => {
      if (res.success) {
        // Only get active students, avoiding those already in exitData if we were using real IDs,
        // but for now just filter ACTIVE status
        const active = res.data.filter((s: any) => s.status === 'ACTIVE');
        setActiveStudents(active);
      }
      setLoadingStudents(false);
    });
  };

  const handleOpenModal = (record?: any) => {
    if (record) {
      setEditingId(record.id);
      // parse date back to YYYY-MM-DD if possible, else just use today
      setFormData({
        id: record.id,
        name: record.name,
        initials: record.initials,
        exitType: record.exitType,
        date: new Date().toISOString().split('T')[0],
        reason: record.reason,
        dest: record.dest,
        finance: record.finance,
        library: record.library,
        sports: record.sports,
        status: record.status
      });
    } else {
      setEditingId(null);
      setFormData({ ...defaultFormData });
      if (activeStudents.length === 0) fetchActiveStudents();
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({ ...defaultFormData });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setExitData(prev => prev.map(item => item.id === editingId ? { ...item, ...formData } : item));
    } else {
      // Find selected student details
      const student = activeStudents.find(s => (s.admissionNumber || s.id) === formData.id);
      const name = student ? `${student.firstName} ${student.lastName}` : "Unknown Student";
      const initials = student ? `${student.firstName?.[0] || ""}${student.lastName?.[0] || ""}`.toUpperCase() : "US";
      
      const newRecord = {
        ...formData,
        id: formData.id || `MOCK-${Date.now()}`,
        name,
        initials,
        date: new Date(formData.date).toLocaleDateString(),
      };
      setExitData(prev => [newRecord, ...prev]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to remove this exit record?")) {
      setExitData(prev => prev.filter(item => item.id !== id));
    }
  };

  const filtered = exitData.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    const matchType   = typeF === "All" || r.exitType === typeF;
    const matchStatus = statusF === "All" || r.status === statusF;
    return matchSearch && matchType && matchStatus;
  });

  const counts = {
    Complete:   exitData.filter(r => r.status === "Complete").length,
    Pending:    exitData.filter(r => r.status === "Pending").length,
    Incomplete: exitData.filter(r => r.status === "Incomplete").length,
    Total:      exitData.length,
  };

  return (
    <div className="space-y-4">
      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Exits",       value: counts.Total,      icon: LogOut,       color: "from-primary-600 to-primary-800" },
          { label: "Cleared",           value: counts.Complete,   icon: CheckCircle2, color: "from-emerald-500 to-teal-600" },
          { label: "Pending Clearance", value: counts.Pending,    icon: Clock,         color: "from-amber-500 to-orange-500" },
          { label: "Incomplete",        value: counts.Incomplete, icon: AlertTriangle, color: "from-rose-500 to-red-600" },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 text-white shadow-md flex items-center gap-3 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="relative z-10">
                <p className="text-white/80 text-[10px] font-black uppercase tracking-wider">{c.label}</p>
                <p className="text-2xl font-black mt-0.5 leading-none">{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-white/80 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white w-72 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={typeF}
              onChange={e => setTypeF(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {EXIT_TYPES.map(f => <option key={f} value={f}>{f === "All" ? "All Exit Types" : f}</option>)}
            </select>
            <select
              value={statusF}
              onChange={e => setStatusF(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {STATUSES.map(s => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
            </select>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white text-sm font-black rounded-xl shadow-md transition-all"
            >
              <Plus className="w-4 h-4" /> Initiate Exit
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm font-bold">Loading...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Exit Info</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Clearance Status</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Overall Status</th>
                  <th className="px-5 py-4 w-24"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r, i) => {
                  const tCfg = typeConfig[r.exitType] || typeConfig['Transfer'];
                  const sCfg = statusConfig[r.status] || statusConfig['Pending'];
                  const TIcon = tCfg.icon;
                  const SIcon = sCfg.icon;

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-black shadow-sm bg-gradient-to-br ${avatarGrads[i % avatarGrads.length]} flex-shrink-0`}>
                            {r.initials}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800 leading-tight">{r.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 mt-0.5">{r.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-black ${tCfg.color}`}>
                            <TIcon className="w-3 h-3" />
                            {r.exitType}
                          </span>
                          <span className="text-[10px] font-bold text-slate-500">
                            {r.date} &bull; {r.reason}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${feesConfig[r.finance] || feesConfig['Balance']}`} title="Finance">
                            FIN: {r.finance}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${clearanceConfig[r.library] || clearanceConfig['Pending']}`} title="Library">
                            LIB: {r.library}
                          </span>
                          <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border ${clearanceConfig[r.sports] || clearanceConfig['Pending']}`} title="Sports">
                            SPT: {r.sports}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[11px] font-black ${sCfg.pill}`}>
                          <SIcon className="w-3.5 h-3.5" />
                          {r.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => handleOpenModal(r)} className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors" title="Edit Exit Record">
                            <Edit className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Delete Exit Record">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-slate-500 text-sm font-bold">
                      No exit records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Modal for Initiate/Edit Exit */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-800">
                {editingId ? "Edit Exit Record" : "Initiate Exit"}
              </h2>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
              <form id="exitForm" onSubmit={handleSave} className="space-y-6">
                
                {!editingId && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Student</label>
                    <select 
                      required
                      value={formData.id}
                      onChange={e => setFormData({ ...formData, id: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      <option value="" disabled>-- Select a Student --</option>
                      {loadingStudents ? (
                        <option disabled>Loading students...</option>
                      ) : (
                        activeStudents.map(s => (
                          <option key={s.id} value={s.admissionNumber || s.id}>
                            {s.firstName} {s.lastName} ({s.admissionNumber || s.id})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Exit Type</label>
                    <select 
                      required
                      value={formData.exitType}
                      onChange={e => setFormData({ ...formData, exitType: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      {EXIT_TYPES.filter(t => t !== "All").map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Date</label>
                    <input 
                      type="date"
                      required
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Reason</label>
                  <input 
                    type="text"
                    required
                    placeholder="E.g. Completed studies, Transferred out"
                    value={formData.reason}
                    onChange={e => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Destination</label>
                  <input 
                    type="text"
                    required
                    placeholder="E.g. Another Institution"
                    value={formData.dest}
                    onChange={e => setFormData({ ...formData, dest: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-sm font-black text-slate-800 mb-4">Clearance Checklist</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Finance</label>
                      <select 
                        value={formData.finance}
                        onChange={e => setFormData({ ...formData, finance: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      >
                        <option value="Settled">Settled</option>
                        <option value="Balance">Balance</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Library</label>
                      <select 
                        value={formData.library}
                        onChange={e => setFormData({ ...formData, library: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      >
                        <option value="Cleared">Cleared</option>
                        <option value="Pending">Pending</option>
                        <option value="Not Cleared">Not Cleared</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Sports</label>
                      <select 
                        value={formData.sports}
                        onChange={e => setFormData({ ...formData, sports: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                      >
                        <option value="Cleared">Cleared</option>
                        <option value="Pending">Pending</option>
                        <option value="Not Cleared">Not Cleared</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Status</label>
                    <select 
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    >
                      {STATUSES.filter(s => s !== "All").map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button 
                form="exitForm"
                type="submit"
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 transition-colors shadow-sm"
              >
                {editingId ? "Save Changes" : "Initiate Exit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
