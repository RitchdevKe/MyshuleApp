"use client";

import React, { useState, useEffect, useTransition } from "react";
import { LineChart, Search, Filter, Play, CheckCircle2, AlertCircle, Clock, Star, Plus, Edit, Trash2, X } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { createAppraisal, updateAppraisal, deleteAppraisal } from "./actions";

type Status = "Completed" | "Pending Review" | "In Progress";

interface Appraisal {
  id: string;
  employee: string;
  role: string;
  staffId: string;
  reviewerId: string;
  reviewer: string;
  score: number | null;
  rating: string;
  status: Status;
  date: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
}

interface AppraisalsClientProps {
  initialAppraisals: Appraisal[];
  staffMembers: StaffMember[];
}

export function AppraisalsClient({ initialAppraisals, staffMembers }: AppraisalsClientProps) {
  const [appraisals, setAppraisals] = useState<Appraisal[]>(initialAppraisals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppraisal, setEditingAppraisal] = useState<Appraisal | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [isPending, startTransition] = useTransition();

  const searchParams = useSearchParams();
  const router = useRouter();

  // Sync state with props in case of revalidation
  useEffect(() => {
    setAppraisals(initialAppraisals);
  }, [initialAppraisals]);

  useEffect(() => {
    const handleOpenModal = () => {
      setEditingAppraisal(null);
      setIsModalOpen(true);
    };

    window.addEventListener("open_new_appraisal_modal", handleOpenModal);
    
    if (searchParams.get("add") === "true") {
      handleOpenModal();
      router.replace("/dashboard/human-resources/performance/appraisals");
    }

    return () => {
      window.removeEventListener("open_new_appraisal_modal", handleOpenModal);
    };
  }, [searchParams, router]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this appraisal?")) {
      // Optimistic update
      setAppraisals(prev => prev.filter(a => a.id !== id));
      
      startTransition(async () => {
        const result = await deleteAppraisal(id);
        if (!result.success) {
          // Revert if failed
          setAppraisals(initialAppraisals);
          alert(result.error);
        }
      });
    }
  };

  const handleEdit = (appraisal: Appraisal) => {
    setEditingAppraisal(appraisal);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const scoreVal = formData.get("score") as string;
    const staffId = formData.get("staffId") as string;
    const reviewerId = formData.get("reviewerId") as string;
    const status = formData.get("status") as Status;
    const score = scoreVal ? parseFloat(scoreVal) : null;
    
    // Find staff to construct optimistic data
    const staff = staffMembers.find(s => s.id === staffId);
    const reviewer = staffMembers.find(s => s.id === reviewerId);
    
    if (!staff || !reviewer) return;
    
    let rating = "Pending";
    if (score !== null) {
      if (score >= 4.5) rating = "Outstanding";
      else if (score >= 4.0) rating = "Exceeds Expectations";
      else if (score >= 3.0) rating = "Meets Expectations";
      else rating = "Needs Improvement";
    }

    const optimisticAppraisal: Appraisal = {
      id: editingAppraisal?.id || `temp-${Date.now()}`,
      employee: staff.name,
      role: staff.role,
      staffId,
      reviewerId,
      reviewer: reviewer.name,
      score,
      rating,
      status,
      date: editingAppraisal ? editingAppraisal.date : new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    // Optimistic update
    if (editingAppraisal) {
      setAppraisals(prev => prev.map(a => a.id === editingAppraisal.id ? optimisticAppraisal : a));
    } else {
      setAppraisals(prev => [optimisticAppraisal, ...prev]);
    }

    setIsModalOpen(false);
    setEditingAppraisal(null);

    startTransition(async () => {
      const data = { staffId, reviewerId, status, score };
      let result;
      if (editingAppraisal) {
        result = await updateAppraisal(editingAppraisal.id, data);
      } else {
        result = await createAppraisal(data);
      }
      
      if (!result.success) {
        setAppraisals(initialAppraisals);
        alert(result.error);
      }
    });
  };

  const filteredAppraisals = appraisals.filter(app => {
    const matchesSearch = app.employee.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.reviewer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          app.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Statuses" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalAppraisals = appraisals.length;
  const completedAppraisals = appraisals.filter(a => a.status === "Completed").length;
  const completionRate = totalAppraisals > 0 ? Math.round((completedAppraisals / totalAppraisals) * 100) : 0;
  
  const appraisalsWithScore = appraisals.filter(a => a.score !== null);
  const averageScore = appraisalsWithScore.length > 0 
    ? (appraisalsWithScore.reduce((acc, a) => acc + (a.score || 0), 0) / appraisalsWithScore.length).toFixed(1)
    : "0.0";
    
  const pendingReviews = appraisals.filter(a => a.status === "Pending Review").length;

  return (
    <div className="space-y-6">
      {/* Current Cycle Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex flex-col justify-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Current Cycle</p>
          <p className="text-2xl font-black text-slate-800">2024 H1 Review</p>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
             <LineChart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Completion Rate</p>
            <p className="text-2xl font-black text-slate-800">{completionRate}%</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
             <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Score</p>
            <p className="text-2xl font-black text-slate-800">{averageScore} <span className="text-sm font-bold text-slate-400">/ 5.0</span></p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center justify-between">
           <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Actions</p>
              <p className="text-sm font-bold text-amber-600">{pendingReviews} Pending Reviews</p>
           </div>
           <button 
             onClick={() => {
                setEditingAppraisal(null);
                setIsModalOpen(true);
             }}
             className="p-3 bg-primary-900 hover:bg-primary-800 text-white rounded-xl transition-colors shadow-sm shadow-primary-900/20"
             title="Start New Appraisal"
           >
              <Plus className="w-5 h-5" />
           </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search appraisals..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer"
              >
                 <option value="All Statuses">All Statuses</option>
                 <option value="Completed">Completed</option>
                 <option value="Pending Review">Pending Review</option>
                 <option value="In Progress">In Progress</option>
              </select>
              <button 
                onClick={() => {
                   setEditingAppraisal(null);
                   setIsModalOpen(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                 <Plus className="w-4 h-4" />
                 New Appraisal
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Employee</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Reviewer</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Score</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Overall Rating</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAppraisals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 text-sm">
                    No appraisals found.
                  </td>
                </tr>
              ) : (
                filteredAppraisals.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <p className="font-bold text-slate-800 text-sm">{app.employee}</p>
                      <p className="text-xs text-slate-500 font-medium">{app.role}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-bold text-slate-600">{app.reviewer}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm font-black text-slate-800">
                        {app.score !== null ? `${app.score.toFixed(1)}/5.0` : "--"}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`text-sm font-bold ${
                         app.rating === 'Outstanding' || app.rating === 'Exceeds Expectations' ? 'text-emerald-600' :
                         app.rating === 'Meets Expectations' ? 'text-blue-600' :
                         app.rating === 'Needs Improvement' ? 'text-amber-600' : 'text-slate-400'
                      }`}>{app.rating}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                        app.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                        app.status === 'Pending Review' ? 'bg-amber-50 text-amber-600' : 
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {app.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {app.status === 'Pending Review' && <AlertCircle className="w-3.5 h-3.5" />}
                        {app.status === 'In Progress' && <Clock className="w-3.5 h-3.5" />}
                        {app.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right flex justify-end gap-2">
                      {app.status === 'Pending Review' && (
                         <button onClick={() => handleEdit(app)} className="text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 px-3 py-1.5 rounded-lg transition-colors">Review</button>
                      )}
                      <button onClick={() => handleEdit(app)} className="p-1.5 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(app.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="font-bold text-slate-800 text-lg">
                {editingAppraisal ? "Edit Appraisal" : "New Appraisal"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-sm font-bold text-slate-700">Employee Name</label>
                  <select name="staffId" defaultValue={editingAppraisal?.staffId || ""} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-900 focus:outline-none">
                    <option value="" disabled>Select Employee</option>
                    {staffMembers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} - {s.role}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5 col-span-2 md:col-span-1">
                  <label className="text-sm font-bold text-slate-700">Reviewer</label>
                  <select name="reviewerId" defaultValue={editingAppraisal?.reviewerId || ""} required className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-900 focus:outline-none">
                    <option value="" disabled>Select Reviewer</option>
                    {staffMembers.map(s => (
                      <option key={s.id} value={s.id}>{s.name} - {s.role}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Status</label>
                  <select name="status" defaultValue={editingAppraisal?.status || "In Progress"} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-900 focus:outline-none">
                    <option value="Completed">Completed</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-slate-700">Score (Out of 5.0)</label>
                  <input name="score" type="number" step="0.1" min="0" max="5" defaultValue={editingAppraisal?.score ?? ""} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-900 focus:outline-none" placeholder="e.g. 4.5" />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-2 border-t border-slate-100 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="px-4 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 disabled:opacity-50 rounded-xl transition-colors shadow-sm">
                  {isPending ? "Saving..." : "Save Appraisal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
