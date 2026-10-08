"use client";

import React, { useState } from "react";
import { HeartHandshake, AlertTriangle, CheckCircle2, FileWarning, Plus, X, Trash2 } from "lucide-react";
import { 
  createDisciplinaryIncident, 
  updateDisciplinaryIncident, 
  deleteDisciplinaryIncident,
  createWelfareSession,
  updateWelfareSession,
  deleteWelfareSession
} from "../actions";

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

export default function OverviewClient({ 
  initialIncidents, 
  initialSessions, 
  formData 
}: { 
  initialIncidents: any[], 
  initialSessions: any[], 
  formData: { students: any[], staff: any[] } 
}) {
  const [incidents, setIncidents] = useState(initialIncidents);
  const [sessions, setSessions] = useState(initialSessions);

  // Modals state
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState<any | null>(null);
  const [editingSession, setEditingSession] = useState<any | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  // Form states
  const [caseForm, setCaseForm] = useState<any>({});
  const [sessionForm, setSessionForm] = useState<any>({});

  // Stats derived from state
  const openCases = incidents.filter(c => c.status !== "RESOLVED").length;
  const newThisWeek = incidents.length > 0 ? 2 : 0; // Mocked dynamic
  const resolvedCases = incidents.filter(c => c.status === "RESOLVED").length;
  const seriousCases = incidents.filter(c => c.severity === "SEVERE" && c.status !== "RESOLVED").length;

  // Handlers for Cases
  const handleOpenCaseModal = (c?: any) => {
    if (c) {
      setEditingCase(c);
      setCaseForm({
        ...c,
        studentId: c.studentId,
        reportedById: c.reportedById,
        incidentDate: new Date(c.incidentDate).toISOString().split('T')[0]
      });
    } else {
      setEditingCase(null);
      setCaseForm({ 
        severity: "MINOR", 
        status: "OPEN", 
        incidentDate: new Date().toISOString().split('T')[0],
        studentId: formData.students[0]?.id || "",
        reportedById: formData.staff[0]?.id || "",
        description: ""
      });
    }
    setIsCaseModalOpen(true);
  };

  const handleSaveCase = async () => {
    setIsLoading(true);
    try {
      if (editingCase) {
        const res = await updateDisciplinaryIncident(editingCase.id, caseForm);
        if (res.success && res.data) {
          const updatedData = res.data;
          const updatedIncidents = incidents.map(inc => inc.id === editingCase.id ? { ...updatedData, student: formData.students.find(s => s.id === updatedData.studentId) } : inc);
          setIncidents(updatedIncidents);
          setIsCaseModalOpen(false);
        } else {
          alert("Failed to update case: " + res.error);
        }
      } else {
        const res = await createDisciplinaryIncident(caseForm);
        if (res.success && res.data) {
          const newData = res.data;
          const newIncident = { ...newData, student: formData.students.find(s => s.id === newData.studentId) };
          setIncidents([newIncident, ...incidents]);
          setIsCaseModalOpen(false);
        } else {
          alert("Failed to create case: " + res.error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCase = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this case?")) return;
    const res = await deleteDisciplinaryIncident(id);
    if (res.success) {
      setIncidents(incidents.filter(c => c.id !== id));
    } else {
      alert("Failed to delete case.");
    }
  };

  // Handlers for Sessions (Interventions)
  const handleOpenSessionModal = (s?: any) => {
    if (s) {
      setEditingSession(s);
      setSessionForm({
        ...s,
        sessionDate: new Date(s.sessionDate).toISOString().split('T')[0]
      });
    } else {
      setEditingSession(null);
      setSessionForm({
        studentId: formData.students[0]?.id || "",
        sessionDate: new Date().toISOString().split('T')[0],
        counselor: formData.staff[0]?.firstName + " " + formData.staff[0]?.lastName || "",
        category: "BEHAVIORAL",
        status: "OPEN",
        notes: ""
      });
    }
    setIsSessionModalOpen(true);
  };

  const handleSaveSession = async () => {
    setIsLoading(true);
    try {
      if (editingSession) {
        const res = await updateWelfareSession(editingSession.id, sessionForm);
        if (res.success && res.data) {
          const updatedData = res.data;
          const updatedSessions = sessions.map(ses => ses.id === editingSession.id ? { ...updatedData, student: formData.students.find(s => s.id === updatedData.studentId) } : ses);
          setSessions(updatedSessions);
          setIsSessionModalOpen(false);
        } else {
          alert("Failed to update session: " + res.error);
        }
      } else {
        const res = await createWelfareSession(sessionForm);
        if (res.success && res.data) {
          const newData = res.data;
          const newSession = { ...newData, student: formData.students.find(s => s.id === newData.studentId) };
          setSessions([newSession, ...sessions]);
          setIsSessionModalOpen(false);
        } else {
          alert("Failed to create session: " + res.error);
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to delete this session?")) return;
    const res = await deleteWelfareSession(id);
    if (res.success) {
      setSessions(sessions.filter(s => s.id !== id));
    } else {
      alert("Failed to delete session.");
    }
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
              <Plus className="w-4 h-4" /> Log Incident
            </button>
          </div>
          
          <div className="space-y-4">
            {incidents.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No cases found.</p>
            ) : (
              incidents.slice(0, 5).map((inc) => (
                <div key={inc.id} onClick={() => handleOpenCaseModal(inc)} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white/80 border border-slate-100 rounded-2xl hover:border-indigo-200 transition-colors cursor-pointer group">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-slate-400 group-hover:text-indigo-400 transition-colors">{new Date(inc.incidentDate).toLocaleDateString()}</span>
                      <span className={`w-2 h-2 rounded-full ${inc.severity === 'SEVERE' ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : inc.severity === 'MODERATE' ? 'bg-amber-500' : 'bg-slate-400'}`}></span>
                    </div>
                    <div className="text-sm font-bold text-slate-700">{inc.student?.firstName} {inc.student?.lastName}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{inc.description}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border rounded-lg shadow-sm ${
                      inc.status === 'RESOLVED' 
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
              <HeartHandshake className="w-4 h-4 text-indigo-600" /> Active Sessions
            </h3>
            <button onClick={() => handleOpenSessionModal()} className="flex items-center gap-1 text-xs font-bold bg-indigo-600 text-white px-3 py-1.5 rounded-lg hover:bg-indigo-700 transition-colors">
              <Plus className="w-4 h-4" /> New Session
            </button>
          </div>
          
          <div className="space-y-4">
            {sessions.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No active sessions.</p>
            ) : (
              sessions.slice(0, 5).map((ses) => (
                <div key={ses.id} onClick={() => handleOpenSessionModal(ses)} className="p-5 bg-white border border-indigo-100/50 rounded-2xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 cursor-pointer group">
                  <div className="flex justify-between items-start mb-3">
                    <span className="font-bold text-slate-800 text-sm group-hover:text-indigo-600 transition-colors">{ses.student?.firstName} {ses.student?.lastName}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-indigo-100/50 text-indigo-700 px-2.5 py-1 rounded-md">{ses.status}</span>
                      <button onClick={(e) => handleDeleteSession(ses.id, e)} className="p-1 text-slate-400 hover:text-rose-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mb-4 bg-slate-50 p-2.5 rounded-lg border border-slate-100 font-medium">Notes: {ses.notes || "No notes"}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50/50 p-2 rounded-lg inline-flex border border-indigo-100/50">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                      Counselor: {ses.counselor}
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">{new Date(ses.sessionDate).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Case Modal */}
      <Modal isOpen={isCaseModalOpen} onClose={() => setIsCaseModalOpen(false)} title={editingCase ? "Edit Case" : "Log Incident"}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Student</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={caseForm.studentId || ""} 
              onChange={e => setCaseForm({...caseForm, studentId: e.target.value})}
            >
              {formData.students.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Reported By (Staff)</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={caseForm.reportedById || ""} 
              onChange={e => setCaseForm({...caseForm, reportedById: e.target.value})}
            >
              {formData.staff.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
            <textarea 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={caseForm.description || ""} 
              onChange={e => setCaseForm({...caseForm, description: e.target.value})}
              placeholder="Describe the incident"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Severity</label>
              <select 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={caseForm.severity || "MINOR"}
                onChange={e => setCaseForm({...caseForm, severity: e.target.value})}
              >
                <option value="MINOR">MINOR</option>
                <option value="MODERATE">MODERATE</option>
                <option value="SEVERE">SEVERE</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={caseForm.status || "OPEN"}
                onChange={e => setCaseForm({...caseForm, status: e.target.value})}
              >
                <option value="OPEN">OPEN</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>
          </div>
          <button 
            onClick={handleSaveCase}
            disabled={isLoading || !caseForm.studentId || !caseForm.description}
            className="w-full mt-4 bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : editingCase ? "Update Incident" : "Log Incident"}
          </button>
        </div>
      </Modal>

      {/* Session Modal */}
      <Modal isOpen={isSessionModalOpen} onClose={() => setIsSessionModalOpen(false)} title={editingSession ? "Edit Session" : "New Session"}>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Student</label>
            <select 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              value={sessionForm.studentId || ""} 
              onChange={e => setSessionForm({...sessionForm, studentId: e.target.value})}
            >
              {formData.students.map(s => (
                <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.admissionNumber})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Counselor</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={sessionForm.counselor || ""} 
              onChange={e => setSessionForm({...sessionForm, counselor: e.target.value})}
              placeholder="e.g. Dr. Smith"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Notes</label>
            <textarea 
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={sessionForm.notes || ""} 
              onChange={e => setSessionForm({...sessionForm, notes: e.target.value})}
              placeholder="Session notes"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
              <select 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={sessionForm.category || "BEHAVIORAL"}
                onChange={e => setSessionForm({...sessionForm, category: e.target.value})}
              >
                <option value="ACADEMIC">ACADEMIC</option>
                <option value="BEHAVIORAL">BEHAVIORAL</option>
                <option value="PERSONAL">PERSONAL</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Status</label>
              <select 
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                value={sessionForm.status || "OPEN"}
                onChange={e => setSessionForm({...sessionForm, status: e.target.value})}
              >
                <option value="OPEN">OPEN</option>
                <option value="REFERRED">REFERRED</option>
                <option value="RESOLVED">RESOLVED</option>
              </select>
            </div>
          </div>
          <button 
            onClick={handleSaveSession}
            disabled={isLoading || !sessionForm.studentId || !sessionForm.counselor}
            className="w-full mt-4 bg-indigo-600 text-white font-bold py-2.5 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Saving..." : editingSession ? "Update Session" : "Create Session"}
          </button>
        </div>
      </Modal>

    </div>
  );
}
