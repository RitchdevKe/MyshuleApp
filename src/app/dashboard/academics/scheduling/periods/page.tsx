"use client";
import React, { useState, useMemo } from "react";
import { Search, Plus, Clock, ArrowRight, Edit, Trash, X } from "lucide-react";

type PeriodType = "Teaching" | "Break" | "Non-Teaching";

type Period = {
  id: string;
  name: string;
  start: string;
  end: string;
  type: PeriodType;
};

const initialPeriods: Period[] = [
  { id: "PRD-001", name: "Assembly", start: "08:00", end: "08:20", type: "Non-Teaching" },
  { id: "PRD-002", name: "Period 1", start: "08:20", end: "09:00", type: "Teaching" },
  { id: "PRD-003", name: "Period 2", start: "09:00", end: "09:40", type: "Teaching" },
  { id: "PRD-004", name: "Break", start: "09:40", end: "10:00", type: "Break" },
  { id: "PRD-005", name: "Period 3", start: "10:00", end: "10:40", type: "Teaching" },
];

function parseTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number);
  return h * 60 + m;
}

function calculateDuration(start: string, end: string) {
  return Math.max(0, parseTime(end) - parseTime(start));
}

function formatTime(timeStr: string) {
  const [hStr, mStr] = timeStr.split(':');
  let h = parseInt(hStr, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const h2 = h < 10 ? '0' + h : h;
  return `${h2}:${mStr} ${ampm}`;
}

export default function PeriodsPage() {
  const [periods, setPeriods] = useState<Period[]>(initialPeriods);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPeriodId, setEditingPeriodId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    start: "08:00",
    end: "09:00",
    type: "Teaching" as PeriodType
  });

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "Teaching": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Break": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Non-Teaching": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const filteredAndSortedPeriods = useMemo(() => {
    return [...periods]
      .sort((a, b) => parseTime(a.start) - parseTime(b.start))
      .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [periods, searchQuery]);

  const { totalTeaching, totalBreak } = useMemo(() => {
    let teaching = 0;
    let brk = 0;
    periods.forEach(p => {
      const duration = calculateDuration(p.start, p.end);
      if (p.type === "Teaching") teaching += duration;
      else if (p.type === "Break") brk += duration;
    });
    return { totalTeaching: teaching, totalBreak: brk };
  }, [periods]);

  const handleEdit = (p: Period) => {
    setEditingPeriodId(p.id);
    setFormData({ name: p.name, start: p.start, end: p.end, type: p.type });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this period?")) {
      setPeriods(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPeriodId) {
      setPeriods(prev => prev.map(p => p.id === editingPeriodId ? { ...p, ...formData } : p));
    } else {
      const newId = `PRD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      setPeriods(prev => [...prev, { id: newId, ...formData }]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border border-white/60 shadow-lg">
          <h3 className="text-sm font-bold text-slate-500">Total Periods</h3>
          <p className="text-3xl font-black text-slate-800 mt-1">{periods.length}</p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Active building blocks for timetables</p>
        </div>
        <div className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border border-white/60 shadow-lg">
          <h3 className="text-sm font-bold text-slate-500">Teaching Time</h3>
          <p className="text-3xl font-black text-blue-700 mt-1">{totalTeaching} <span className="text-lg text-blue-500/70">mins</span></p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Daily instructional time</p>
        </div>
        <div className="bg-white/60 backdrop-blur-xl p-5 rounded-3xl border border-white/60 shadow-lg">
          <h3 className="text-sm font-bold text-slate-500">Break Time</h3>
          <p className="text-3xl font-black text-emerald-700 mt-1">{totalBreak} <span className="text-lg text-emerald-500/70">mins</span></p>
          <p className="text-xs text-slate-400 mt-1 font-medium">Scheduled rest and meals</p>
        </div>
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-3xl shadow-lg overflow-hidden flex flex-col min-h-[400px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search periods..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm font-bold bg-white/80 border border-slate-200/60 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-900 focus:border-primary-900 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-3">
            <select className="px-4 py-2.5 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
              <option>Standard Day</option>
              <option>Short Day</option>
            </select>
            <button 
              onClick={() => {
                setEditingPeriodId(null);
                setFormData({ name: "", start: "08:00", end: "09:00", type: "Teaching" });
                setIsModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-primary-900 rounded-xl hover:bg-primary-800 transition-colors shadow-sm"
            >
              <Plus className="w-4 h-4" /> Add Period
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
              <tr>
                <th className="px-6 py-4">Period Name</th>
                <th className="px-6 py-4">Time Slot</th>
                <th className="px-6 py-4">Duration</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60">
              {filteredAndSortedPeriods.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">
                    No periods found.
                  </td>
                </tr>
              ) : (
                filteredAndSortedPeriods.map((row) => (
                  <tr key={row.id} className="hover:bg-white/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary-50 text-primary-900 rounded-lg group-hover:bg-primary-100 transition-colors">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-800">{row.name}</span>
                          <span className="text-xs font-bold text-slate-400">{row.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 font-bold text-slate-700">
                        <span>{formatTime(row.start)}</span>
                        <ArrowRight className="w-3 h-3 text-slate-400" />
                        <span>{formatTime(row.end)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600">{calculateDuration(row.start, row.end)} mins</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold border backdrop-blur-sm ${getTypeStyle(row.type)}`}>
                        {row.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleEdit(row)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit Period">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(row.id)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete Period">
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-black text-slate-800">
                {editingPeriodId ? "Edit Period" : "Add Period"}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Period Name</label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-colors"
                  placeholder="e.g., Period 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Start Time</label>
                  <input 
                    type="time" 
                    required
                    value={formData.start}
                    onChange={e => setFormData({...formData, start: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">End Time</label>
                  <input 
                    type="time" 
                    required
                    value={formData.end}
                    onChange={e => setFormData({...formData, end: e.target.value})}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-1.5">Period Type</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as PeriodType})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-900 focus:bg-white transition-colors"
                >
                  <option value="Teaching">Teaching</option>
                  <option value="Break">Break</option>
                  <option value="Non-Teaching">Non-Teaching</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-xl shadow-sm transition-colors"
                >
                  Save Period
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}