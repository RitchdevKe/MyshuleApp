"use client";

import React, { useState, useMemo } from "react";
import { Activity, Search, Filter, Calendar, Users, Target, ArrowRight, CheckCircle2, Clock, PlayCircle, Plus, Edit2, Trash2, X } from "lucide-react";

type Initiative = {
  id: number;
  title: string;
  status: "In Progress" | "Planning" | "Completed";
  leader: string;
  sponsor: string;
  date: string;
  type: "Community" | "Academic" | "Welfare" | "Other";
  impact: "High" | "Medium" | "Low";
};

const initialInitiatives: Initiative[] = [
  { id: 1, title: "Campus Cleanup Drive", status: "In Progress", leader: "John Kamau", sponsor: "Mr. Omondi", date: "2025-10-30", type: "Community", impact: "High" },
  { id: 2, title: "Peer Tutoring Program", status: "Planning", leader: "Mary Wanjiku", sponsor: "Mrs. Kariuki", date: "2025-11-05", type: "Academic", impact: "Medium" },
  { id: 3, title: "Mental Health Awareness", status: "Completed", leader: "Jane Doe", sponsor: "Dr. Njoroge", date: "2025-09-15", type: "Welfare", impact: "High" },
];

export default function LeadershipActivitiesPage() {
  const [initiatives, setInitiatives] = useState<Initiative[]>(initialInitiatives);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("All");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const filteredInitiatives = useMemo(() => {
    return initiatives.filter(i => {
      const matchesSearch = i.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            i.leader.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            i.sponsor.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterType === "All" || i.type === filterType;
      return matchesSearch && matchesFilter;
    });
  }, [initiatives, searchQuery, filterType]);

  const stats = useMemo(() => [
    { label: "Total Initiatives", value: initiatives.length, icon: Activity, color: "text-blue-500", bg: "bg-blue-50" },
    { label: "In Progress", value: initiatives.filter(i => i.status === "In Progress").length, icon: PlayCircle, color: "text-amber-500", bg: "bg-amber-50" },
    { label: "Completed", value: initiatives.filter(i => i.status === "Completed").length, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
    { label: "Planning", value: initiatives.filter(i => i.status === "Planning").length, icon: Clock, color: "text-purple-500", bg: "bg-purple-50" },
  ], [initiatives]);

  const handleSave = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newInitiative: Initiative = {
      id: editingId || Date.now(),
      title: formData.get("title") as string,
      status: formData.get("status") as Initiative["status"],
      leader: formData.get("leader") as string,
      sponsor: formData.get("sponsor") as string,
      date: formData.get("date") as string,
      type: formData.get("type") as Initiative["type"],
      impact: formData.get("impact") as Initiative["impact"],
    };

    if (editingId) {
      setInitiatives(initiatives.map(i => i.id === editingId ? newInitiative : i));
    } else {
      setInitiatives([...initiatives, newInitiative]);
    }
    closeModal();
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this initiative?")) {
      setInitiatives(initiatives.filter(i => i.id !== id));
    }
  };

  const openModal = (id?: number) => {
    setEditingId(id || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const editingInitiative = editingId ? initiatives.find(i => i.id === editingId) : null;

  return (
    <div className="p-6">
      
      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <div>
                <div className="text-2xl font-black text-slate-800 leading-tight">{stat.value}</div>
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by title, leader, or sponsor..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary-500/20 focus:border-secondary-500 transition-all shadow-sm"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2.5 text-sm font-bold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm focus:outline-none"
          >
            <option value="All">All Types</option>
            <option value="Community">Community</option>
            <option value="Academic">Academic</option>
            <option value="Welfare">Welfare</option>
            <option value="Other">Other</option>
          </select>
          <button onClick={() => openModal()} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm whitespace-nowrap">
            <Plus className="w-4 h-4" /> New Initiative
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInitiatives.map((initiative) => (
          <div key={initiative.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow group flex flex-col relative overflow-hidden">
            
            <div className="absolute top-4 right-4 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openModal(initiative.id)} className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition-colors">
                <Edit2 className="w-3.5 h-3.5" />
              </button>
              <button onClick={() => handleDelete(initiative.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex justify-start items-start gap-2 mb-4">
              <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg border
                ${initiative.type === 'Community' ? 'bg-blue-50 text-blue-600 border-blue-200' : 
                  initiative.type === 'Academic' ? 'bg-indigo-50 text-indigo-600 border-indigo-200' : 
                  initiative.type === 'Welfare' ? 'bg-rose-50 text-rose-600 border-rose-200' :
                  'bg-slate-50 text-slate-600 border-slate-200'}`}>
                {initiative.type}
              </span>

              <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg border
                ${initiative.status === 'In Progress' ? 'bg-amber-50 text-amber-700 border-amber-200' : 
                  initiative.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' : 
                  'bg-slate-100 text-slate-600 border-slate-200'}`}>
                {initiative.status}
              </span>
            </div>

            <h3 className="font-bold text-slate-800 mb-1 pr-16">{initiative.title}</h3>
            
            <div className="flex flex-col gap-2 mb-4 mt-2">
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-primary-100 flex items-center justify-center text-[8px] font-bold text-primary-700">
                    {initiative.leader.charAt(0)}
                 </div>
                 <p className="text-xs font-medium text-slate-500">Student Lead: <span className="font-bold text-slate-700">{initiative.leader}</span></p>
               </div>
               <div className="flex items-center gap-2">
                 <div className="w-5 h-5 rounded-full bg-secondary-100 flex items-center justify-center text-[8px] font-bold text-secondary-700">
                    {initiative.sponsor.charAt(0)}
                 </div>
                 <p className="text-xs font-medium text-slate-500">Staff Sponsor: <span className="font-bold text-slate-700">{initiative.sponsor}</span></p>
               </div>
            </div>

            <div className="mt-auto pt-4 border-t border-slate-100 space-y-3">
               <div className="flex items-center justify-between text-xs font-medium text-slate-500">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(initiative.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> {initiative.impact} Impact</span>
               </div>
            </div>
            
          </div>
        ))}
        {filteredInitiatives.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            No initiatives found matching your criteria.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary-600" />
                {editingId ? 'Edit Initiative' : 'New Initiative'}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:bg-slate-200 hover:text-slate-600 p-2 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Initiative Title</label>
                <input required name="title" defaultValue={editingInitiative?.title} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium" placeholder="e.g. Campus Cleanup Drive" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Student Leader</label>
                  <input required name="leader" defaultValue={editingInitiative?.leader} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium" placeholder="Student Name" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Staff Sponsor</label>
                  <input required name="sponsor" defaultValue={editingInitiative?.sponsor} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium" placeholder="Staff Name" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Status</label>
                  <select required name="status" defaultValue={editingInitiative?.status || "Planning"} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium">
                    <option value="Planning">Planning</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Date</label>
                  <input required type="date" name="date" defaultValue={editingInitiative?.date} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
                  <select required name="type" defaultValue={editingInitiative?.type || "Community"} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium">
                    <option value="Community">Community</option>
                    <option value="Academic">Academic</option>
                    <option value="Welfare">Welfare</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Impact Level</label>
                  <select required name="impact" defaultValue={editingInitiative?.impact || "Medium"} className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-sm font-medium">
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button type="button" onClick={closeModal} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm">
                  {editingId ? 'Save Changes' : 'Create Initiative'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
