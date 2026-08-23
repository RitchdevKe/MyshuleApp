"use client";

import React, { useState, useEffect } from "react";
import { Target, TrendingUp, Filter, Plus, Flag, AlertTriangle, Users, Pencil, Trash2, X, CheckCircle2, Loader2 } from "lucide-react";
import { getStaff, getGoals, createGoal, updateGoal, deleteGoal } from "./actions";

type Goal = {
  id: string;
  title: string;
  owner: string;
  staffId: string;
  progress: number;
  status: "On Track" | "At Risk" | "Off Track" | string;
  type: "Department" | "Individual" | string;
  dueDate: string;
};

type StaffMember = {
  id: string;
  name: string;
  department: string;
};

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState<Partial<Goal>>({
    title: "",
    staffId: "",
    progress: 0,
    status: "On Track",
    type: "Individual",
    dueDate: "",
  });

  const loadData = async () => {
    setIsLoading(true);
    try {
      const goalsData = await getGoals();
      setGoals(goalsData);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function init() {
      const staffData = await getStaff();
      setStaff(staffData);
      await loadData();
    }
    init();
  }, []);

  const totalGoals = goals.length;
  const onTrackGoals = goals.filter((g) => g.status === "On Track").length;
  const atRiskGoals = goals.filter((g) => g.status === "At Risk").length;
  const offTrackGoals = goals.filter((g) => g.status === "Off Track").length;
  const avgProgress = totalGoals > 0 ? Math.round(goals.reduce((acc, g) => acc + g.progress, 0) / totalGoals) : 0;

  const handleOpenModal = (goal?: Goal) => {
    if (goal) {
      setEditingGoal(goal);
      setFormData(goal);
    } else {
      setEditingGoal(null);
      setFormData({
        title: "",
        staffId: "",
        progress: 0,
        status: "On Track",
        type: "Individual",
        dueDate: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingGoal(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.staffId || !formData.dueDate) return;

    setIsSaving(true);
    try {
      if (editingGoal) {
        await updateGoal(editingGoal.id, {
          title: formData.title,
          staffId: formData.staffId,
          status: formData.status || "On Track",
          progress: formData.progress || 0,
          dueDate: formData.dueDate,
        });
      } else {
        await createGoal({
          title: formData.title,
          staffId: formData.staffId,
          status: formData.status || "On Track",
          progress: formData.progress || 0,
          dueDate: formData.dueDate,
        });
      }
      await loadData();
      handleCloseModal();
    } catch (error) {
      console.error("Failed to save goal:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      try {
        await deleteGoal(id);
        await loadData();
      } catch (error) {
        console.error("Failed to delete goal:", error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-2xl font-black text-slate-800">Goals & KPIs</h2>
           <p className="text-sm font-medium text-slate-500 mt-1">Track department objectives and individual performance targets.</p>
        </div>
        <div className="flex gap-2">
           <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
              <Filter className="w-4 h-4" />
              Filter
           </button>
           <button 
             onClick={() => handleOpenModal()}
             className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
           >
              <Plus className="w-4 h-4" />
              New Goal
           </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">Total Goals</span>
            <Target className="w-5 h-5 text-primary-500" />
          </div>
          <span className="text-2xl font-black text-slate-800 mt-2">{totalGoals}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">On Track</span>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <span className="text-2xl font-black text-slate-800 mt-2">{onTrackGoals}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">At Risk</span>
            <AlertTriangle className="w-5 h-5 text-amber-500" />
          </div>
          <span className="text-2xl font-black text-slate-800 mt-2">{atRiskGoals}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">Off Track</span>
            <TrendingUp className="w-5 h-5 text-rose-500 rotate-180" />
          </div>
          <span className="text-2xl font-black text-slate-800 mt-2">{offTrackGoals}</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-slate-500">Avg Progress</span>
            <TrendingUp className="w-5 h-5 text-indigo-500" />
          </div>
          <span className="text-2xl font-black text-slate-800 mt-2">{avgProgress}%</span>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 border-dashed">
          <Target className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-800 mb-1">No goals found</h3>
          <p className="text-sm text-slate-500">Create a new goal to start tracking performance.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {goals.map((goal) => (
              <div key={goal.id} className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm p-6 hover:shadow-xl transition-all duration-300 group flex flex-col relative">
                 <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button onClick={() => handleOpenModal(goal)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                     <Pencil className="w-4 h-4" />
                   </button>
                   <button onClick={() => handleDelete(goal.id)} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
                 
                 <div className="flex justify-between items-start mb-4 pr-16">
                    <div className="flex items-center gap-2">
                       <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg flex items-center gap-1 ${
                          goal.type === 'Department' ? 'bg-primary-50 text-primary-600' : 'bg-slate-100 text-slate-600'
                       }`}>
                          {goal.type === 'Department' ? <Users className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                          {goal.type}
                       </span>
                    </div>
                    <div className="flex items-center gap-1">
                       <span className={`px-2 py-1 text-xs font-bold rounded-lg ${
                          goal.status === 'On Track' ? 'bg-emerald-50 text-emerald-600' :
                          goal.status === 'At Risk' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                       }`}>
                          {goal.status}
                       </span>
                    </div>
                 </div>
                 
                 <h3 className="font-black text-slate-800 mb-1 leading-snug">{goal.title}</h3>
                 <p className="text-xs font-bold text-slate-400 mb-6">Owner: <span className="text-slate-600">{goal.owner}</span></p>

                 <div className="mt-auto">
                    <div className="flex justify-between items-end mb-2">
                       <p className="text-xs font-bold text-slate-500">Progress</p>
                       <p className="text-lg font-black text-slate-800">{goal.progress}%</p>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-4">
                       <div 
                          className={`h-full rounded-full ${
                             goal.status === 'On Track' ? 'bg-emerald-500' :
                             goal.status === 'At Risk' ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                       ></div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                       <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                          <Flag className="w-3.5 h-3.5 text-slate-400" />
                          Due: {goal.dueDate}
                       </div>
                       <button onClick={() => handleOpenModal(goal)} className="text-sm font-bold text-primary-600 hover:text-primary-800">
                          Update
                       </button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-200">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-black text-lg text-slate-800">
                {editingGoal ? "Edit Goal" : "New Goal"}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Title</label>
                <input 
                  type="text" 
                  value={formData.title} 
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  placeholder="e.g. Improve Student Test Scores"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Type</label>
                  <select 
                    value={formData.type} 
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="Individual">Individual</option>
                    <option value="Department">Department</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Owner</label>
                  <select 
                    value={formData.staffId || ""} 
                    onChange={(e) => setFormData({...formData, staffId: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    required
                  >
                    <option value="" disabled>Select Owner</option>
                    {staff.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Status</label>
                  <select 
                    value={formData.status} 
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                  >
                    <option value="On Track">On Track</option>
                    <option value="At Risk">At Risk</option>
                    <option value="Off Track">Off Track</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Due Date</label>
                  <input 
                    type="date" 
                    value={formData.dueDate} 
                    onChange={(e) => setFormData({...formData, dueDate: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">Progress</label>
                  <span className="text-xs font-bold text-slate-500">{formData.progress}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={formData.progress} 
                  onChange={(e) => setFormData({...formData, progress: parseInt(e.target.value)})}
                  className="w-full accent-primary-600"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={handleCloseModal}
                  disabled={isSaving}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors disabled:opacity-70"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-colors shadow-sm shadow-primary-900/20 disabled:opacity-70"
                >
                  {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingGoal ? "Save Changes" : "Create Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
