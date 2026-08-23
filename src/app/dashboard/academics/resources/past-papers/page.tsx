"use client";
import React, { useState, useMemo } from "react";
import { Search, Plus, GraduationCap, Download, Edit, Trash2, X, FileText, CheckCircle } from "lucide-react";

interface PastPaper {
  id: string;
  title: string;
  category: string;
  year: string;
  downloads: number;
  status: string;
  subject: string;
  classLevel: string;
}

const initialPapers: PastPaper[] = [
  { id: "PP-001", title: "KCPE Mathematics 2025", category: "National Exams", year: "2025", downloads: 450, status: "Available", subject: "Mathematics", classLevel: "Class 8" },
  { id: "PP-002", title: "Grade 5 End Term 1 Science", category: "Internal Exams", year: "2026", downloads: 120, status: "Available", subject: "Science", classLevel: "Grade 5" },
  { id: "PP-003", title: "County Mock English Paper 1", category: "County Mocks", year: "2026", downloads: 85, status: "Available", subject: "English", classLevel: "Class 8" },
  { id: "PP-004", title: "KCPE Social Studies 2024", category: "National Exams", year: "2024", downloads: 890, status: "Available", subject: "Social Studies", classLevel: "Class 8" },
];

export default function PastPapersPage() {
  const [papers, setPapers] = useState<PastPaper[]>(initialPapers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<PastPaper>>({
    title: "",
    category: "National Exams",
    year: new Date().getFullYear().toString(),
    subject: "",
    classLevel: "",
    status: "Available"
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Available": return "bg-emerald-100/80 text-emerald-700 border-emerald-200";
      default: return "bg-slate-100/80 text-slate-700 border-slate-200";
    }
  };

  const handleOpenModal = (paper?: PastPaper) => {
    if (paper) {
      setEditingId(paper.id);
      setFormData(paper);
    } else {
      setEditingId(null);
      setFormData({
        title: "",
        category: "National Exams",
        year: new Date().getFullYear().toString(),
        subject: "",
        classLevel: "",
        status: "Available"
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setPapers(papers.map(p => p.id === editingId ? { ...p, ...formData } as PastPaper : p));
    } else {
      const newId = `PP-00${papers.length + 1}`;
      setPapers([{ ...formData, id: newId, downloads: 0 } as PastPaper, ...papers]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this paper?")) {
      setPapers(papers.filter(p => p.id !== id));
    }
  };

  const filteredPapers = useMemo(() => {
    return papers.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.subject.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All Categories" || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [papers, searchQuery, selectedCategory]);

  const totalPapers = papers.length;
  const totalDownloads = papers.reduce((acc, p) => acc + p.downloads, 0);
  const nationalExams = papers.filter(p => p.category === "National Exams").length;
  const availablePapers = papers.filter(p => p.status === "Available").length;

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Papers", value: totalPapers, icon: FileText, color: "text-primary-600", bg: "bg-primary-50" },
          { label: "Total Downloads", value: totalDownloads, icon: Download, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "National Exams", value: nationalExams, icon: GraduationCap, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Available Now", value: availablePapers, icon: CheckCircle, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center shrink-0`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">{stat.label}</p>
              <p className="text-2xl font-black text-slate-800">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search past papers or subjects..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              <option>All Categories</option>
              <option>National Exams</option>
              <option>Internal Exams</option>
              <option>County Mocks</option>
            </select>
            <button 
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Upload Paper
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
              <tr>
                <th className="px-6 py-4">Paper Title</th>
                <th className="px-6 py-4">Subject & Class</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Year</th>
                <th className="px-6 py-4">Downloads</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filteredPapers.map((row) => (
                <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary-50 text-primary-900 rounded-lg group-hover:bg-primary-100 transition-colors">
                        <GraduationCap className="w-4 h-4" />
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800">{row.title}</span>
                        <span className="text-xs font-bold text-slate-400">{row.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700">{row.subject}</span>
                      <span className="text-xs font-medium text-slate-500">{row.classLevel}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm text-xs font-bold text-slate-600">
                      {row.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-700">{row.year}</td>
                  <td className="px-6 py-4 font-black text-slate-800">{row.downloads}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getStatusStyle(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleOpenModal(row)}
                        className="p-1.5 text-slate-400 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(row.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredPapers.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No past papers found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-200/60 flex items-center justify-between text-sm font-bold text-slate-500 bg-white/40 mt-auto">
          <span>Showing {filteredPapers.length} of {papers.length} past papers</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm" disabled>Prev</button>
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">
                {editingId ? "Edit Past Paper" : "Upload Past Paper"}
              </h3>
              <button 
                onClick={handleCloseModal}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Paper Title</label>
                <input 
                  type="text" 
                  required
                  value={formData.title || ""}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                  placeholder="e.g. KCPE Mathematics 2025"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Subject</label>
                  <input 
                    type="text" 
                    required
                    value={formData.subject || ""}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                    placeholder="e.g. Mathematics"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Class Level</label>
                  <input 
                    type="text" 
                    required
                    value={formData.classLevel || ""}
                    onChange={(e) => setFormData({...formData, classLevel: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                    placeholder="e.g. Class 8"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Category</label>
                  <select 
                    value={formData.category || "National Exams"}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                  >
                    <option value="National Exams">National Exams</option>
                    <option value="Internal Exams">Internal Exams</option>
                    <option value="County Mocks">County Mocks</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Year</label>
                  <input 
                    type="text" 
                    required
                    value={formData.year || ""}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900/20 focus:border-primary-900"
                    placeholder="e.g. 2025"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors shadow-sm shadow-primary-900/20"
                >
                  {editingId ? "Save Changes" : "Upload Paper"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
