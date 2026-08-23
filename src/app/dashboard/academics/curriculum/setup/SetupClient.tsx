"use client";

import React, { useState } from "react";
import { Search, Filter, Plus, MoreHorizontal, Sparkles, Settings, FileSignature, CheckCircle2, AlertTriangle, Trash2, X } from "lucide-react";
import { createExam, deleteExam } from "@/app/actions/curriculum";

export default function SetupClient({ initialExams, academicTerms }: { initialExams: any[], academicTerms: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    academicTermId: "",
    startDate: "",
    endDate: ""
  });

  const getStatus = (startDate: string, endDate: string) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (now < start) return "Upcoming";
    if (now > end) return "Completed";
    return "Active";
  };

  const processedData = initialExams.map(exam => ({
    id: exam.id,
    name: exam.name,
    term: exam.academicTerm?.name || "Unknown Term",
    status: getStatus(exam.startDate, exam.endDate),
    startDate: exam.startDate,
    endDate: exam.endDate
  }));

  const filteredData = processedData.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.term.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: processedData.length,
    active: processedData.filter(e => e.status === 'Active').length,
    upcoming: processedData.filter(e => e.status === 'Upcoming').length,
    completed: processedData.filter(e => e.status === 'Completed').length,
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.academicTermId || !formData.startDate || !formData.endDate) return;
    
    setIsSubmitting(true);
    try {
      await createExam({
        name: formData.name,
        academicTermId: formData.academicTermId,
        startDate: new Date(formData.startDate),
        endDate: new Date(formData.endDate)
      });
      setIsModalOpen(false);
      setFormData({ name: "", academicTermId: "", startDate: "", endDate: "" });
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this exam?")) return;
    try {
      await deleteExam(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Assessments",  value: stats.total,    icon: FileSignature, color: "from-primary-600 to-primary-800" },
          { label: "Active Now",         value: stats.active,   icon: CheckCircle2,  color: "from-emerald-500 to-teal-600" },
          { label: "Upcoming",           value: stats.upcoming, icon: AlertTriangle, color: "from-amber-500 to-orange-500" },
          { label: "Completed",          value: stats.completed,icon: Settings,      color: "from-blue-500 to-indigo-600" },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={`bg-gradient-to-br ${c.color} rounded-2xl p-4 text-white shadow-md flex items-center gap-3 relative overflow-hidden group`}>
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="relative z-10">
                <p className="text-2xl font-black leading-tight">{c.value}</p>
                <p className="text-xs font-bold text-white/80">{c.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Card */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[500px]">
        
        {/* Toolbar */}
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 bg-white/80">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search Exams..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 text-sm font-semibold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-400 transition-all w-64 placeholder:text-slate-400"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <button className="flex items-center gap-2 px-3 py-2 text-sm font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 shadow-sm transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-md shadow-primary-900/20 hover:-translate-y-0.5 transition-all"
            >
              <Plus className="w-4 h-4" /> Create Exam
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-gradient-to-r from-primary-900 to-primary-800 text-white">
              <tr>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Exam Name</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Term</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Start Date</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-[11px] font-black uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredData.map((row) => {
                const isActive = row.status === 'Active';
                return (
                  <tr key={row.id} className="hover:bg-primary-50/40 border-l-4 border-transparent hover:border-l-secondary-500 transition-all group">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border bg-slate-50 text-slate-600 border-slate-200">
                          <Settings className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-slate-800">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-600">{row.term}</td>
                    <td className="px-5 py-4">
                      <span className="text-slate-600 font-semibold">
                        {new Date(row.startDate).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-black border ${
                        isActive ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                        row.status === 'Completed' ? 'bg-slate-50 text-slate-600 border-slate-200' :
                        row.status === 'Upcoming' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? 'bg-emerald-500' : 
                          row.status === 'Completed' ? 'bg-slate-400' : 
                          row.status === 'Upcoming' ? 'bg-blue-500' :
                          'bg-amber-500'
                        }`}></span>
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleDelete(row.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-slate-400">
              <Sparkles className="w-12 h-12 mb-3 opacity-20" />
              <p className="font-bold text-lg text-slate-500">No exams found</p>
              <p className="text-sm font-medium mt-1">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/60 mt-auto">
          <span className="font-bold">Showing <span className="text-primary-900">{filteredData.length}</span> records</span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg font-bold hover:bg-slate-50 disabled:opacity-40 transition-colors shadow-sm" disabled>Prev</button>
            <button className="px-3 py-1.5 border border-slate-200 bg-white rounded-lg font-bold hover:bg-slate-50 transition-colors shadow-sm">Next</button>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-lg font-black text-slate-800">Create New Exam</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Exam Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g. Mid Term 1"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1">Academic Term</label>
                <select
                  required
                  value={formData.academicTermId}
                  onChange={e => setFormData({...formData, academicTermId: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="">Select Term...</option>
                  {academicTerms.map(term => (
                    <option key={term.id} value={term.id}>{term.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.startDate}
                    onChange={e => setFormData({...formData, startDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">End Date</label>
                  <input 
                    type="date" 
                    required
                    value={formData.endDate}
                    onChange={e => setFormData({...formData, endDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 mt-6">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-black text-white bg-primary-600 hover:bg-primary-700 rounded-xl shadow-md disabled:opacity-50 transition-colors"
                >
                  {isSubmitting ? "Saving..." : "Create Exam"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}