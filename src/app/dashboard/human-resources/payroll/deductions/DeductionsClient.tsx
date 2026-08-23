"use client";

import React, { useState, useTransition } from "react";
import { 
  FileMinus, Plus, ShieldAlert, Activity, CreditCard, 
  Users, Settings, X, Trash2, Edit2, CheckCircle2 
} from "lucide-react";
import { createDeduction, updateDeduction, deleteDeduction } from "./actions";

type RuleType = "Statutory" | "Custom";

type Deduction = {
  id: string;
  name: string;
  type: string;
  amount: number | null;
  percentage: number | null;
};

type Advance = {
  id: string;
  employeeName: string;
  amount: number;
  installments: number;
  installmentsPaid: number;
  status: "Recovering" | "Cleared";
};

const IconMap: Record<string, React.ElementType> = {
  ShieldAlert,
  Activity,
  FileMinus,
  CreditCard,
};

export default function DeductionsClient({ initialDeductions }: { initialDeductions: Deduction[] }) {
  const [isPending, startTransition] = useTransition();

  const [advances, setAdvances] = useState<Advance[]>([
    { id: "ADV-001", employeeName: "Michael Ochieng", amount: 500, installments: 5, installmentsPaid: 2, status: "Recovering" },
    { id: "ADV-002", employeeName: "David Kim", amount: 1200, installments: 12, installmentsPaid: 12, status: "Cleared" },
  ]);

  // Modals state
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Deduction | null>(null);

  const [isAdvanceModalOpen, setIsAdvanceModalOpen] = useState(false);
  const [editingAdvance, setEditingAdvance] = useState<Advance | null>(null);

  // Form states
  const [ruleForm, setRuleForm] = useState<Partial<Deduction>>({});
  const [advanceForm, setAdvanceForm] = useState<Partial<Advance>>({});

  // Stats
  const activeRulesCount = initialDeductions.length;
  const statutoryCount = initialDeductions.filter(r => r.type === "Statutory").length;
  const customCount = initialDeductions.filter(r => r.type === "Custom").length;
  const totalOutstandingAdvances = advances
    .filter(a => a.status === "Recovering")
    .reduce((acc, a) => acc + (a.amount - (a.amount / a.installments) * a.installmentsPaid), 0);

  const openRuleModal = (rule?: Deduction) => {
    if (rule) {
      setEditingRule(rule);
      setRuleForm(rule);
    } else {
      setEditingRule(null);
      setRuleForm({
        type: "Custom",
        amount: null,
        percentage: null
      });
    }
    setIsRuleModalOpen(true);
  };

  const saveRule = (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      if (editingRule) {
        await updateDeduction(editingRule.id, {
          name: ruleForm.name!,
          type: ruleForm.type!,
          amount: ruleForm.amount || null,
          percentage: ruleForm.percentage || null
        });
      } else {
        await createDeduction({
          name: ruleForm.name!,
          type: ruleForm.type || "Custom",
          amount: ruleForm.amount || null,
          percentage: ruleForm.percentage || null
        });
      }
      setIsRuleModalOpen(false);
    });
  };

  const handleDeleteRule = (id: string) => {
    if(confirm("Are you sure you want to delete this rule?")) {
      startTransition(async () => {
        await deleteDeduction(id);
        setIsRuleModalOpen(false);
      });
    }
  };

  const openAdvanceModal = (advance?: Advance) => {
    if (advance) {
      setEditingAdvance(advance);
      setAdvanceForm(advance);
    } else {
      setEditingAdvance(null);
      setAdvanceForm({
        id: `ADV-${Math.floor(Math.random() * 10000)}`,
        status: "Recovering",
        installmentsPaid: 0,
      });
    }
    setIsAdvanceModalOpen(true);
  };

  const saveAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedForm = { ...advanceForm };
    if (updatedForm.installmentsPaid === updatedForm.installments) {
        updatedForm.status = "Cleared";
    } else {
        updatedForm.status = "Recovering";
    }

    if (editingAdvance) {
      setAdvances(advances.map(a => a.id === editingAdvance.id ? (updatedForm as Advance) : a));
    } else {
      setAdvances([...advances, updatedForm as Advance]);
    }
    setIsAdvanceModalOpen(false);
  };
  
  const deleteAdvance = (id: string) => {
    if(confirm("Are you sure you want to delete this advance?")) {
      setAdvances(advances.filter(a => a.id !== id));
      setIsAdvanceModalOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <div>
           <h2 className="text-xl font-black text-slate-800">Deductions & Allowances</h2>
           <p className="text-sm font-medium text-slate-500">Manage statutory requirements and custom deduction rules.</p>
        </div>
        <button onClick={() => openRuleModal()} className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
           <Plus className="w-4 h-4" />
           New Rule
        </button>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Active Rules</p>
                  <p className="text-2xl font-black text-slate-800">{activeRulesCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5" />
              </div>
          </div>
          <div className="bg-white/80 p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Statutory</p>
                  <p className="text-2xl font-black text-slate-800">{statutoryCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                  <ShieldAlert className="w-5 h-5" />
              </div>
          </div>
          <div className="bg-white/80 p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Custom</p>
                  <p className="text-2xl font-black text-slate-800">{customCount}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
              </div>
          </div>
          <div className="bg-white/80 p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Outstanding Adv.</p>
                  <p className="text-2xl font-black text-slate-800">${totalOutstandingAdvances.toFixed(2)}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
              </div>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {initialDeductions.map((rule) => {
           const Icon = rule.type === 'Statutory' ? ShieldAlert : CreditCard;
           const bg = rule.type === 'Statutory' ? 'bg-blue-50' : 'bg-amber-50';
           const color = rule.type === 'Statutory' ? 'text-blue-600' : 'text-amber-600';
           const rate = rule.percentage ? `${rule.percentage}%` : (rule.amount ? `$${rule.amount}` : 'Variable');
           const active = true;
           return (
            <div key={rule.id} className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl ${bg} ${color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex items-center gap-2">
                   <span className={`px-2 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${rule.type === 'Statutory' ? 'bg-slate-100 text-slate-600' : 'bg-primary-50 text-primary-600'}`}>
                      {rule.type}
                   </span>
                </div>
              </div>
              <h3 className="font-black text-slate-800 mb-1">{rule.name}</h3>
              <p className="text-xs font-bold text-slate-400 mb-4 uppercase tracking-wider">{rule.id}</p>
              
              <div className="bg-slate-50 rounded-xl p-3 mb-4">
                 <p className="text-xs font-bold text-slate-500 mb-1">Deduction Rate</p>
                 <p className="font-bold text-slate-700 text-sm truncate">{rate}</p>
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                 <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${active ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <span className="text-xs font-bold text-slate-500">{active ? 'Active Rule' : 'Inactive'}</span>
                 </div>
                 <button onClick={() => openRuleModal(rule)} className="text-slate-400 hover:text-primary-900 transition-colors">
                    <Settings className="w-4 h-4" />
                 </button>
              </div>
            </div>
           );
        })}
      </div>

      {/* Impacted Employees Section */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex justify-between items-center bg-slate-50/50">
           <h3 className="font-black text-slate-800 flex items-center gap-2"><Users className="w-5 h-5 text-slate-400"/> Recent Custom Deductions (Advances)</h3>
           <button onClick={() => openAdvanceModal()} className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 hover:border-primary-200 hover:bg-primary-50 text-primary-700 rounded-lg font-bold text-xs transition-all">
              <Plus className="w-3 h-3" />
              Add Advance
           </button>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-slate-100">
                  <th className="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>
                  <th className="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount</th>
                  <th className="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Installments</th>
                  <th className="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="py-3 px-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-100">
               {advances.length === 0 ? (
                 <tr>
                   <td colSpan={5} className="py-8 text-center text-slate-500 font-medium text-sm">No advances found</td>
                 </tr>
               ) : (
                 advances.map(advance => (
                   <tr key={advance.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="py-3 px-5 font-bold text-slate-700 text-sm">{advance.employeeName}</td>
                      <td className="py-3 px-5 font-bold text-slate-700 text-sm">${advance.amount.toFixed(2)}</td>
                      <td className="py-3 px-5 font-medium text-slate-500 text-sm">{advance.installmentsPaid} of {advance.installments}</td>
                      <td className="py-3 px-5">
                        <span className={`px-2 py-1 text-xs font-bold rounded-lg ${advance.status === 'Recovering' ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {advance.status}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-2">
                        <button onClick={() => openAdvanceModal(advance)} className="text-slate-400 hover:text-primary-600 p-1">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteAdvance(advance.id)} className="text-slate-400 hover:text-rose-600 p-1">
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

      {/* Rule Modal */}
      {isRuleModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800 text-lg">{editingRule ? 'Edit Rule' : 'New Rule'}</h3>
              <button onClick={() => setIsRuleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={saveRule} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Rule Name</label>
                <input 
                  required
                  type="text" 
                  value={ruleForm.name || ''}
                  onChange={e => setRuleForm({...ruleForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="e.g. Health Insurance"
                />
              </div>
              <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Type</label>
                    <select 
                      value={ruleForm.type || 'Custom'}
                      onChange={e => setRuleForm({...ruleForm, type: e.target.value})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    >
                      <option value="Statutory">Statutory</option>
                      <option value="Custom">Custom</option>
                    </select>
                  </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Flat Amount ($)</label>
                    <input 
                      type="number" 
                      min="0" step="0.01"
                      value={ruleForm.amount || ''}
                      onChange={e => setRuleForm({...ruleForm, amount: parseFloat(e.target.value) || null, percentage: null})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Percentage (%)</label>
                    <input 
                      type="number" 
                      min="0" max="100" step="0.1"
                      value={ruleForm.percentage || ''}
                      onChange={e => setRuleForm({...ruleForm, percentage: parseFloat(e.target.value) || null, amount: null})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                  </div>
              </div>
              
              <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-100">
                {editingRule ? (
                  <button type="button" onClick={() => handleDeleteRule(editingRule.id)} className="px-4 py-2.5 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl font-bold text-sm transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                ) : <div></div>}
                <div className="flex gap-3">
                  <button type="button" onClick={() => setIsRuleModalOpen(false)} className="px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-sm transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Advance Modal */}
      {isAdvanceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-black text-slate-800 text-lg">{editingAdvance ? 'Edit Advance' : 'New Advance'}</h3>
              <button onClick={() => setIsAdvanceModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={saveAdvance} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Employee Name</label>
                <input 
                  required
                  type="text" 
                  value={advanceForm.employeeName || ''}
                  onChange={e => setAdvanceForm({...advanceForm, employeeName: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Amount ($)</label>
                <input 
                  required
                  type="number" 
                  min="0"
                  step="0.01"
                  value={advanceForm.amount || ''}
                  onChange={e => setAdvanceForm({...advanceForm, amount: parseFloat(e.target.value)})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Installments</label>
                    <input 
                      required
                      type="number" 
                      min="1"
                      value={advanceForm.installments || ''}
                      onChange={e => setAdvanceForm({...advanceForm, installments: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Installments Paid</label>
                    <input 
                      required
                      type="number" 
                      min="0"
                      max={advanceForm.installments || 999}
                      value={advanceForm.installmentsPaid || 0}
                      onChange={e => setAdvanceForm({...advanceForm, installmentsPaid: parseInt(e.target.value)})}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all"
                    />
                  </div>
              </div>

              <div className="flex justify-between items-center pt-6 mt-6 border-t border-slate-100">
                <div className="flex gap-3 ml-auto">
                  <button type="button" onClick={() => setIsAdvanceModalOpen(false)} className="px-4 py-2.5 text-slate-600 hover:bg-slate-50 rounded-xl font-bold text-sm transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-6 py-2.5 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
                    Save
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
