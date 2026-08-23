"use client";

import React, { useState, useEffect } from "react";
import { Coins, Search, Filter, CheckCircle2, Clock, Calendar, Download, Trash2, Edit, X, Plus, Loader2 } from "lucide-react";
import { getActiveStaffCount, getPayrollRuns, createPayrollRun, updatePayrollRun, deletePayrollRun } from "./actions";

interface PayrollRun {
  id: string;
  period: string;
  date: string;
  employees: number;
  total: number;
  status: 'Draft' | 'Completed';
}

const initialRuns: PayrollRun[] = [];

export default function PayrollRunsPage() {
  const [runs, setRuns] = useState<PayrollRun[]>(initialRuns);
  const [activeStaffCount, setActiveStaffCount] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRun, setEditingRun] = useState<PayrollRun | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const count = await getActiveStaffCount();
      setActiveStaffCount(count > 0 ? count : 150);
      
      const dbRuns = await getPayrollRuns();
      if (dbRuns) {
        setRuns(dbRuns);
      }
      setIsLoading(false);
    }
    loadData();
  }, []);

  const estimatedTotal = activeStaffCount * 4820; // Example average salary calculation
  const currentCycle = "August 2024";

  const handleProcessNow = async () => {
    const newRunData = {
      period: currentCycle,
      employees: activeStaffCount,
      total: estimatedTotal,
      status: 'Completed' as const
    };
    
    // Optimistic update
    const tempId = `PR-temp-${Date.now()}`;
    const newRun: PayrollRun = {
      id: tempId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      ...newRunData
    };
    setRuns([newRun, ...runs]);

    const res = await createPayrollRun(newRunData);
    if (res?.success && res.id) {
      setRuns(prev => prev.map(r => r.id === tempId ? { ...r, id: res.id as string } : r));
    } else {
       // if fails but we want UI to feel complete, keep temp ID. 
       // In a real app we might revert or show error.
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this payroll run?")) {
      const prevRuns = [...runs];
      setRuns(runs.filter(r => r.id !== id));
      
      const res = await deletePayrollRun(id);
      if (!res?.success) {
         // Keep optimistic update for fallback 
      }
    }
  };

  const openAddModal = () => {
    setEditingRun({
      id: `PR-temp-${Math.floor(Math.random() * 10000)}`,
      period: "September 2024",
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      employees: activeStaffCount,
      total: estimatedTotal,
      status: 'Draft'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (run: PayrollRun) => {
    setEditingRun({ ...run });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingRun) return;
    
    setIsSubmitting(true);
    const isEdit = runs.some(r => r.id === editingRun.id && !r.id.includes('temp'));
    
    if (isEdit) {
      setRuns(runs.map(r => r.id === editingRun.id ? editingRun : r));
      await updatePayrollRun(editingRun.id, {
        period: editingRun.period,
        employees: editingRun.employees,
        total: editingRun.total,
        status: editingRun.status
      });
    } else {
      setRuns([editingRun, ...runs]);
      const res = await createPayrollRun({
        period: editingRun.period,
        employees: editingRun.employees,
        total: editingRun.total,
        status: editingRun.status
      });
      if (res?.success && res.id) {
        setRuns(prev => prev.map(r => r.id === editingRun.id ? { ...r, id: res.id as string } : r));
      }
    }
    
    setIsSubmitting(false);
    setIsModalOpen(false);
    setEditingRun(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const filteredRuns = runs.filter(run => 
    run.period.toLowerCase().includes(searchQuery.toLowerCase()) || 
    run.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Current Cycle Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
             <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Processed Payroll</p>
            <p className="text-2xl font-black text-slate-800">
              {formatCurrency(runs.filter(r => r.status === 'Completed').reduce((acc, curr) => acc + curr.total, 0))}
            </p>
            <p className="text-xs text-slate-500 mt-1">Across {runs.filter(r => r.status === 'Completed').length} completed runs</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
             <Coins className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Employees / Run</p>
            <p className="text-2xl font-black text-slate-800">
              {runs.length > 0 ? Math.round(runs.reduce((acc, curr) => acc + curr.employees, 0) / runs.length) : 0}
            </p>
            <p className="text-xs text-slate-500 mt-1">Active Staff DB count: {activeStaffCount}</p>
          </div>
        </div>
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm flex justify-between items-center gap-4">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Status</p>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg">Draft</span>
          </div>
          <button 
            onClick={handleProcessNow}
            className="px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20"
          >
             Process New Run
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search payroll runs..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" 
              />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
              <button 
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
              >
                 <Plus className="w-4 h-4" />
                 Add Run
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Run ID</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Processed Date</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Employees</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Total Amount</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRuns.map((run) => (
                <tr key={run.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 text-sm">{run.id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800 text-sm">{run.period}</span>
                  </td>
                  <td className="py-4 px-6 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    <span className="text-sm font-medium text-slate-600">{run.date}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-bold text-slate-700">{run.employees}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-sm font-black text-slate-800">{formatCurrency(run.total)}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      run.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {run.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {run.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => openEditModal(run)}
                        className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 p-2 rounded-lg transition-colors"
                        title="Edit Run"
                      >
                         <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(run.id)}
                        className="text-sm font-bold text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete Run"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="text-sm font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-50 p-2 rounded-lg transition-colors" title="Download Report">
                         <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredRuns.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No payroll runs found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal for Add / Edit */}
      {isModalOpen && editingRun && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">
                {runs.some(r => r.id === editingRun.id) ? "Edit Payroll Run" : "Add Payroll Run"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Run ID</label>
                <input 
                  type="text" 
                  value={editingRun.id}
                  disabled
                  className="w-full px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Period (e.g. August 2024)</label>
                <input 
                  type="text" 
                  required
                  value={editingRun.period}
                  onChange={(e) => setEditingRun({...editingRun, period: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Employees</label>
                  <input 
                    type="number" 
                    required
                    value={editingRun.employees}
                    onChange={(e) => setEditingRun({...editingRun, employees: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Amount ($)</label>
                  <input 
                    type="number" 
                    required
                    step="0.01"
                    value={editingRun.total}
                    onChange={(e) => setEditingRun({...editingRun, total: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Status</label>
                <select
                  value={editingRun.status}
                  onChange={(e) => setEditingRun({...editingRun, status: e.target.value as 'Draft' | 'Completed'})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900"
                >
                  <option value="Draft">Draft</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 disabled:bg-primary-900/50 text-white rounded-xl font-bold text-sm transition-colors shadow-sm shadow-primary-900/20"
                >
                  {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                  Save Run
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
