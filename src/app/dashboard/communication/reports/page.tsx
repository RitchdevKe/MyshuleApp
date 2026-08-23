"use client";

import React, { useState } from "react";
import { BarChart3, FileText, Zap, Search, Plus, Mail, MessageCircle, ArrowRight, AlertTriangle } from "lucide-react";

export default function ReportsAutomationPage() {
  const [activeTab, setActiveTab] = useState("analytics");

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm w-fit">
        <button 
           onClick={() => setActiveTab('analytics')}
           className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'analytics' ? 'bg-secondary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
           <BarChart3 className="w-4 h-4" /> Analytics & Reports
        </button>
        <button 
           onClick={() => setActiveTab('templates')}
           className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'templates' ? 'bg-secondary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
           <FileText className="w-4 h-4" /> Message Templates
        </button>
        <button 
           onClick={() => setActiveTab('automation')}
           className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'automation' ? 'bg-secondary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
           <Zap className="w-4 h-4" /> Automated Workflows
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px]">
        {/* Header Actions */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder={`Search ${activeTab}...`} className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           {activeTab !== 'analytics' && (
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
                 <Plus className="w-4 h-4" />
                 Create New
              </button>
           )}
        </div>

        {/* Dynamic Content */}
        <div className="p-6">
           {activeTab === 'analytics' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {/* Mock Analytics Cards */}
                 <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Messages Sent</p>
                    <h3 className="text-3xl font-black text-slate-800">14,230</h3>
                    <p className="text-xs font-bold text-emerald-600 mt-2">+12% from last month</p>
                 </div>
                 <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Avg Open Rate</p>
                    <h3 className="text-3xl font-black text-slate-800">68%</h3>
                    <p className="text-xs font-bold text-emerald-600 mt-2">+4% from last month</p>
                 </div>
                 <div className="bg-slate-50 border border-slate-200/60 p-5 rounded-2xl">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">SMS Delivery Rate</p>
                    <h3 className="text-3xl font-black text-slate-800">99.8%</h3>
                    <p className="text-xs font-bold text-slate-500 mt-2">Stable</p>
                 </div>
              </div>
           )}

           {activeTab === 'templates' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[
                     { title: "Parent Teacher Meeting", type: "Email", icon: Mail },
                     { title: "Fee Reminder", type: "SMS", icon: MessageCircle },
                     { title: "Emergency Closure", type: "Multi-channel", icon: AlertTriangle }
                  ].map((tpl, i) => (
                     <div key={i} className="border border-slate-200 p-5 rounded-2xl hover:border-primary-400 hover:shadow-md transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                           <div className={`p-2 rounded-lg ${tpl.type === 'Email' ? 'bg-blue-50 text-blue-600' : tpl.type === 'SMS' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                              <tpl.icon className="w-5 h-5" />
                           </div>
                           <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded">{tpl.type}</span>
                       </div>
                       <h4 className="font-bold text-slate-800 mb-1">{tpl.title}</h4>
                       <p className="text-sm text-slate-500 font-medium">Standard template for {tpl.title.toLowerCase()}.</p>
                    </div>
                 ))}
              </div>
           )}

           {activeTab === 'automation' && (
              <div className="space-y-4">
                 {[
                    { name: "New Student Welcome Sequence", trigger: "On Enrollment", steps: 3, status: "Active" },
                    { name: "Automated Fee Reminders", trigger: "7 days before due date", steps: 2, status: "Active" },
                    { name: "Absence Alert to Parents", trigger: "Marked Absent", steps: 1, status: "Paused" },
                 ].map((workflow, i) => (
                    <div key={i} className="flex items-center justify-between p-4 border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
                       <div>
                          <h4 className="font-bold text-slate-800">{workflow.name}</h4>
                          <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 font-medium">
                             <span>Trigger: {workflow.trigger}</span>
                             <span>•</span>
                             <span>{workflow.steps} Action Steps</span>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${workflow.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>
                             {workflow.status}
                          </span>
                          <button className="flex items-center gap-1 p-2 bg-primary-900 text-white hover:bg-primary-800 rounded-xl transition-colors font-bold text-sm shadow-sm shadow-primary-900/20">
                             Manage <ArrowRight className="w-4 h-4" />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           )}
        </div>
      </div>
    </div>
  );
}
