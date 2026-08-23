"use client";
import React, { useState } from "react";
import { SlidersHorizontal, Share2, Clock, CheckSquare, Plus, Database, LayoutDashboard, Play, Settings, Trash2, Calendar, FileText, ArrowRight, User } from "lucide-react";

export default function CustomReportsDashboard() {
  const [activeTab, setActiveTab] = useState("builder");

  const tabs = [
    { id: "my-reports", label: "My Reports", icon: LayoutDashboard },
    { id: "builder", label: "Report Builder", icon: SlidersHorizontal },
    { id: "templates", label: "Templates", icon: CheckSquare },
    { id: "scheduled", label: "Scheduled", icon: Clock },
    { id: "shared", label: "Shared", icon: Share2 },
  ];

  // Dummy data for tabs
  const myReports = [
    { name: "Grade 8 Fee Balances", desc: "List of Grade 8 students with outstanding fees > 0", lastRun: "Today, 10:30 AM" },
    { name: "Term 1 Staff Attendance", desc: "Monthly attendance aggregated by department", lastRun: "Yesterday, 4:15 PM" },
    { name: "Transport Routes Utilization", desc: "Bus capacities vs actual ridership", lastRun: "Oct 12, 2026" },
  ];

  const templates = [
    { name: "Financial Defaulters list", dept: "Finance", desc: "Students with negative fee balances grouped by class." },
    { name: "Academic Probation", dept: "Academic", desc: "Students scoring below 40% in core subjects." },
    { name: "Daily Attendance Summary", dept: "Admin", desc: "School-wide attendance metrics." },
    { name: "Inventory Reorder List", dept: "Operations", desc: "Items below minimum stock threshold." },
  ];

  const scheduled = [
    { name: "Weekly Fee Collections", freq: "Every Friday at 17:00", recipients: "finance@greenvalley.edu", nextRun: "Tomorrow, 17:00" },
    { name: "Daily Absenteeism Alert", freq: "Every Mon-Fri at 09:00", recipients: "principals@greenvalley.edu", nextRun: "Today, 09:00" },
  ];

  const shared = [
    { name: "Ministry Compliance Export", owner: "J. Doe (Admin)", permission: "Can View", dateShared: "Oct 10, 2026" },
    { name: "Sports Day Budget Actuals", owner: "M. Kariuki (Sports)", permission: "Can Edit", dateShared: "Oct 05, 2026" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Contextual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary-900 p-5 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight capitalize">
            Custom Reports
          </h1>
          <p className="text-sm text-primary-100 font-medium mt-1">
            Build powerful cross-module reports, schedule automated delivery, and share with teams.
          </p>
        </div>
        <button onClick={() => setActiveTab('builder')} className="flex items-center justify-center gap-2 px-6 py-2.5 bg-secondary-500 text-white rounded-xl font-bold text-sm hover:bg-secondary-600 transition-all shadow-sm">
          <Plus className="w-4 h-4" /> Create New Report
        </button>
      </div>

      {/* Dynamic Tab Navigation */}
      <div className="flex space-x-2 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl overflow-x-auto border border-white/60 backdrop-blur-md shadow-sm hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "bg-secondary-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[600px]">
        
        {/* 1. REPORT BUILDER */}
        {activeTab === "builder" && (
          <div className="flex flex-col md:flex-row min-h-[600px]">
            {/* Sidebar Builder */}
            <div className="w-full md:w-80 border-r border-slate-200/80 bg-slate-50/50 p-6 space-y-6">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-indigo-500" /> Report Configuration
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">1. Data Sources</label>
                  <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl p-2 space-y-2 shadow-sm">
                     <div className="flex items-center justify-between bg-indigo-50 border border-indigo-100 px-3 py-2 rounded-lg">
                       <span className="text-sm font-bold text-indigo-700 flex items-center gap-2"><Database className="w-3 h-3"/> Students</span>
                       <button className="text-slate-400 hover:text-rose-500 transition-colors">×</button>
                     </div>
                     <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 px-3 py-2 rounded-lg">
                       <span className="text-sm font-bold text-emerald-700 flex items-center gap-2"><Database className="w-3 h-3"/> Fees</span>
                       <button className="text-slate-400 hover:text-rose-500 transition-colors">×</button>
                     </div>
                     <button className="w-full py-2 text-xs font-bold text-indigo-600 border border-dashed border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors flex justify-center items-center gap-1">
                        <Plus className="w-3 h-3" /> Add Source (Join)
                     </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">2. Select Fields</label>
                  <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-xl p-3 space-y-2 max-h-40 overflow-y-auto shadow-sm">
                    <label className="flex items-center gap-2 text-sm text-slate-700 font-medium hover:text-indigo-600 cursor-pointer transition-colors">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Student Name
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 font-medium hover:text-indigo-600 cursor-pointer transition-colors">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Class
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 font-medium hover:text-indigo-600 cursor-pointer transition-colors">
                      <input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Gender
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 font-medium hover:text-indigo-600 cursor-pointer transition-colors">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Attendance %
                    </label>
                    <label className="flex items-center gap-2 text-sm text-slate-700 font-medium hover:text-indigo-600 cursor-pointer transition-colors">
                      <input type="checkbox" defaultChecked className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /> Fees Balance
                    </label>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2 block">3. Filters & Grouping</label>
                  <div className="space-y-2">
                     <select className="w-full bg-white/80 backdrop-blur-xl border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500">
                     <option>Filter: Class = Grade 8</option>
                     </select>
                     <select className="w-full bg-white/80 backdrop-blur-xl border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500">
                     <option>Group By: Class</option>
                     </select>
                     <select className="w-full bg-white/80 backdrop-blur-xl border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:border-indigo-500">
                     <option>Sort: Fees Balance (Descending)</option>
                     </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Preview Area */}
            <div className="flex-1 p-6 bg-slate-100/50 flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-black text-slate-800">Preview: Students at Risk with Outstanding Fees</h2>
                  <p className="text-xs font-medium text-slate-500 mt-1">Live data preview based on configuration.</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-white/80 backdrop-blur-xl border border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-slate-50 transition-colors shadow-sm">Save as Template</button>
                  <button className="bg-primary-900 text-white font-bold px-6 py-2 rounded-xl text-sm hover:bg-primary-800 transition-colors shadow-sm flex items-center gap-2">
                     <Play className="w-4 h-4 fill-current" /> Run Report
                  </button>
                </div>
              </div>

              {/* Table Preview */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase tracking-wider text-slate-500 font-black">
                        <th className="p-4">Student Name</th>
                        <th className="p-4">Class</th>
                        <th className="p-4">Attendance %</th>
                        <th className="p-4 text-right">Fees Balance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                      <tr className="hover:bg-slate-50/80 transition-colors">
                         <td className="p-4 text-slate-800 font-bold">Wanjiku, Jane</td>
                         <td className="p-4">8A</td>
                         <td className="p-4 text-rose-600 font-bold">71%</td>
                         <td className="p-4 text-right font-black text-amber-600">KSh 45,000</td>
                      </tr>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                         <td className="p-4 text-slate-800 font-bold">Ochieng, David</td>
                         <td className="p-4">8B</td>
                         <td className="p-4 text-rose-600 font-bold">76%</td>
                         <td className="p-4 text-right font-black text-amber-600">KSh 22,500</td>
                      </tr>
                      <tr className="hover:bg-slate-50/80 transition-colors">
                         <td className="p-4 text-slate-800 font-bold">Mutua, Brian</td>
                         <td className="p-4">8A</td>
                         <td className="p-4 text-amber-500 font-bold">82%</td>
                         <td className="p-4 text-right font-black text-rose-600">KSh 85,000</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="p-3 border-t border-slate-100 bg-slate-50/50 text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center">
                  Showing top 3 rows of preview data
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. MY REPORTS */}
        {activeTab === "my-reports" && (
           <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-lg font-black text-slate-800">My Saved Reports</h2>
                    <p className="text-sm text-slate-500">Reports you have built and saved for quick access.</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {myReports.map((report, i) => (
                    <div key={i} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col">
                       <div className="flex items-start justify-between mb-3">
                          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                             <FileText className="w-5 h-5" />
                          </div>
                          <div className="flex gap-1">
                             <button className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Settings className="w-4 h-4" /></button>
                             <button className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                          </div>
                       </div>
                       <h3 className="font-bold text-slate-800 text-base mb-1">{report.name}</h3>
                       <p className="text-xs text-slate-500 mb-4 flex-1">{report.desc}</p>
                       <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">Last run: {report.lastRun}</div>
                          <button className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1 transition-colors">
                             Run <ArrowRight className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* 3. TEMPLATES */}
        {activeTab === "templates" && (
           <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-lg font-black text-slate-800">Report Templates Gallery</h2>
                    <p className="text-sm text-slate-500">Pre-built configurations for common reporting needs.</p>
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {templates.map((tpl, i) => (
                    <div key={i} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm flex items-center gap-4 hover:border-primary-300 transition-colors group">
                       <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                          <CheckSquare className="w-6 h-6 text-slate-400 group-hover:text-primary-500" />
                       </div>
                       <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                             <h3 className="font-bold text-slate-800">{tpl.name}</h3>
                             <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">{tpl.dept}</span>
                          </div>
                          <p className="text-xs text-slate-500">{tpl.desc}</p>
                       </div>
                       <button className="px-4 py-2 bg-slate-50 text-slate-700 text-xs font-bold rounded-lg border border-slate-200 hover:bg-primary-900 hover:text-white transition-all">
                          Use
                       </button>
                    </div>
                 ))}
              </div>
           </div>
        )}

        {/* 4. SCHEDULED */}
        {activeTab === "scheduled" && (
           <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-lg font-black text-slate-800">Scheduled Reports</h2>
                    <p className="text-sm text-slate-500">Manage automated report generation and delivery.</p>
                 </div>
                 <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold text-sm hover:bg-slate-50 transition-all shadow-sm">
                   <Clock className="w-4 h-4" /> New Schedule
                 </button>
              </div>
              
              <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wider font-black text-slate-500">
                          <th className="p-4">Report Name</th>
                          <th className="p-4">Frequency</th>
                          <th className="p-4">Recipients</th>
                          <th className="p-4">Next Run</th>
                          <th className="p-4 text-right">Status</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {scheduled.map((sch, i) => (
                          <tr key={i} className="hover:bg-slate-50/80">
                             <td className="p-4 font-bold text-sm text-slate-800">{sch.name}</td>
                             <td className="p-4 text-sm text-slate-600 flex items-center gap-2"><Calendar className="w-4 h-4 text-slate-400"/> {sch.freq}</td>
                             <td className="p-4 text-xs font-medium text-slate-500">{sch.recipients}</td>
                             <td className="p-4 text-sm font-bold text-indigo-600">{sch.nextRun}</td>
                             <td className="p-4 text-right">
                                <div className="inline-flex bg-emerald-50 text-emerald-700 border border-emerald-100 px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                                   Active
                                </div>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {/* 5. SHARED */}
        {activeTab === "shared" && (
           <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-lg font-black text-slate-800">Shared With Me</h2>
                    <p className="text-sm text-slate-500">Reports shared by other staff members.</p>
                 </div>
              </div>
              
              <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden">
                 <table className="w-full text-left border-collapse">
                    <thead>
                       <tr className="bg-slate-50 border-b border-slate-100 text-[10px] uppercase tracking-wider font-black text-slate-500">
                          <th className="p-4">Report Name</th>
                          <th className="p-4">Owner</th>
                          <th className="p-4">Date Shared</th>
                          <th className="p-4">My Permission</th>
                          <th className="p-4 text-right">Action</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                       {shared.map((sh, i) => (
                          <tr key={i} className="hover:bg-slate-50/80">
                             <td className="p-4 font-bold text-sm text-slate-800">{sh.name}</td>
                             <td className="p-4 text-sm text-slate-600 flex items-center gap-2"><User className="w-4 h-4 text-slate-400"/> {sh.owner}</td>
                             <td className="p-4 text-xs font-medium text-slate-500">{sh.dateShared}</td>
                             <td className="p-4">
                                <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded-md text-[10px] font-black uppercase tracking-wider border border-slate-200">
                                   {sh.permission}
                                </span>
                             </td>
                             <td className="p-4 text-right">
                                <button className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-primary-600 hover:border-primary-300 rounded-lg text-xs font-bold transition-all shadow-sm">
                                   Open Report
                                </button>
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}
      </div>

    </div>
  );
}
