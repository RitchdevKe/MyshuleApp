const fs = require('fs');

const content = `'use client';

import React, { useState, useEffect } from "react";
import {
  Search, Plus, MoreHorizontal, Eye, ChevronLeft, ChevronRight,
  ShieldAlert, HeartPulse, Activity, User, Phone, CheckCircle2,
  XCircle, Pill, ClipboardList, Sparkles, AlertTriangle, Edit, Trash2
} from "lucide-react";
import { getStudentWelfare, logDisciplinaryIncident, updateMedicalConditions, updateDisciplinaryIncident, deleteDisciplinaryIncident } from "@/app/actions/welfare";

const flagConfig: Record<string, { pill: string; icon: any }> = {
  Good:     { pill: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  Monitor:  { pill: "bg-amber-50 text-amber-700 border-amber-200",       icon: AlertTriangle },
  Critical: { pill: "bg-rose-50 text-rose-700 border-rose-200",          icon: XCircle },
};

const avatarGrads = [
  "from-primary-700 to-primary-900", "from-secondary-500 to-secondary-700",
  "from-indigo-500 to-violet-600",   "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-500",    "from-sky-500 to-blue-600",
  "from-pink-500 to-rose-600",       "from-cyan-500 to-blue-500",
];

const FLAGS = ["All", "Good", "Monitor", "Critical"];

export default function WelfarePage() {
  const [search, setSearch]  = useState("");
  const [flagF, setFlagF]    = useState("All");
  const [welfareData, setWelfareData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [isIncidentModalOpen, setIncidentModalOpen] = useState(false);
  const [isMedicalModalOpen, setMedicalModalOpen] = useState(false);
  const [isViewIncidentsModalOpen, setViewIncidentsModalOpen] = useState(false);
  
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [selectedStudentName, setSelectedStudentName] = useState("");
  const [studentIncidents, setStudentIncidents] = useState<any[]>([]);
  
  const [incidentForm, setIncidentForm] = useState({ id: "", description: "", severity: "MINOR", actionTaken: "" });
  const [medicalForm, setMedicalForm] = useState({ conditions: "" });

  const fetchData = () => {
    setLoading(true);
    getStudentWelfare().then(res => {
      if (res.success) {
        const mapped = res.data.map((s: any) => {
          const disc = s.disciplinaryIncidents || [];
          const att = s.attendanceRecords || [];
          
          let flag = "Good";
          let discStr = "None";
          let counselling = false;

          if (disc.length > 2) {
            flag = "Critical";
            discStr = \`\${disc.length} Incidents\`;
            counselling = true;
          } else if (disc.length > 0) {
            flag = "Monitor";
            discStr = \`\${disc.length} Incident(s)\`;
          }

          let attRate = 100;
          if (att.length > 0) {
            const presents = att.filter((a: any) => a.status === "PRESENT").length;
            attRate = Math.round((presents / att.length) * 100);
          }
          if (attRate < 70) {
            flag = "Critical";
          } else if (attRate < 85 && flag === "Good") {
            flag = "Monitor";
          }

          return {
            id: s.id, // Store actual student ID
            admissionNumber: s.admissionNumber || s.id,
            name: \`\${s.firstName} \${s.lastName}\`,
            initials: \`\${s.firstName?.[0] || ""}\${s.lastName?.[0] || ""}\`.toUpperCase(),
            attendance: attRate,
            discipline: discStr,
            medical: s.medicalConditions || "None",
            rewards: "—",
            counselling,
            flag,
            rawIncidents: disc
          };
        });
        setWelfareData(mapped);
      }
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = welfareData.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    const matchFlag   = flagF === "All" || r.flag === flagF;
    return matchSearch && matchFlag;
  });

  const counts = {
    Good:     welfareData.filter(r => r.flag === "Good").length,
    Monitor:  welfareData.filter(r => r.flag === "Monitor").length,
    Critical: welfareData.filter(r => r.flag === "Critical").length,
    Counselling: welfareData.filter(r => r.counselling).length,
  };

  const handleSaveIncident = async () => {
    if (!selectedStudentId) return alert("Select a student");
    if (incidentForm.id) {
      const res = await updateDisciplinaryIncident(incidentForm.id, incidentForm);
      if (res.success) {
        setIncidentModalOpen(false);
        setIncidentForm({ id: "", description: "", severity: "MINOR", actionTaken: "" });
        fetchData(); 
        if (isViewIncidentsModalOpen) setViewIncidentsModalOpen(false);
      } else alert("Error: " + res.error);
    } else {
      const res = await logDisciplinaryIncident({ studentId: selectedStudentId, ...incidentForm });
      if (res.success) {
        setIncidentModalOpen(false);
        setIncidentForm({ id: "", description: "", severity: "MINOR", actionTaken: "" });
        fetchData();
      } else alert("Error: " + res.error);
    }
  };
  
  const handleDeleteIncident = async (id: string) => {
    if (!confirm("Are you sure you want to delete this incident?")) return;
    const res = await deleteDisciplinaryIncident(id);
    if (res.success) {
      setStudentIncidents(studentIncidents.filter(i => i.id !== id));
      fetchData();
    } else {
      alert("Error: " + res.error);
    }
  };

  const handleUpdateMedical = async () => {
    if (!selectedStudentId) return alert("Select a student");
    const res = await updateMedicalConditions(selectedStudentId, medicalForm.conditions);
    if (res.success) {
      setMedicalModalOpen(false);
      setMedicalForm({ conditions: "" });
      fetchData(); // Refresh data
    } else {
      alert("Error: " + res.error);
    }
  };

  const openViewIncidents = (r: any) => {
    setSelectedStudentId(r.id);
    setSelectedStudentName(r.name);
    setStudentIncidents(r.rawIncidents || []);
    setViewIncidentsModalOpen(true);
  };
  
  const openEditIncident = (incident: any) => {
    setIncidentForm({
      id: incident.id,
      description: incident.description || "",
      severity: incident.severity || "MINOR",
      actionTaken: incident.actionTaken || ""
    });
    setIncidentModalOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "In Good Standing", value: counts.Good,        icon: CheckCircle2, color: "from-emerald-500 to-teal-600" },
          { label: "Monitoring",       value: counts.Monitor,     icon: Activity,      color: "from-amber-500 to-orange-500" },
          { label: "Critical Cases",   value: counts.Critical,    icon: ShieldAlert,   color: "from-rose-500 to-red-600" },
          { label: "Counselling",      value: counts.Counselling, icon: HeartPulse,    color: "from-primary-600 to-primary-800" },
        ].map(c => {
          const Icon = c.icon;
          return (
            <div key={c.label} className={\`bg-gradient-to-br \${c.color} rounded-2xl p-4 text-white shadow-md flex items-center gap-3 relative overflow-hidden group\`}>
              <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700"></div>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 relative z-10">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div className="relative z-10">
                <p className="text-white/80 text-[10px] font-black uppercase tracking-wider">{c.label}</p>
                <p className="text-2xl font-black mt-0.5 leading-none">{c.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden flex flex-col">
        <div className="p-5 border-b border-slate-100 bg-white/80 flex flex-wrap items-center justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search student..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white w-72 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={flagF}
              onChange={e => setFlagF(e.target.value)}
              className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
            >
              {FLAGS.map(f => <option key={f} value={f}>{f === "All" ? "All Flags" : f}</option>)}
            </select>
            <button 
              onClick={() => { setSelectedStudentId(""); setIncidentForm({ id: "", description: "", severity: "MINOR", actionTaken: "" }); setIncidentModalOpen(true); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-primary-900 hover:bg-primary-800 text-white text-sm font-black rounded-xl shadow-md transition-all">
              <Plus className="w-4 h-4" /> Log Incident
            </button>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[400px]">
          {loading ? (
            <div className="p-8 text-center text-slate-500 text-sm font-bold">Loading...</div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Student</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status / Flag</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Discipline</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Health / Medical</th>
                  <th className="px-5 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rewards / Pastoral</th>
                  <th className="px-5 py-4 w-40">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((r, i) => {
                  const cfg = flagConfig[r.flag] || flagConfig['Good'];
                  const Icon = cfg.icon;
                  const attColor = r.attendance >= 90 ? "text-emerald-600 bg-emerald-50" :
                                  r.attendance >= 75 ? "text-amber-600 bg-amber-50" : "text-rose-600 bg-rose-50";

                  return (
                    <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className={\`w-9 h-9 rounded-xl flex items-center justify-center text-white text-[11px] font-black shadow-sm bg-gradient-to-br \${avatarGrads[i % avatarGrads.length]} flex-shrink-0\`}>
                            {r.initials}
                          </div>
                          <div>
                            <p className="font-bold text-sm text-slate-800 leading-tight">{r.name}</p>
                            <p className="text-[10px] font-bold text-slate-400">{r.admissionNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-1.5 items-start">
                          <span className={\`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-black \${cfg.pill}\`}>
                            <Icon className="w-3 h-3" />
                            {r.flag}
                          </span>
                          <span className={\`text-[10px] font-black px-1.5 py-0.5 rounded \${attColor}\`}>
                            {r.attendance}% Att.
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className={\`w-6 h-6 rounded-lg flex items-center justify-center \${r.discipline === 'None' ? 'bg-slate-100 text-slate-400' : 'bg-rose-100 text-rose-600'}\`}>
                            <ClipboardList className="w-3.5 h-3.5" />
                          </div>
                          <span className={\`text-[11px] font-bold \${r.discipline === 'None' ? 'text-slate-400' : 'text-slate-700'}\`}>
                            {r.discipline}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className={\`w-6 h-6 rounded-lg flex items-center justify-center \${r.medical === 'None' ? 'bg-slate-100 text-slate-400' : 'bg-amber-100 text-amber-600'}\`}>
                            <Pill className="w-3.5 h-3.5" />
                          </div>
                          <span className={\`text-[11px] font-bold \${r.medical === 'None' ? 'text-slate-400' : 'text-slate-700'}\`}>
                            {r.medical}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex flex-col gap-1.5 items-start">
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                            <span className="text-[11px] font-bold text-slate-600">{r.rewards}</span>
                          </div>
                          {r.counselling && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-primary-50 text-primary-700 border border-primary-200 rounded text-[10px] font-bold">
                              <HeartPulse className="w-3 h-3" /> In Counselling
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => openViewIncidents(r)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-primary-600 hover:bg-primary-50 transition-colors" title="View Incidents">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setSelectedStudentId(r.id); setMedicalForm({ conditions: r.medical === 'None' ? '' : r.medical }); setMedicalModalOpen(true); }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors" title="Edit Medical">
                            <Pill className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => { setSelectedStudentId(r.id); setIncidentForm({ id: "", description: "", severity: "MINOR", actionTaken: "" }); setIncidentModalOpen(true); }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors" title="Log Incident">
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-12 text-center text-slate-500 text-sm font-bold">
                      No welfare records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {isIncidentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 mb-4">{incidentForm.id ? "Edit Disciplinary Incident" : "Log Disciplinary Incident"}</h3>
            <div className="space-y-4">
              {!selectedStudentId && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Student</label>
                  <select 
                    value={selectedStudentId} 
                    onChange={e => setSelectedStudentId(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  >
                    <option value="">Select Student</option>
                    {welfareData.map(w => <option key={w.id} value={w.id}>{w.name} ({w.admissionNumber})</option>)}
                  </select>
                </div>
              )}
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Severity</label>
                <select 
                  value={incidentForm.severity} 
                  onChange={e => setIncidentForm({...incidentForm, severity: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                >
                  <option value="MINOR">Minor</option>
                  <option value="MODERATE">Moderate</option>
                  <option value="SEVERE">Severe</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Description</label>
                <textarea 
                  value={incidentForm.description}
                  onChange={e => setIncidentForm({...incidentForm, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  rows={3}
                  placeholder="Describe the incident..."
                ></textarea>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Action Taken</label>
                <input 
                  type="text"
                  value={incidentForm.actionTaken}
                  onChange={e => setIncidentForm({...incidentForm, actionTaken: e.target.value})}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  placeholder="E.g., Warning given"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button 
                onClick={() => setIncidentModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveIncident}
                className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white text-sm font-black rounded-xl shadow-md transition-all"
              >
                {incidentForm.id ? "Update Incident" : "Log Incident"}
              </button>
            </div>
          </div>
        </div>
      )}

      {isViewIncidentsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-2xl shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-black text-slate-800">Incidents for {selectedStudentName}</h3>
              <button onClick={() => setViewIncidentsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            {studentIncidents.length === 0 ? (
              <p className="text-slate-500 text-sm py-4">No incidents logged for this student.</p>
            ) : (
              <div className="space-y-3">
                {studentIncidents.map(inc => (
                  <div key={inc.id} className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className={\`text-xs font-bold px-2 py-1 rounded \${
                        inc.severity === 'SEVERE' ? 'bg-rose-100 text-rose-700' :
                        inc.severity === 'MODERATE' ? 'bg-amber-100 text-amber-700' :
                        'bg-emerald-100 text-emerald-700'
                      }\`}>
                        {inc.severity}
                      </span>
                      <div className="flex gap-2">
                        <button onClick={() => openEditIncident(inc)} className="p-1 text-slate-400 hover:text-primary-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteIncident(inc.id)} className="p-1 text-slate-400 hover:text-rose-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-800 font-medium">{inc.description}</p>
                    {inc.actionTaken && (
                      <p className="text-xs text-slate-500">Action: {inc.actionTaken}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setViewIncidentsModalOpen(false)}
                className="px-5 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-black rounded-xl transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isMedicalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl">
            <h3 className="text-xl font-black text-slate-800 mb-4">Update Medical Conditions</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Conditions</label>
                <textarea 
                  value={medicalForm.conditions}
                  onChange={e => setMedicalForm({ conditions: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  rows={3}
                  placeholder="List any medical conditions..."
                ></textarea>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button 
                onClick={() => setMedicalModalOpen(false)}
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateMedical}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-black rounded-xl shadow-md transition-all"
              >
                Update Medical
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
\`;

fs.writeFileSync('src/app/dashboard/registration/admissions/welfare/page.tsx', content);
