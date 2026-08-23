"use client";

import React, { useState } from "react";
import { Search, Plus, LayoutList, CheckCircle2, Edit2, Trash2, X, BarChart3, FileText, CheckCircle, FileSignature } from "lucide-react";

type Rubric = {
  id: string;
  name: string;
  type: string;
  criteriaCount: number;
  levelsCount: number;
  mappedStrand: string;
  status: string;
};

export default function RubricsPage() {
  const [rubrics, setRubrics] = useState<Rubric[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Rubric>>({
    name: "",
    type: "Standard",
    criteriaCount: 4,
    levelsCount: 4,
    mappedStrand: "",
    status: "Draft",
  });

  const filteredRubrics = rubrics.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    r.mappedStrand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRubrics = rubrics.length;
  const activeRubrics = rubrics.filter(r => r.status === "Active").length;
  const draftRubrics = rubrics.filter(r => r.status === "Draft").length;
  const standardRubrics = rubrics.filter(r => r.type === "Standard").length;

  const handleOpenModal = (rubric?: Rubric) => {
    if (rubric) {
      setEditingId(rubric.id);
      setFormData(rubric);
    } else {
      setEditingId(null);
      setFormData({
        name: "",
        type: "Standard",
        criteriaCount: 4,
        levelsCount: 4,
        mappedStrand: "",
        status: "Draft",
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    
    if (editingId) {
      setRubrics(prev => prev.map(r => r.id === editingId ? { ...r, ...formData } as Rubric : r));
    } else {
      const newId = "RUB-" + Math.random().toString(36).substr(2, 5).toUpperCase();
      setRubrics(prev => [...prev, { ...formData, id: newId } as Rubric]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this rubric?")) {
      setRubrics(prev => prev.filter(r => r.id !== id));
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Active": return "bg-emerald-100/80 text-emerald-700 border-emerald-200";
      case "Draft": return "bg-slate-100/80 text-slate-700 border-slate-200";
      default: return "bg-slate-100/80 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-600">Total Rubrics</h3>
          </div>
          <p className="text-3xl font-black text-slate-800">{totalRubrics}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-600">Active Rubrics</h3>
          </div>
          <p className="text-3xl font-black text-slate-800">{activeRubrics}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
              <FileSignature className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-600">Draft Rubrics</h3>
          </div>
          <p className="text-3xl font-black text-slate-800">{draftRubrics}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-600">Standard Rubrics</h3>
          </div>
          <p className="text-3xl font-black text-slate-800">{standardRubrics}</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search rubrics..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm">
              <Plus className="w-4 h-4" /> Create Rubric
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
              <tr>
                <th className="px-6 py-4">Rubric Details</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Structure</th>
                <th className="px-6 py-4">Mapped Strand</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filteredRubrics.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-slate-500 font-medium">
                    No rubrics found. Click "Create Rubric" to add one.
                  </td>
                </tr>
              ) : (
                filteredRubrics.map((row) => (
                  <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 text-primary-900 rounded-lg group-hover:bg-primary-100 transition-colors">
                          <LayoutList className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{row.name}</span>
                          <span className="text-xs font-bold text-slate-400">{row.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-700">
                      <span className="bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-sm text-xs">
                        {row.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-slate-700">{row.criteriaCount} Criteria</span>
                        <span className="text-[10px] font-bold uppercase text-slate-400">{row.levelsCount} Levels</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600">
                      {row.mappedStrand}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getStatusStyle(row.status)}`}>
                        {row.status === "Active" && <CheckCircle2 className="w-3 h-3" />}
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(row)} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
          <span>Showing {filteredRubrics.length} of {rubrics.length} rubrics</span>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm" disabled>Prev</button>
            <button className="px-4 py-2 border border-slate-200 bg-white rounded-xl hover:bg-slate-50 disabled:opacity-50 transition-colors shadow-sm" disabled>Next</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">{editingId ? 'Edit Rubric' : 'Create Rubric'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Rubric Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all"
                  placeholder="e.g. CBC Primary Level Reading"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Type</label>
                  <select 
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all"
                  >
                    <option value="Standard">Standard</option>
                    <option value="Custom">Custom</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Status</label>
                  <select 
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-4 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Active">Active</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Criteria Count</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={formData.criteriaCount}
                    onChange={(e) => setFormData({...formData, criteriaCount: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Levels Count</label>
                  <input 
                    type="number" 
                    min="1"
                    required
                    value={formData.levelsCount}
                    onChange={(e) => setFormData({...formData, levelsCount: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1.5">Mapped Strand</label>
                <input 
                  type="text"
                  required
                  value={formData.mappedStrand}
                  onChange={(e) => setFormData({...formData, mappedStrand: e.target.value})}
                  className="w-full px-4 py-2.5 text-sm font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-all"
                  placeholder="e.g. Reading, Numbers"
                />
              </div>
              
              <div className="pt-4 flex items-center justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-sm transition-colors">
                  {editingId ? 'Save Changes' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}