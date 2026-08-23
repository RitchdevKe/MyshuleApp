"use client";

import React, { useState } from "react";
import { BookOpen, Target, Clock, ArrowRight, Sparkles, Book, Plus, Filter, Search, Edit, Trash2, X } from "lucide-react";
import { createSubject, updateSubject, deleteSubject } from "@/app/actions/subjects";
import { useRouter } from "next/navigation";

interface Subject {
  id: string;
  name: string;
  code: string;
  isCoreSubject: boolean;
  tenantId: string;
}

export default function LearningAreasClient({ subjects }: { subjects: Subject[] }) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", isCoreSubject: true });
  const [isLoading, setIsLoading] = useState(false);

  const colors = [
    { color: "from-indigo-500 to-indigo-600", text: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { color: "from-emerald-500 to-emerald-600", text: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { color: "from-rose-500 to-rose-600", text: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { color: "from-amber-500 to-amber-600", text: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { color: "from-teal-500 to-teal-600", text: "text-teal-600", bg: "bg-teal-50", border: "border-teal-100" },
    { color: "from-violet-500 to-violet-600", text: "text-violet-600", bg: "bg-violet-50", border: "border-violet-100" }
  ];

  const mappedSubjects = subjects
    .filter(sub => sub.name.toLowerCase().includes(searchTerm.toLowerCase()) || sub.code.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((sub, i) => ({
      ...sub,
      grade: "All Grades", // Mocked or derived from code if we had a parsing logic
      lessons: 4, // Mocked for UI
      progress: Math.floor(Math.random() * 50) + 40, // Mocked progress 40-90
      ...colors[i % colors.length]
    }));

  const totalLessons = mappedSubjects.reduce((sum, item) => sum + item.lessons, 0);
  const totalCompetencies = subjects.length * 6; // Mock

  const handleOpenModal = (subject?: Subject) => {
    if (subject) {
      setEditingSubject(subject);
      setFormData({ name: subject.name, code: subject.code, isCoreSubject: subject.isCoreSubject });
    } else {
      setEditingSubject(null);
      setFormData({ name: "", code: "", isCoreSubject: true });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSubject(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingSubject) {
        await updateSubject(editingSubject.id, formData);
      } else {
        await createSubject(formData);
      }
      handleCloseModal();
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this learning area?")) return;
    setIsDeleting(id);
    try {
      await deleteSubject(id);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">

      {/* Toolbar */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 flex-wrap">
          <button className="px-4 py-2 rounded-xl text-xs font-black bg-primary-900 text-white shadow-md shadow-primary-900/20 transition-all">
            All Grades
          </button>
          <button className="px-4 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
            Core
          </button>
          <button className="px-4 py-2 rounded-xl text-xs font-black bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
            Elective
          </button>
        </div>
        
        <div className="flex gap-2">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search learning areas..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-xs font-bold bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all w-56 placeholder-slate-400"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 hover:-translate-y-0.5 transition-all"
          >
            <Plus className="w-4 h-4" /> Add Area
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        <div className="bg-gradient-to-br from-primary-900 to-primary-950 p-6 rounded-3xl border border-primary-800 shadow-lg text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-secondary-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="flex items-center gap-1 text-xs font-black text-white/90 bg-white/10 px-2.5 py-1.5 rounded-lg border border-white/20">
              <Sparkles className="w-3.5 h-3.5" /> CBC Aligned
            </span>
          </div>
          <p className="text-white/60 font-bold text-sm mb-1 relative z-10">Total Learning Areas</p>
          <h3 className="text-4xl font-black tracking-tight relative z-10">{subjects.length}</h3>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/80 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-secondary-50 border border-secondary-100 text-secondary-600 rounded-2xl shadow-sm">
              <Target className="w-6 h-6" />
            </div>
            <div className="flex -space-x-2">
              {[1, 2, 3].map((_, idx) => (
                <div key={idx} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm"></div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Total Competencies</p>
            <h3 className="text-4xl font-black text-slate-800 tracking-tight">{totalCompetencies}</h3>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl border border-white/80 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-50 border border-primary-100 text-primary-600 rounded-2xl shadow-sm">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-slate-500 mb-1">Weekly Lessons</p>
            <h3 className="text-4xl font-black text-slate-800 tracking-tight">{totalLessons}</h3>
          </div>
        </div>

      </div>

      {/* Grid */}
      <div>
        <div className="flex items-center justify-between mb-4 px-2">
          <h2 className="text-xl font-black text-slate-800 tracking-tight">Learning Areas</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mappedSubjects.map((area) => (
            <div key={area.id} className="bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 group overflow-hidden relative flex flex-col h-full">
              
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
                <button 
                  onClick={() => handleOpenModal(area)}
                  className="p-1.5 bg-white text-slate-600 hover:text-primary-600 rounded-lg shadow-sm border border-slate-100 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(area.id)}
                  disabled={isDeleting === area.id}
                  className="p-1.5 bg-white text-slate-600 hover:text-red-600 rounded-lg shadow-sm border border-slate-100 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start justify-between mb-5 relative z-10">
                <div className={`p-3 rounded-2xl bg-gradient-to-br ${area.color} text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                  <Book className="w-5 h-5" />
                </div>
                <span className={`px-2.5 py-1 text-[10px] font-black rounded-lg border ${area.bg} ${area.text} ${area.border} uppercase tracking-wider`}>
                  {area.code}
                </span>
              </div>
              
              <h3 className="font-black text-slate-800 text-lg mb-1 relative z-10 leading-tight">{area.name}</h3>
              <p className="text-xs font-bold text-slate-500 mb-4">{area.isCoreSubject ? 'Core Subject' : 'Elective Subject'}</p>

              <div className="mt-auto relative z-10">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-white/50 px-3 py-2 rounded-xl border border-slate-100 w-fit mb-5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  {area.lessons} lessons/wk
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-slate-600 mb-2">
                    <span>Syllabus Coverage</span>
                    <span className={area.text}>{area.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r ${area.color} transition-all duration-500`}
                      style={{ width: `${area.progress}%` }}
                    ></div>
                  </div>
                </div>
              </div>

            </div>
          ))}

          {mappedSubjects.length === 0 && (
             <div className="col-span-full py-12 text-center bg-white/60 backdrop-blur-xl rounded-3xl border border-white/80 shadow-sm">
                <Book className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-black text-slate-800 mb-2">No learning areas found</h3>
                <p className="text-sm font-medium text-slate-500 mb-4">Get started by creating your first learning area.</p>
                <button 
                  onClick={() => handleOpenModal()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Area
                </button>
             </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-100 w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-lg font-black text-slate-800">
                {editingSubject ? "Edit Learning Area" : "Add Learning Area"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Area Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Mathematics Activities"
                  className="w-full px-3 py-2 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Code</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="e.g. MATH-4"
                  className="w-full px-3 py-2 text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 uppercase"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isCore"
                  checked={formData.isCoreSubject}
                  onChange={(e) => setFormData({ ...formData, isCoreSubject: e.target.checked })}
                  className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                />
                <label htmlFor="isCore" className="text-sm font-bold text-slate-700">
                  Is Core Subject
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 mt-6 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md disabled:opacity-50 transition-all"
                >
                  {isLoading ? "Saving..." : "Save Learning Area"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
