"use client";

import React, { useState, useMemo } from "react";
import { HeartHandshake, CheckCircle2, Plus, Clock, Edit, Trash2, X } from "lucide-react";

interface Intervention {
  id: string;
  student: string;
  grade: string;
  issue: string;
  goal: string;
  action: string;
  status: "Active" | "Monitoring" | "Completed";
  progress: number;
  nextReview: string;
  staff: string;
}

const initialInterventions: Intervention[] = [
  { id: "1", student: "Brian Mwangi", grade: "Grade 10", issue: "Repeated absenteeism", goal: "Attendance > 90%", action: "Mentor Assigned", status: "Active", progress: 60, nextReview: "2026-10-15", staff: "Mr. Omondi" },
  { id: "2", student: "Mary Wanjiku", grade: "Grade 9", issue: "Academic concern", goal: "Improve Math scores", action: "Counselling Referral", status: "Monitoring", progress: 30, nextReview: "2026-10-20", staff: "Mrs. Kariuki" },
  { id: "3", student: "John Kamau", grade: "Grade 11", issue: "Disruptive behavior", goal: "0 incidents in 4 weeks", action: "Behavior Contract", status: "Active", progress: 85, nextReview: "2026-10-12", staff: "Mr. Kiprono" },
  { id: "4", student: "Alice Wambui", grade: "Grade 8", issue: "Peer conflicts", goal: "Mediation sessions completed", action: "Group Therapy", status: "Completed", progress: 100, nextReview: "2026-10-01", staff: "Ms. Achieng" },
];

export default function InterventionsPage() {
  const [interventions, setInterventions] = useState<Intervention[]>(initialInterventions);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);

  const [formData, setFormData] = useState<Omit<Intervention, "id">>({
    student: "",
    grade: "Grade 9",
    issue: "",
    goal: "",
    action: "",
    status: "Active",
    progress: 0,
    nextReview: "",
    staff: "",
  });

  const summary = useMemo(() => {
    const total = interventions.length;
    const active = interventions.filter((i) => i.status === "Active").length;
    const monitoring = interventions.filter((i) => i.status === "Monitoring").length;
    const completed = interventions.filter((i) => i.status === "Completed").length;
    const avgProgress = total > 0 
      ? Math.round(interventions.reduce((acc, curr) => acc + curr.progress, 0) / total) 
      : 0;

    return { total, active, monitoring, completed, avgProgress };
  }, [interventions]);

  const handleOpenModal = (intervention?: Intervention) => {
    if (intervention) {
      setEditingIntervention(intervention);
      setFormData(intervention);
    } else {
      setEditingIntervention(null);
      setFormData({
        student: "",
        grade: "Grade 9",
        issue: "",
        goal: "",
        action: "",
        status: "Active",
        progress: 0,
        nextReview: "",
        staff: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingIntervention(null);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIntervention) {
      setInterventions((prev) =>
        prev.map((i) => (i.id === editingIntervention.id ? { ...formData, id: i.id } : i))
      );
    } else {
      setInterventions((prev) => [
        ...prev,
        { ...formData, id: Math.random().toString(36).substring(2, 9) },
      ]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this intervention?")) {
      setInterventions((prev) => prev.filter((i) => i.id !== id));
    }
  };

  return (
    <div className="p-8 space-y-6 bg-white/30 backdrop-blur-md rounded-3xl min-h-[600px]">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/60 p-4 rounded-2xl border border-white/60 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-black text-slate-800">Support Interventions</h2>
            <p className="text-xs font-bold text-slate-500">Track student behavioral and welfare support plans</p>
          </div>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" /> New Intervention
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: "Total Plans", value: summary.total, color: "text-slate-800" },
          { label: "Active", value: summary.active, color: "text-indigo-600" },
          { label: "Monitoring", value: summary.monitoring, color: "text-amber-600" },
          { label: "Completed", value: summary.completed, color: "text-emerald-600" },
          { label: "Avg Progress", value: `${summary.avgProgress}%`, color: "text-blue-600" },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white/80 p-4 rounded-2xl border border-white shadow-sm flex flex-col items-center justify-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</span>
            <span className={`text-2xl font-black ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Interventions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {interventions.map((inv) => (
          <div key={inv.id} className="bg-white/80 border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-black text-slate-800 text-lg group-hover:text-indigo-700 transition-colors">{inv.student}</h3>
                <p className="text-xs font-bold text-slate-500">{inv.grade} • {inv.staff}</p>
              </div>
              <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border rounded shadow-sm ${
                inv.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                inv.status === 'Monitoring' ? 'bg-amber-50 text-amber-600 border-amber-200' :
                'bg-indigo-50 text-indigo-600 border-indigo-100'
              }`}>
                {inv.status}
              </span>
            </div>
            
            <div className="space-y-3 mb-5 flex-1">
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-0.5">Issue</div>
                <div className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">{inv.issue}</div>
              </div>
              <div>
                <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-0.5">Goal</div>
                <div className="text-sm font-medium text-slate-700 bg-emerald-50/50 px-3 py-1.5 rounded-lg border border-emerald-100/50 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span className="truncate">{inv.goal}</span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center text-xs font-bold mb-1">
                <span className="text-slate-500 uppercase tracking-wider">Progress</span>
                <span className="text-indigo-600">{inv.progress}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${inv.progress === 100 ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                  style={{ width: `${inv.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Review: {inv.nextReview}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleOpenModal(inv)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDelete(inv.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-lg font-black text-slate-800">
                {editingIntervention ? "Edit Intervention" : "New Intervention"}
              </h3>
              <button onClick={handleCloseModal} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Student Name</label>
                  <input
                    required
                    type="text"
                    value={formData.student}
                    onChange={(e) => setFormData({ ...formData, student: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-slate-700"
                    placeholder="e.g. Brian Mwangi"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Grade</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-slate-700"
                  >
                    {["Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Staff Assigned</label>
                  <input
                    required
                    type="text"
                    value={formData.staff}
                    onChange={(e) => setFormData({ ...formData, staff: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-slate-700"
                    placeholder="e.g. Mr. Omondi"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Intervention['status'] })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-slate-700"
                  >
                    <option value="Active">Active</option>
                    <option value="Monitoring">Monitoring</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Issue Description</label>
                  <input
                    required
                    type="text"
                    value={formData.issue}
                    onChange={(e) => setFormData({ ...formData, issue: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-slate-700"
                    placeholder="e.g. Repeated absenteeism"
                  />
                </div>
                
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Goal</label>
                  <input
                    required
                    type="text"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-slate-700"
                    placeholder="e.g. Attendance > 90%"
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-bold text-slate-500 uppercase">Action Plan</label>
                  <input
                    required
                    type="text"
                    value={formData.action}
                    onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-slate-700"
                    placeholder="e.g. Mentor Assigned"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Progress (%)</label>
                  <input
                    required
                    type="number"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-slate-700"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Next Review Date</label>
                  <input
                    required
                    type="date"
                    value={formData.nextReview}
                    onChange={(e) => setFormData({ ...formData, nextReview: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-medium text-slate-700"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors shadow-sm"
                >
                  {editingIntervention ? "Save Changes" : "Create Intervention"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
