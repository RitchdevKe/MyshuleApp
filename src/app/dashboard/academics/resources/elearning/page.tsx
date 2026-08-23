"use client";
import React, { useState, useMemo } from "react";
import { Search, Plus, MonitorPlay, PlayCircle, Edit2, Trash2, X, Star, Users } from "lucide-react";

interface Module {
  id: string;
  title: string;
  subject: string;
  targetClass: string;
  completions: number;
  rating: string;
  status: "Draft" | "Published";
}

const initialModules: Module[] = [
  { id: "EL-001", title: "Interactive Math: Fractions", subject: "Mathematics", targetClass: "Grade 4", completions: 85, rating: "4.8", status: "Published" },
  { id: "EL-002", title: "Science Lab Simulation", subject: "Science", targetClass: "Grade 5", completions: 42, rating: "4.5", status: "Published" },
  { id: "EL-003", title: "Grammar Basics", subject: "English", targetClass: "Grade 4", completions: 0, rating: "0", status: "Draft" },
  { id: "EL-004", title: "History of Kenya Map Game", subject: "Social Studies", targetClass: "Grade 6", completions: 120, rating: "4.9", status: "Published" },
];

export default function ELearningPage() {
  const [modules, setModules] = useState<Module[]>(initialModules);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Dialog state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    subject: "Mathematics",
    targetClass: "Grade 4",
    status: "Draft" as "Draft" | "Published",
  });

  const filteredModules = useMemo(() => {
    return modules.filter(m => 
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.targetClass.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [modules, searchQuery]);

  // Derived stats for top summary card
  const totalModules = modules.length;
  const totalPublished = modules.filter(m => m.status === "Published").length;
  const totalCompletions = modules.reduce((sum, m) => sum + m.completions, 0);
  const avgRating = useMemo(() => {
    const rated = modules.filter(m => parseFloat(m.rating) > 0);
    if (rated.length === 0) return "0.0";
    const sum = rated.reduce((acc, m) => acc + parseFloat(m.rating), 0);
    return (sum / rated.length).toFixed(1);
  }, [modules]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Published": return "bg-emerald-100/80 text-emerald-700 border-emerald-200";
      case "Draft": return "bg-slate-100/80 text-slate-700 border-slate-200";
      default: return "bg-slate-100/80 text-slate-700 border-slate-200";
    }
  };

  const handleOpenModal = (mod?: Module) => {
    if (mod) {
      setEditingModule(mod);
      setFormData({
        title: mod.title,
        subject: mod.subject,
        targetClass: mod.targetClass,
        status: mod.status,
      });
    } else {
      setEditingModule(null);
      setFormData({
        title: "",
        subject: "Mathematics",
        targetClass: "Grade 4",
        status: "Draft",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingModule(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingModule) {
      setModules(prev => prev.map(m => m.id === editingModule.id ? { ...m, ...formData } : m));
    } else {
      const newIdNumber = modules.length > 0 ? Math.max(...modules.map(m => parseInt(m.id.replace("EL-", "")))) + 1 : 1;
      const newId = `EL-${newIdNumber.toString().padStart(3, '0')}`;
      const newModule: Module = {
        id: newId,
        title: formData.title,
        subject: formData.subject,
        targetClass: formData.targetClass,
        status: formData.status,
        completions: 0,
        rating: "0",
      };
      setModules([...modules, newModule]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this module?")) {
      setModules(prev => prev.filter(m => m.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm flex flex-col">
          <span className="text-slate-500 font-bold text-sm">Total Modules</span>
          <span className="text-3xl font-black text-slate-800 mt-2">{totalModules}</span>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm flex flex-col">
          <span className="text-slate-500 font-bold text-sm">Published</span>
          <span className="text-3xl font-black text-emerald-600 mt-2">{totalPublished}</span>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm flex flex-col">
          <span className="text-slate-500 font-bold text-sm">Total Completions</span>
          <span className="text-3xl font-black text-primary-600 mt-2 flex items-center gap-2">
            <Users className="w-6 h-6" /> {totalCompletions}
          </span>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm flex flex-col">
          <span className="text-slate-500 font-bold text-sm">Average Rating</span>
          <span className="text-3xl font-black text-amber-500 mt-2 flex items-center gap-2">
            <Star className="w-6 h-6 fill-amber-500" /> {avgRating}
          </span>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search interactive modules..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create Module
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
              <tr>
                <th className="px-6 py-4">Module Details</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Target Class</th>
                <th className="px-6 py-4">Completions</th>
                <th className="px-6 py-4">Avg Rating</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filteredModules.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-bold">
                    No e-learning modules found.
                  </td>
                </tr>
              ) : (
                filteredModules.map((row) => (
                  <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 text-primary-900 rounded-lg group-hover:bg-primary-100 transition-colors">
                          <MonitorPlay className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{row.title}</span>
                          <span className="text-xs font-bold text-slate-400">{row.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">{row.subject}</td>
                    <td className="px-6 py-4 font-bold text-slate-700">{row.targetClass}</td>
                    <td className="px-6 py-4 font-black text-slate-800">{row.completions}</td>
                    <td className="px-6 py-4 font-bold text-slate-600">
                      {parseFloat(row.rating) > 0 ? `⭐ ${row.rating}` : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getStatusStyle(row.status)}`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-slate-400 hover:text-primary-900 hover:bg-slate-100 rounded-lg transition-colors" title="Preview">
                          <PlayCircle className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleOpenModal(row)}
                          className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-slate-100 rounded-lg transition-colors" 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(row.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition-colors" 
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-200/60 flex items-center justify-between text-sm font-bold text-slate-500 bg-white/40 mt-auto">
          <span>Showing {filteredModules.length} of {modules.length} modules</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm" disabled>Prev</button>
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm" disabled={filteredModules.length <= 10}>Next</button>
          </div>
        </div>
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-black text-slate-800 text-lg">
                {editingModule ? "Edit Module" : "Create Module"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Module Title
                </label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-all"
                  placeholder="e.g., Introduction to Algebra"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Subject
                  </label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-all"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="English">English</option>
                    <option value="Social Studies">Social Studies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Target Class
                  </label>
                  <select 
                    value={formData.targetClass}
                    onChange={(e) => setFormData({...formData, targetClass: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-all"
                  >
                    <option value="Grade 4">Grade 4</option>
                    <option value="Grade 5">Grade 5</option>
                    <option value="Grade 6">Grade 6</option>
                    <option value="Form 1">Form 1</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Status
                </label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value as "Draft" | "Published"})}
                  className="w-full px-4 py-2.5 text-sm font-bold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 transition-all"
                >
                  <option value="Draft">Draft</option>
                  <option value="Published">Published</option>
                </select>
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-sm transition-colors"
                >
                  {editingModule ? "Save Changes" : "Create Module"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
