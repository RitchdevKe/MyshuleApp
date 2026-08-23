"use client";

import React, { useState } from "react";
import { HeartHandshake, AlertTriangle, CheckCircle2, FileWarning, Plus, X, Trash2 } from "lucide-react";

type Case = {
  id: string;
  type: string;
  student: string;
  status: "Investigation" | "Parent Communication" | "Resolved";
  severity: "High" | "Medium" | "Low";
};

type Intervention = {
  id: string;
  student: string;
  issue: string;
  goal: string;
  action: string;
};

// Simple Modal Component
function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function DisciplineWelfareOverview() {
  const [cases, setCases] = useState<Case[]>([
    { id: "INC-2026-00182", type: "Bullying", student: "Brian Mwangi", status: "Investigation", severity: "High" },
    { id: "INC-2026-00181", type: "Late Arrival", student: "Peter Otieno", status: "Parent Communication", severity: "Low" },
    { id: "INC-2026-00180", type: "Academic Misconduct", student: "John Kamau", status: "Resolved", severity: "Medium" },
  ]);

  const [interventions, setInterventions] = useState<Intervention[]>([
    { id: "INT-001", student: "Brian Mwangi", issue: "Repeated absenteeism", goal: "Attendance above 90%", action: "Mentor Assigned" },
    { id: "INT-002", student: "Mary Wanjiku", issue: "Academic concern", goal: "Improve Math scores", action: "Counselling Referral" },
  ]);

  // Modals state
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [isInterventionModalOpen, setIsInterventionModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<Case | null>(null);
  const [editingIntervention, setEditingIntervention] = useState<Intervention | null>(null);

  // Form states
  const [caseForm, setCaseForm] = useState<Partial<Case>>({});
  const [intForm, setIntForm] = useState<Partial<Intervention>>({});

  // Stats derived from state
  const openCases = cases.filter(c => c.status !== "Resolved").length;
  const newThisWeek = cases.length > 0 ? 2 : 0; // Mocked dynamic
  const resolvedCases = cases.filter(c => c.status === "Resolved").length;
  const seriousCases = cases.filter(c => c.severity === "High" && c.status !== "Resolved").length;

  // Handlers for Cases
  const handleOpenCaseModal = (c?: Case) => {
    if (c) {
      setEditingCase(c);
      setCaseForm(c);
    } else {
      setEditingCase(null);
      setCaseForm({ severity: "Low", status: "Investigation" });
    }
    setIsCaseModalOpen(true);
  };

  const handleSaveCase = () => {
    if (editingCase) {
      setCases(cases.map(c => c.id === editingCase.id ? { ...c, ...caseForm } as Case : c));
    } else {
      const newCase: Case = {
        ...(caseForm as Case),
        id: `INC-2026-00${Math.floor(Math.random() * 900) + 100}`,
      };
      setCases([newCase, ...cases]);
    }
    setIsCaseModalOpen(false);
  };

  const handleDeleteCase = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCases(cases.filter(c => c.id !== id));
  };

  // Handlers for Interventions
  const handleOpenIntModal = (i?: Intervention) => {
    if (i) {
      setEditingIntervention(i);
      setIntForm(i);
    } else {
      setEditingIntervention(null);
      setIntForm({});
    }
    setIsInterventionModalOpen(true);
  };

  const handleSaveInt = () => {
    if (editingIntervention) {
      setInterventions(interventions.map(i => i.id === editingIntervention.id ? { ...i, ...intForm } as Intervention : i));
    } else {
      const newInt: Intervention = {
        ...(intForm as Intervention),
        id: `INT-00${Math.floor(Math.random() * 900) + 100}`,
      };
      setInterventions([newInt, ...interventions]);
    }
    setIsInterventionModalOpen(false);
  };

  const handleDeleteInt = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setInterventions(interventions.filter(i => i.id !== id));
  };

  return (
    <div className="p-8 space-y-8 bg-white/30 backdrop-blur-md rounded-3xl min-h-[600px]">
      
      {/* Enhanced Premium KPI Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 bg-gradient-to-br from-indigo-500/10 to-indigo-600/5 border border-indigo-200/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-indigo-500/20 text-indigo-700 rounded-xl flex items-center justify-center">
              <FileWarning className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-indigo-700">{openCases}</div>
          <div className="text-sm font-bold text-indigo-600/70 uppercase tracking-wider mt-1">Open Cases</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-slate-100/60 to-white border border-slate-200 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-slate-200/50 text-slate-700 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-slate-800">{newThisWeek}</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-wider mt-1">New This Week</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 border border-emerald-200/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-700 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-emerald-700">{resolvedCases}</div>
          <div className="text-sm font-bold text-emerald-600/70 uppercase tracking-wider mt-1">Resolved</div>
        </div>

        <div className="p-6 bg-gradient-to-br from-rose-500/10 to-rose-600/5 border border-rose-200/60 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-rose-500/20 text-rose-700 rounded-xl flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="text-4xl font-black text-rose-700">{seriousCases}</div>
          <div className="text-sm font-bold text-rose-600/70 uppercase tracking-wider mt-1">Serious Cases</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Cases - Glassmorphic Enhancement */}
        <div className="bg-white/60 border border-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Recent Discipline Cases</h3>
            <button onClick={() => handleOpenCaseModal()} className="flex items-center gap-1 text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" /> Add Case
            </button>
          </div>
          
          <div className="space-y-4">
            {cases.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No cases found.</p>
            ) : (
              cases.map((inc) => (
                <div key={inc.id} onClick={() => handleOpenCaseModal(inc)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/80 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-colors cursor-pointer group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-400 transition-colors">{inc.id}</span>
                      <span className={`w-2 h-2 rounded-full ${inc.severity === 'High' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : inc.severity === 'Medium' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                    </div>
                    <div className="text-sm font-bold text-slate-700">{inc.student} <span className="text-slate-400 font-medium ml-1">&bull; {inc.type}</span></div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border rounded-lg shadow-sm ${
                      inc.status === 'Resolved' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200'
                        : 'bg-indigo-50 text-indigo-600 border-indigo-100'
                    }`}>
                      {inc.status}
                    </span>
                    <button onClick={(e) => handleDeleteCase(inc.id, e)} className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Welfare Interventions - Glassmorphic Enhancement */}
        <div className="bg-gradient-to-br from-indigo-50/80 to-purple-50/50 border border-indigo-100/80 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-wider flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-indigo-600" /> Active Interventions
            </h3>
            <button onClick={() => handleOpenIntModal()} className="flex items-center gap-1 text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" /> Add
            </button>
          </div>
          
          <div className="space-y-4">
            {interventions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No active interventions.</p>
            ) : (
              interventions.map((intv) => (
                <div key={intv.id} onClick={() => handleOpenIntModal(intv)} className="p-5 bg-white border border-indigo-100/50 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{intv.student}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100/50 text-indigo-700 px-2.5 py-1 rounded-md">Review: 2wks</span>
                      <button onClick={(e) => handleDeleteInt(intv.id, e)} className="p-1 text-slate-400 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-medium">Issue: {intv.issue}</p>
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50/50 p-2 rounded-lg inline-flex border border-indigo-100/50">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                    {intv.action}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Case Modal */}
      <Modal isOpen={isCaseModalOpen} onClose={() => setIsCaseModalOpen(false)} title={editingCase ? "Edit Case" : "Add New Case"}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Student Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={caseForm.student || ""} 
              onChange={e => setCaseForm({...caseForm, student: e.target.value})}
              placeholder="e.g. John Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Type</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={caseForm.type || ""} 
              onChange={e => setCaseForm({...caseForm, type: e.target.value})}
              placeholder="e.g. Bullying, Late Arrival"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Severity</label>
              <select 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={caseForm.severity || "Low"}
                onChange={e => setCaseForm({...caseForm, severity: e.target.value as Case["severity"]})}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={caseForm.status || "Investigation"}
                onChange={e => setCaseForm({...caseForm, status: e.target.value as Case["status"]})}
              >
                <option value="Investigation">Investigation</option>
                <option value="Parent Communication">Parent Communication</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>
          </div>
          <button 
            onClick={handleSaveCase}
            disabled={!caseForm.student || !caseForm.type}
            className="w-full mt-4 bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingCase ? "Update Case" : "Create Case"}
          </button>
        </div>
      </Modal>

      {/* Intervention Modal */}
      <Modal isOpen={isInterventionModalOpen} onClose={() => setIsInterventionModalOpen(false)} title={editingIntervention ? "Edit Intervention" : "Add Intervention"}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Student Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={intForm.student || ""} 
              onChange={e => setIntForm({...intForm, student: e.target.value})}
              placeholder="e.g. Jane Doe"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Issue</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={intForm.issue || ""} 
              onChange={e => setIntForm({...intForm, issue: e.target.value})}
              placeholder="e.g. Repeated absenteeism"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Goal</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={intForm.goal || ""} 
              onChange={e => setIntForm({...intForm, goal: e.target.value})}
              placeholder="e.g. Attendance above 90%"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Action</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={intForm.action || ""} 
              onChange={e => setIntForm({...intForm, action: e.target.value})}
              placeholder="e.g. Mentor Assigned"
            />
          </div>
          <button 
            onClick={handleSaveInt}
            disabled={!intForm.student || !intForm.issue || !intForm.action}
            className="w-full mt-4 bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {editingIntervention ? "Update Intervention" : "Create Intervention"}
          </button>
        </div>
      </Modal>

    </div>
  );
}
