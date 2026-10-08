"use client";

import React, { useState } from "react";
import { Clock, Edit, Pause, Play, Plus, Calendar, Mail, FileText } from "lucide-react";
import { updateReportSchedule, pauseSchedule } from "./actions";

// types
type Report = { id: string; name: string; config: any; createdAt: Date };

export default function ScheduledClient({ 
  tenantId, 
  initialScheduledReports, 
  allReports 
}: { 
  tenantId: string;
  initialScheduledReports: Report[];
  allReports: Report[];
}) {
  const [scheduledReports, setScheduledReports] = useState(initialScheduledReports);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  
  // form state
  const [selectedReportId, setSelectedReportId] = useState("");
  const [frequency, setFrequency] = useState("daily");
  const [recipients, setRecipients] = useState("");
  const [format, setFormat] = useState("pdf");

  const openNewModal = () => {
    setSelectedReportId("");
    setFrequency("daily");
    setRecipients("");
    setFormat("pdf");
    setEditingReportId(null);
    setIsModalOpen(true);
  };

  const openEditModal = (report: Report) => {
    const config = report.config as any;
    const schedule = config?.schedule || {};
    setSelectedReportId(report.id);
    setFrequency(schedule.frequency || "daily");
    setRecipients(schedule.recipients?.join(", ") || "");
    setFormat(schedule.format || "pdf");
    setEditingReportId(report.id);
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReportId) return;

    const scheduleData = {
      frequency,
      recipients: recipients.split(",").map(r => r.trim()).filter(Boolean),
      format,
      status: "Active"
    };

    await updateReportSchedule(selectedReportId, tenantId, scheduleData);
    
    // Optimistic update
    const updatedReport = allReports.find(r => r.id === selectedReportId);
    if (updatedReport) {
      const newConfig = { ...(updatedReport.config as any), scheduled: true, schedule: scheduleData };
      const newReport = { ...updatedReport, config: newConfig };
      
      setScheduledReports(prev => {
        const exists = prev.find(p => p.id === selectedReportId);
        if (exists) {
          return prev.map(p => p.id === selectedReportId ? newReport : p);
        }
        return [newReport, ...prev];
      });
    }

    setIsModalOpen(false);
  };

  const handleTogglePause = async (reportId: string, currentStatus: string) => {
    const isPaused = currentStatus === "Active"; // if it's active, we want to pause it
    await pauseSchedule(reportId, tenantId, isPaused);
    
    setScheduledReports(prev => prev.map(r => {
      if (r.id === reportId) {
        const newConfig = {
          ...(r.config as any),
          scheduled: !isPaused,
          schedule: {
            ...((r.config as any)?.schedule || {}),
            status: isPaused ? "Paused" : "Active"
          }
        };
        return { ...r, config: newConfig };
      }
      return r;
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button 
          onClick={openNewModal}
          className="bg-primary-900 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary-500 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" /> New Schedule
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl overflow-hidden shadow-sm">
        {scheduledReports.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p className="font-bold">No scheduled reports found.</p>
            <p className="text-sm mt-1">Create one to get automated report deliveries.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/50">
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Report Name</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Frequency</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Recipients</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Format</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="p-4 text-xs font-black text-slate-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {scheduledReports.map(report => {
                  const config = report.config as any;
                  const schedule = config?.schedule || {};
                  const status = schedule.status || (config.scheduled ? "Active" : "Paused");
                  
                  return (
                    <tr key={report.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-bold text-slate-700">{report.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600 font-medium capitalize">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {schedule.frequency || "Not set"}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="truncate max-w-[150px]" title={schedule.recipients?.join(", ")}>
                            {schedule.recipients?.join(", ") || "None"}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded uppercase">
                          {schedule.format || "PDF"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleTogglePause(report.id, status)}
                            className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                            title={status === 'Active' ? 'Pause' : 'Resume'}
                          >
                            {status === 'Active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          <button 
                            onClick={() => openEditModal(report)}
                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit Schedule"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <dialog 
          className="fixed inset-0 z-50 w-full h-full bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4"
          open
        >
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-lg font-black text-slate-800">
                {editingReportId ? "Edit Schedule" : "New Schedule"}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Select Report
                </label>
                <select 
                  required
                  value={selectedReportId}
                  onChange={e => setSelectedReportId(e.target.value)}
                  disabled={!!editingReportId}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                >
                  <option value="" disabled>Select a report...</option>
                  {allReports.map(r => (
                    <option key={r.id} value={r.id}>{r.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Frequency
                </label>
                <select 
                  value={frequency}
                  onChange={e => setFrequency(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Format
                </label>
                <select 
                  value={format}
                  onChange={e => setFormat(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="pdf">PDF</option>
                  <option value="csv">CSV</option>
                  <option value="excel">Excel</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Recipients (comma separated emails)
                </label>
                <input 
                  type="text"
                  required
                  value={recipients}
                  onChange={e => setRecipients(e.target.value)}
                  placeholder="admin@school.com, principal@school.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 flex gap-3 justify-end">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-secondary-500 transition-colors shadow-sm"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
}
