"use client";

import React from "react";
import { Users, CheckCircle2, AlertCircle, Clock, ScanFace, FileText, Download } from "lucide-react";

export default function AttendancePage() {
  const stats = [
    { title: "Expected Today", value: "2,842", icon: Users, color: "text-blue-600", bg: "bg-blue-100" },
    { title: "Scanned In", value: "2,105", icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-100" },
    { title: "Pending", value: "737", icon: Clock, color: "text-amber-600", bg: "bg-amber-100" },
    { title: "Exceptions", value: "12", icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-100" }
  ];

  const recentScans = [
    { time: "01:15:22 PM", name: "David Kimani", type: "Student - Grade 10", status: "Verified", method: "Biometric" },
    { time: "01:15:08 PM", name: "Sarah Wanjiku", type: "Student - Grade 11", status: "Verified", method: "RFID Card" },
    { time: "01:14:45 PM", name: "John Omondi", type: "Staff - Teaching", status: "Verified", method: "Biometric" },
    { time: "01:14:12 PM", name: "Unknown ID", type: "Unknown", status: "Denied", method: "RFID Card" },
    { time: "01:13:59 PM", name: "Grace Nduta", type: "Student - Grade 9", status: "Verified", method: "Biometric" },
    { time: "01:13:30 PM", name: "Peter Kamau", type: "Student - Grade 12", status: "Verified", method: "Biometric" },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Meal Attendance</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Live biometric & RFID scanning logs for Lunch.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Download className="w-4 h-4" /> Export Log
          </button>
          <button className="px-5 py-2.5 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors shadow-sm flex items-center gap-2 justify-center">
            <ScanFace className="w-4 h-4" /> Scanner Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-5 shadow-sm hover:shadow-md transition-all flex items-center gap-4">
              <div className={`w-14 h-14 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shrink-0 shadow-inner`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500">{stat.title}</p>
                <p className="text-2xl font-black text-slate-800">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Live Feed */}
         <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="font-black text-slate-800 flex items-center gap-2">
                     <span className="relative flex h-3 w-3 mr-1">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                     </span>
                     Live Scan Feed
                  </h3>
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Time</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Name</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Group</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">Method</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap text-right">Status</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {recentScans.map((scan, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                           <td className="p-4 text-xs font-bold text-slate-400 font-mono">{scan.time}</td>
                           <td className="p-4 font-bold text-slate-800 text-sm">{scan.name}</td>
                           <td className="p-4 text-sm font-medium text-slate-600">{scan.type}</td>
                           <td className="p-4 text-xs font-bold text-slate-500">{scan.method}</td>
                           <td className="p-4 text-right">
                              <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                                 scan.status === 'Verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                              }`}>
                                 {scan.status}
                              </span>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         {/* Exceptions & Alerts */}
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="font-black text-slate-800 flex items-center gap-2">
                     <AlertCircle className="w-4 h-4 text-rose-500" /> Exceptions (12)
                  </h3>
               </div>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto max-h-[400px] hide-scrollbar">
               {[
                  { title: "Double Scan Attempt", desc: "Grade 10 Student tried scanning twice.", time: "2 mins ago" },
                  { title: "Invalid RFID Card", desc: "Unrecognized card ID at Scanner 2.", time: "15 mins ago" },
                  { title: "Dietary Restriction Warning", desc: "Student with gluten allergy scanned in.", time: "18 mins ago" },
                  { title: "System Offline", desc: "Scanner 4 momentarily lost connection.", time: "30 mins ago" },
               ].map((alert, i) => (
                  <div key={i} className="p-4 border border-rose-100 bg-rose-50/30 rounded-2xl flex flex-col gap-1">
                     <div className="flex justify-between items-start">
                        <span className="font-bold text-slate-800 text-sm">{alert.title}</span>
                        <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{alert.time}</span>
                     </div>
                     <span className="text-xs font-medium text-slate-600">{alert.desc}</span>
                  </div>
               ))}
               <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-50 transition-colors">
                  View All Exceptions
               </button>
            </div>
         </div>
      </div>

    </div>
  );
}
