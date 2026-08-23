"use client";

import React, { useState, useMemo } from "react";
import { Stethoscope, Lock, Calendar, Search, ShieldAlert, FileText, ChevronRight, Edit2, Trash2, Plus, X } from "lucide-react";

type Appointment = {
  id: string;
  time: string;
  date: string;
  student: string;
  counselor: string;
  type: string;
  status: "Scheduled" | "In Progress" | "Completed";
};

const initialAppointments: Appointment[] = [
  { id: "1", time: "09:00", date: "2026-10-10", student: "Alice Wambui", counselor: "Dr. Smith", type: "Weekly Session", status: "Completed" },
  { id: "2", time: "11:30", date: "2026-10-10", student: "John Kamau", counselor: "Dr. Smith", type: "Crisis Assessment", status: "In Progress" },
  { id: "3", time: "14:00", date: "2026-10-10", student: "Mary Wanjiku", counselor: "Dr. Jones", type: "Initial Intake", status: "Scheduled" },
];

export default function CounsellingPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [pin, setPin] = useState("");

  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Appointment>>({
    time: "",
    date: "",
    student: "",
    counselor: "",
    type: "Weekly Session",
    status: "Scheduled",
  });

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234") setIsAuthorized(true); // Mock auth
  };

  const handleSave = () => {
    if (!formData.student || !formData.counselor || !formData.date || !formData.time) {
      alert("Please fill in all required fields.");
      return;
    }

    if (editingId) {
      setAppointments(prev => prev.map(a => a.id === editingId ? { ...a, ...formData } as Appointment : a));
    } else {
      setAppointments(prev => [...prev, { ...formData, id: Math.random().toString() } as Appointment]);
    }
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleEdit = (apt: Appointment) => {
    setEditingId(apt.id);
    setFormData(apt);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this session?")) {
      setAppointments(prev => prev.filter(a => a.id !== id));
    }
  };

  const filteredAppointments = useMemo(() => {
    return appointments.filter(a => 
      a.student.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.counselor.toLowerCase().includes(searchQuery.toLowerCase())
    ).sort((a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime());
  }, [appointments, searchQuery]);

  const summary = useMemo(() => {
    const total = appointments.length;
    const completed = appointments.filter(a => a.status === "Completed").length;
    const inProgress = appointments.filter(a => a.status === "In Progress").length;
    const scheduled = appointments.filter(a => a.status === "Scheduled").length;
    return { total, completed, inProgress, scheduled };
  }, [appointments]);

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[600px] bg-slate-50/50 p-8 rounded-3xl">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-lg text-center max-w-md w-full">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Restricted Access</h2>
          <p className="text-sm font-medium text-slate-500 mb-8">
            Counselling records contain highly sensitive student data and require safeguard clearance to view. (Use PIN: 1234)
          </p>
          <form onSubmit={handleAuth} className="space-y-4">
            <input
              type="password"
              placeholder="Enter Access PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              className="w-full text-center px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
            <button 
              type="submit"
              className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl shadow-md shadow-rose-600/20 transition-colors"
            >
              Verify Clearance
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 bg-slate-50/30 rounded-3xl min-h-[600px]">
      {/* Secure Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-teal-900 p-5 rounded-2xl border border-teal-800 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-800 text-teal-100 rounded-xl flex items-center justify-center border border-teal-700">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-white flex items-center gap-2">
              Counselling Secure Dashboard
              <span className="px-2 py-0.5 bg-rose-500 text-white text-[10px] uppercase tracking-wider rounded border border-rose-400">Safeguard Mode</span>
            </h2>
            <p className="text-xs font-bold text-teal-200">Confidential session logs and scheduling</p>
          </div>
        </div>
        <button 
          onClick={() => {
            setIsAuthorized(false);
            setPin("");
          }}
          className="px-4 py-2 text-xs font-bold text-teal-100 bg-teal-800 rounded-xl hover:bg-teal-700 transition-colors border border-teal-700"
        >
          Lock Workspace
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
           <span className="text-3xl font-black text-slate-800">{summary.total}</span>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Total Sessions</span>
         </div>
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
           <span className="text-3xl font-black text-emerald-600">{summary.completed}</span>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Completed</span>
         </div>
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
           <span className="text-3xl font-black text-amber-600">{summary.inProgress}</span>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">In Progress</span>
         </div>
         <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center">
           <span className="text-3xl font-black text-blue-600">{summary.scheduled}</span>
           <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Scheduled</span>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Records Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
             <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
               <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                 <Calendar className="w-4 h-4 text-slate-400" /> Appointments Management
               </h3>
               <button 
                 onClick={() => {
                    setEditingId(null);
                    setFormData({ time: "09:00", date: new Date().toISOString().split('T')[0], student: "", counselor: "", type: "Weekly Session", status: "Scheduled" });
                    setIsModalOpen(true);
                 }}
                 className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm shadow-teal-600/20"
               >
                 <Plus className="w-4 h-4" /> New Session
               </button>
             </div>

             <div className="relative mb-6">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
               <input 
                 type="text" 
                 placeholder="Search by student or counselor name..." 
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
                 className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all"
               />
             </div>

             <div className="space-y-3">
                {filteredAppointments.length > 0 ? filteredAppointments.map((apt) => (
                  <div key={apt.id} className="flex flex-col sm:flex-row gap-4 p-4 bg-slate-50 hover:bg-slate-100/50 rounded-2xl border border-slate-100 transition-colors items-start sm:items-center group">
                    <div className="text-xs font-black text-slate-500 w-24 shrink-0 flex flex-col gap-0.5">
                      <span className="text-slate-700">{apt.date}</span>
                      <span>{apt.time}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-800 truncate">{apt.student}</div>
                      <div className="text-xs font-medium text-slate-500 truncate mt-0.5">Counselor: {apt.counselor} &bull; {apt.type}</div>
                      <div className={`mt-2 inline-flex px-2 py-0.5 text-[10px] font-black uppercase tracking-wider border rounded shadow-sm ${
                        apt.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                        apt.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                        'bg-blue-50 text-blue-600 border-blue-200'
                      }`}>
                        {apt.status}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 mt-2 sm:mt-0 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(apt)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Edit Session">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(apt.id)} className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors" title="Delete Session">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200">
                     <Calendar className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                     <h3 className="text-sm font-bold text-slate-700 mb-1">No sessions found</h3>
                     <p className="text-xs font-medium text-slate-500">Try adjusting your search or add a new session.</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Sidebar logs */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-sm p-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Recent Access Logs</h3>
            <div className="space-y-2">
              {[
                { name: "Alice Wambui", date: "Oct 10, 2026", type: "Session Notes" },
                { name: "Samuel Njoroge", date: "Oct 05, 2026", type: "Intake Form" },
                { name: "Mary Wanjiku", date: "Oct 01, 2026", type: "Crisis Assessment" }
              ].map((log, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer group border border-transparent hover:border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-slate-700 truncate">{log.name}</div>
                      <div className="text-[10px] font-bold uppercase text-slate-400 mt-0.5">{log.type}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pl-2">
                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{log.date}</span>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 py-2 text-xs font-bold text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-xl transition-colors">
              View All Logs
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-3xl p-6 flex gap-4 shadow-sm">
            <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-black text-amber-800 mb-1">Safeguarding Alert</h4>
              <p className="text-xs font-medium text-amber-700 leading-relaxed mb-3">
                Remember to log out of this terminal when stepping away. All access to this module is permanently logged and audited by the safeguarding lead.
              </p>
              <button className="text-xs font-bold text-amber-600 hover:text-amber-800 transition-colors underline underline-offset-2">
                View Audit Policy
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-800">{editingId ? 'Edit Session' : 'New Session'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date</label>
                  <input type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Time</label>
                  <input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Student</label>
                <input type="text" value={formData.student} onChange={e => setFormData({...formData, student: e.target.value})} placeholder="e.g. Alice Wambui" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Counselor (Staff)</label>
                <input type="text" value={formData.counselor} onChange={e => setFormData({...formData, counselor: e.target.value})} placeholder="e.g. Dr. Smith" className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Session Type</label>
                  <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                    <option>Weekly Session</option>
                    <option>Initial Intake</option>
                    <option>Crisis Assessment</option>
                    <option>Follow-up</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as any})} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                    <option>Scheduled</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-slate-100">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
              <button onClick={handleSave} className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-xl shadow-md shadow-teal-600/20 transition-colors">
                {editingId ? 'Save Changes' : 'Create Session'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
