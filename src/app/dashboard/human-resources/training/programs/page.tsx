"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { GraduationCap, BookOpen, Clock, Users, Play, Plus, Search, Filter, Edit, Trash, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { getStaffList } from "./actions";

type Program = {
  id: string;
  title: string;
  format: string;
  duration: string;
  instructor: string;
  enrolled: number;
  status: string;
};

type StaffType = {
  id: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
};

const initialPrograms: Program[] = [];

const getColors = (format: string) => {
  switch (format) {
    case "Online": return { bg: "bg-rose-50", color: "text-rose-600" };
    case "Hybrid": return { bg: "bg-emerald-50", color: "text-emerald-600" };
    default: return { bg: "bg-blue-50", color: "text-blue-600" }; // In-Person
  }
};

function ProgramsContent() {
  const searchParams = useSearchParams();
  const [programs, setPrograms] = useState<Program[]>(initialPrograms);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [staffList, setStaffList] = useState<StaffType[]>([]);

  // Form State
  const [formData, setFormData] = useState<Partial<Program>>({});

  useEffect(() => {
    // Fetch staff for datalist
    getStaffList().then(setStaffList).catch(console.error);

    const handleOpenModal = () => {
      setEditingProgram(null);
      setFormData({ format: "In-Person", status: "Upcoming", enrolled: 0 });
      setIsModalOpen(true);
    };

    window.addEventListener("open_new_program_modal", handleOpenModal);
    
    if (searchParams.get("add") === "true") {
      handleOpenModal();
    }

    return () => {
      window.removeEventListener("open_new_program_modal", handleOpenModal);
    };
  }, [searchParams]);

  const handleEdit = (prog: Program) => {
    setEditingProgram(prog);
    setFormData(prog);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if(confirm("Are you sure you want to delete this program?")) {
      setPrograms(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingProgram) {
      setPrograms(prev => prev.map(p => p.id === editingProgram.id ? { ...p, ...formData } as Program : p));
    } else {
      const newProgram: Program = {
        ...(formData as Program),
        id: `PRG-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
        enrolled: Number(formData.enrolled) || 0,
      };
      setPrograms(prev => [...prev, newProgram]);
    }
    setIsModalOpen(false);
  };

  const filteredPrograms = useMemo(() => {
    return programs.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.instructor.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [programs, searchQuery]);

  const activeCount = programs.filter(p => p.status === "Active").length;
  const totalEnrolled = programs.reduce((sum, p) => sum + p.enrolled, 0);
  const completedCount = programs.filter(p => p.status === "Completed").length;
  const completionRate = programs.length > 0 ? Math.round((completedCount / programs.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl">
             <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Programs</p>
            <p className="text-2xl font-black text-slate-800">{activeCount}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
             <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</p>
            <p className="text-2xl font-black text-slate-800">{totalEnrolled}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
             <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completion Rate</p>
            <p className="text-2xl font-black text-slate-800">{completionRate}%</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-2">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search training programs..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full md:w-80 pl-9 pr-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900 shadow-sm" 
            />
         </div>
         <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
               <Filter className="w-4 h-4" />
               Filter
            </button>
            <button onClick={() => {
              setEditingProgram(null);
              setFormData({ format: "In-Person", status: "Upcoming", enrolled: 0 });
              setIsModalOpen(true);
            }} className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
               <Plus className="w-4 h-4" />
               New Course
            </button>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredPrograms.map((program) => {
            const { bg, color } = getColors(program.format);
            return (
            <div key={program.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col">
               <div className={`p-6 ${bg} border-b border-white/40 flex justify-between items-start relative overflow-hidden`}>
                  <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/20 rounded-full blur-xl"></div>
                  
                  <div className="relative z-10">
                     <span className={`inline-block px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-white/60 mb-3 ${color}`}>
                        {program.format}
                     </span>
                     <span className={`ml-2 inline-block px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-white/60 mb-3 ${program.status === 'Active' ? 'text-emerald-600' : program.status === 'Completed' ? 'text-slate-600' : 'text-amber-600'}`}>
                        {program.status}
                     </span>
                     <h3 className={`font-black text-lg leading-tight ${color.replace('text-', 'text-').replace('600', '900')}`}>
                        {program.title}
                     </h3>
                  </div>
                  <div className={`w-10 h-10 rounded-2xl bg-white/60 flex items-center justify-center shrink-0 relative z-10 ${color}`}>
                     <GraduationCap className="w-5 h-5" />
                  </div>
               </div>
               
               <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-3 mb-6">
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Duration</span>
                        <span className="text-sm font-bold text-slate-700 flex items-center gap-1.5"><Clock className="w-4 h-4 text-slate-400" /> {program.duration}</span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Instructor</span>
                        <span className="text-sm font-bold text-slate-700">{program.instructor}</span>
                     </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                     <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Enrolled</span>
                        <div className="flex items-center gap-1.5 text-sm font-black text-slate-800">
                           <Users className="w-4 h-4 text-primary-500" />
                           {program.enrolled}
                        </div>
                     </div>
                     <div className="flex gap-2">
                         <button onClick={() => handleEdit(program)} className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-600 hover:bg-primary-100 hover:text-primary-700 transition-colors">
                            <Edit className="w-4 h-4" />
                         </button>
                         <button onClick={() => handleDelete(program.id)} className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-600 hover:bg-rose-100 hover:text-rose-700 transition-colors">
                            <Trash className="w-4 h-4" />
                         </button>
                         <button className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 text-slate-600 hover:bg-primary-900 hover:text-white transition-colors">
                            <Play className="w-4 h-4 ml-0.5" />
                         </button>
                     </div>
                  </div>
               </div>
            </div>
            );
         })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">{editingProgram ? "Edit Course" : "New Course"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                <input required type="text" value={formData.title || ""} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Format</label>
                  <select required value={formData.format || "In-Person"} onChange={e => setFormData({...formData, format: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option>In-Person</option>
                    <option>Online</option>
                    <option>Hybrid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Duration</label>
                  <input required type="text" placeholder="e.g. 12 Hours" value={formData.duration || ""} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Instructor</label>
                <input list="staff-list" required type="text" placeholder="e.g. Prof. Alan Smith" value={formData.instructor || ""} onChange={e => setFormData({...formData, instructor: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900" />
                <datalist id="staff-list">
                  {staffList.map(s => (
                    <option key={s.id} value={`${s.firstName} ${s.lastName}`} />
                  ))}
                </datalist>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                  <select required value={formData.status || "Upcoming"} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option>Upcoming</option>
                    <option>Active</option>
                    <option>Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Enrolled</label>
                  <input required type="number" min="0" value={formData.enrolled ?? 0} onChange={e => setFormData({...formData, enrolled: parseInt(e.target.value) || 0})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-sm shadow-primary-900/20 transition-all">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <Suspense fallback={<div className="p-6 text-center text-slate-500">Loading programs...</div>}>
      <ProgramsContent />
    </Suspense>
  );
}
