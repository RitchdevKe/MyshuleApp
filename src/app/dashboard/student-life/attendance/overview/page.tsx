"use client";
import React, { useState, useEffect } from "react";
import { AlertCircle, X, CheckCircle } from "lucide-react";
import { getOverviewStats } from "./actions";

export default function AttendanceOverviewTab() {
  const [stats, setStats] = useState({
    todayAttendance: 0,
    present: 0,
    absent: 0,
    late: 0
  });

  useEffect(() => {
    getOverviewStats().then((res) => {
      if (res.success) {
        setStats(res.stats);
      }
    });
  }, []);

  const [sections] = useState([
    { id: "s1", section: "Preschool", rate: 97.2, color: "bg-emerald-500" },
    { id: "s2", section: "Primary", rate: 95.1, color: "bg-emerald-400" },
    { id: "s3", section: "Junior School", rate: 94.3, color: "bg-amber-400" },
    { id: "s4", section: "Secondary", rate: 92.8, color: "bg-rose-400" },
  ]);

  const [alerts, setAlerts] = useState([
    { id: "a1", alert: "Brian Mwangi absent 3 consecutive days", type: "Chronic Absence", priority: "High", details: "Student has missed Monday, Tuesday, and Wednesday without any communication from parents." },
    { id: "a2", alert: "12 students have attendance below 80%", type: "Policy Breach", priority: "High", details: "A group of 12 students in Senior School are currently falling below the 80% attendance threshold required for exams." },
    { id: "a3", alert: "Grade 7B attendance fallen by 6% this week", type: "Trend Alert", priority: "Medium", details: "Overall class attendance dropped significantly this week compared to last week's average of 95%." },
    { id: "a4", alert: "Peter Otieno late 5 times this month", type: "Lateness", priority: "Low", details: "Student has been arriving after 8:00 AM consistently on Mondays and Fridays." },
  ]);

  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  const handleAlertClick = (alert: any) => {
    setSelectedAlert(alert);
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
  };

  const handleAcknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setSelectedAlert(null);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        <div className="col-span-1 md:col-span-2 bg-gradient-to-br from-indigo-500 to-indigo-700 text-white p-6 rounded-3xl shadow-lg shadow-indigo-600/20 border border-indigo-400/30 flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500"></div>
          <div className="text-5xl font-black mb-2 tracking-tight">{stats.todayAttendance}%</div>
          <div className="text-sm font-bold uppercase tracking-wider text-indigo-100">Today's Attendance</div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-md border border-white p-6 rounded-3xl shadow-sm text-center flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <div className="text-4xl font-black text-emerald-600 mb-2">{stats.present.toLocaleString()}</div>
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Present</div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-md border border-white p-6 rounded-3xl shadow-sm text-center flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <div className="text-4xl font-black text-rose-600 mb-2">{stats.absent.toLocaleString()}</div>
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Absent</div>
        </div>
        
        <div className="bg-white/60 backdrop-blur-md border border-white p-6 rounded-3xl shadow-sm text-center flex flex-col items-center justify-center hover:shadow-md transition-shadow">
          <div className="text-4xl font-black text-amber-500 mb-2">{stats.late.toLocaleString()}</div>
          <div className="text-xs font-black text-slate-500 uppercase tracking-wider">Late</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance by section */}
        <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 border border-white/60 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Attendance by Section</h3>
          <div className="space-y-5">
            {sections.map((s) => (
              <div key={s.id} className="group">
                <div className="flex justify-between text-xs font-bold text-slate-700 mb-1.5">
                  <span>{s.section}</span>
                  <span className="text-slate-900">{s.rate}%</span>
                </div>
                <div className="w-full bg-slate-200/50 rounded-full h-2.5 overflow-hidden border border-slate-200/50">
                  <div className={`${s.color} h-full rounded-full transition-all duration-1000 ease-out group-hover:opacity-80`} style={{ width: `${s.rate}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="lg:col-span-2 bg-rose-50/50 backdrop-blur-md rounded-3xl p-6 border border-rose-100/60 shadow-sm">
          <h3 className="text-sm font-black text-rose-800 uppercase tracking-wider mb-5 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600" /> Attendance Exceptions
          </h3>
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="p-4 bg-emerald-50/80 backdrop-blur-sm border border-emerald-100 rounded-2xl flex items-center justify-center shadow-sm">
                <span className="text-sm font-bold text-emerald-800">No attendance exceptions to display.</span>
              </div>
            ) : alerts.map((alert) => (
              <div 
                key={alert.id}
                onClick={() => handleAlertClick(alert)}
                className="p-4 bg-white/80 backdrop-blur-sm border border-rose-100 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full shadow-inner ${alert.priority === 'High' ? 'bg-rose-500 shadow-rose-500/50' : alert.priority === 'Medium' ? 'bg-amber-500 shadow-amber-500/50' : 'bg-slate-400 shadow-slate-400/50'}`}></div>
                  <span className="text-sm font-bold text-slate-800">{alert.alert}</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-xl ${
                  alert.type === 'Chronic Absence' ? 'text-rose-700 bg-rose-100' : 
                  alert.type === 'Policy Breach' ? 'text-orange-700 bg-orange-100' :
                  alert.type === 'Trend Alert' ? 'text-amber-700 bg-amber-100' : 'text-slate-600 bg-slate-100'
                }`}>{alert.type}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className={`p-6 text-white shrink-0 ${
              selectedAlert.priority === 'High' ? 'bg-gradient-to-r from-rose-600 to-rose-500' :
              selectedAlert.priority === 'Medium' ? 'bg-gradient-to-r from-amber-600 to-amber-500' :
              'bg-gradient-to-r from-slate-600 to-slate-500'
            }`}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-black">{selectedAlert.type}</h2>
                  <div className="flex items-center gap-2 mt-1 text-sm font-bold opacity-90">
                    <span className="bg-white/20 px-2 py-0.5 rounded-lg">{selectedAlert.priority} Priority</span>
                  </div>
                </div>
                <button onClick={handleCloseModal} className="p-2 bg-white/10 hover:bg-white/20 rounded-xl transition">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 bg-slate-50">
              <h3 className="text-lg font-bold text-slate-800 mb-2">{selectedAlert.alert}</h3>
              <p className="text-sm text-slate-600 mb-6">{selectedAlert.details}</p>
              
              <div className="flex justify-end gap-3">
                <button 
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-slate-200 text-slate-700 hover:bg-slate-300 rounded-xl transition text-sm font-bold"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleAcknowledgeAlert(selectedAlert.id)}
                  className="px-4 py-2 bg-emerald-500 text-white hover:bg-emerald-600 rounded-xl transition text-sm font-bold flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Acknowledge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
