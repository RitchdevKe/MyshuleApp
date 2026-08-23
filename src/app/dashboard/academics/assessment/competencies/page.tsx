"use client";

import React, { useState, useMemo } from "react";
import { Search, Plus, Target, Edit, Trash2, X } from "lucide-react";

type Competency = {
  id: string;
  code: string;
  competency: string;
  level: string;
  description: string;
  mappedSubject: string;
  status: "Active" | "Draft";
};

export default function CompetenciesPage() {
  const [competencies, setCompetencies] = useState<Competency[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("All Grade Levels");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Omit<Competency, "id">>({
    code: "",
    competency: "",
    level: "Grade 4",
    description: "",
    mappedSubject: "",
    status: "Active"
  });

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      code: "",
      competency: "",
      level: "Grade 4",
      description: "",
      mappedSubject: "",
      status: "Active"
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (comp: Competency) => {
    setEditingId(comp.id);
    setFormData({
      code: comp.code,
      competency: comp.competency,
      level: comp.level,
      description: comp.description,
      mappedSubject: comp.mappedSubject,
      status: comp.status,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this competency?")) {
      setCompetencies(prev => prev.filter(c => c.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      setCompetencies(prev => prev.map(c => c.id === editingId ? { ...formData, id: editingId } : c));
    } else {
      setCompetencies(prev => [...prev, { ...formData, id: crypto.randomUUID() }]);
    }
    setIsModalOpen(false);
  };

  const filteredCompetencies = useMemo(() => {
    return competencies.filter(c => {
      const matchesSearch = c.competency.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            c.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesLevel = filterLevel === "All Grade Levels" || c.level === filterLevel;
      return matchesSearch && matchesLevel;
    });
  }, [competencies, searchTerm, filterLevel]);

  const summary = useMemo(() => {
    return {
      total: competencies.length,
      active: competencies.filter(c => c.status === "Active").length,
      draft: competencies.filter(c => c.status === "Draft").length,
      subjects: new Set(competencies.map(c => c.mappedSubject).filter(Boolean)).size
    };
  }, [competencies]);

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-sm flex flex-col">
          <span className="text-sm font-bold text-slate-500">Total Competencies</span>
          <span className="text-3xl font-black text-slate-800 mt-1">{summary.total}</span>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-sm flex flex-col">
          <span className="text-sm font-bold text-slate-500">Active</span>
          <span className="text-3xl font-black text-emerald-600 mt-1">{summary.active}</span>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-sm flex flex-col">
          <span className="text-sm font-bold text-slate-500">Draft</span>
          <span className="text-3xl font-black text-amber-600 mt-1">{summary.draft}</span>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-2xl p-4 shadow-sm flex flex-col">
          <span className="text-sm font-bold text-slate-500">Subjects Mapped</span>
          <span className="text-3xl font-black text-indigo-600 mt-1">{summary.subjects}</span>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search core competencies..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <select 
              value={filterLevel}
              onChange={(e) => setFilterLevel(e.target.value)}
              className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
            >
              <option>All Grade Levels</option>
              <option>Grade 4</option>
              <option>Grade 5</option>
              <option>Grade 6</option>
              <option>All Grades</option>
            </select>
            <button onClick={handleOpenAdd} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Add Competency
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
              <tr>
                <th className="px-6 py-4">Code & Competency</th>
                <th className="px-6 py-4">Level</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Subject Mapping</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filteredCompetencies.length > 0 ? (
                filteredCompetencies.map((row) => (
                  <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 text-primary-900 rounded-lg group-hover:bg-primary-100 transition-colors">
                          <Target className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{row.competency}</span>
                          <span className="text-xs font-bold text-slate-400">{row.code}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">{row.level}</td>
                    <td className="px-6 py-4 font-medium text-slate-500 max-w-xs truncate" title={row.description}>
                      {row.description}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600">
                      {row.mappedSubject ? (
                        <span className="bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm text-xs">
                          {row.mappedSubject}
                        </span>
                      ) : (
                        <span className="text-slate-400 text-xs italic">Unmapped</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${
                        row.status === 'Active' ? 'bg-emerald-100/80 text-emerald-700 border-emerald-200' : 'bg-amber-100/80 text-amber-700 border-amber-200'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenEdit(row)} className="p-1.5 text-slate-400 hover:text-primary-900 hover:bg-primary-50 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    No competencies found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-slate-200/60 flex items-center justify-between text-sm font-bold text-slate-500 bg-white/40 mt-auto">
          <span>Showing {filteredCompetencies.length} of {competencies.length} competencies</span>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-slate-800">{editingId ? "Edit Competency" : "Add Competency"}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Code</label>
                  <input required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="e.g. COMP-01" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Level</label>
                  <select value={formData.level} onChange={e => setFormData({...formData, level: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option>Grade 4</option>
                    <option>Grade 5</option>
                    <option>Grade 6</option>
                    <option>All Grades</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Competency Name</label>
                <input required value={formData.competency} onChange={e => setFormData({...formData, competency: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="e.g. Mathematical Reasoning" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase">Description</label>
                <textarea required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900 resize-none h-20" placeholder="Brief description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Mapped Subject</label>
                  <input required value={formData.mappedSubject} onChange={e => setFormData({...formData, mappedSubject: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" placeholder="e.g. Mathematics" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                  <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value as "Active" | "Draft"})} className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900">
                    <option>Active</option>
                    <option>Draft</option>
                  </select>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 mt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors shadow-sm">
                  {editingId ? "Save Changes" : "Add Competency"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}