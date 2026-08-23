"use client";

import React, { useState } from "react";
import { CheckSquare, Search, Filter, CheckCircle2, XCircle, MoreVertical, MessageSquare, AlertCircle } from "lucide-react";

export default function ApprovalsPage() {
  const [activeTab, setActiveTab] = useState("Pending");

  const approvals = [
    { id: "REQ-209", reqDate: "Today, 10:45 AM", dept: "Infrastructure", requestedBy: "Eng. David", amount: "2,500,000", desc: "Emergency Server Replacement", type: "Reallocation", status: "Pending", urgency: "High" },
    { id: "REQ-208", reqDate: "Yesterday, 14:15 PM", dept: "Sports", requestedBy: "Coach Brian", amount: "450,000", desc: "Term 3 Tournament Gear", type: "New Budget", status: "Pending", urgency: "Normal" },
    { id: "REQ-207", reqDate: "12 Oct 2026", dept: "Academic", requestedBy: "Dr. Sarah", amount: "1,200,000", desc: "Science Lab Reagents", type: "Expenditure", status: "Approved", urgency: "Normal" },
    { id: "REQ-206", reqDate: "10 Oct 2026", dept: "Transport", requestedBy: "Peter N.", amount: "5,000,000", desc: "New Bus Deposit", type: "New Budget", status: "Rejected", urgency: "Normal" },
  ];

  const filteredApprovals = approvals.filter(a => activeTab === "All" || a.status === activeTab);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-black text-slate-800">Budget Approvals</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Review, approve, or reject budget requests and reallocations.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search requests..." className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary-900 shadow-sm" />
          </div>
          <button className="p-2 text-slate-500 bg-white border border-slate-200 rounded-xl shadow-sm hover:bg-slate-50 transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Internal Tabs */}
      <div className="flex gap-4 border-b border-slate-200 mb-6">
        {["Pending", "Approved", "Rejected", "All"].map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold transition-colors border-b-2 ${
              activeTab === tab 
                ? "border-primary-900 text-primary-900" 
                : "border-transparent text-slate-500 hover:text-slate-800"
            }`}
          >
            {tab}
            {tab === "Pending" && (
               <span className="ml-2 px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px]">2</span>
            )}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredApprovals.map((req) => (
          <div key={req.id} className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 transition-all hover:shadow-md group">
             <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                
                {/* Info Section */}
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        req.type === 'Reallocation' ? 'bg-blue-100 text-blue-700' :
                        req.type === 'New Budget' ? 'bg-purple-100 text-purple-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                         {req.type}
                      </span>
                      {req.urgency === 'High' && (
                         <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                            <AlertCircle className="w-3 h-3" /> High Urgency
                         </span>
                      )}
                      <span className="text-xs font-semibold text-slate-400">{req.id} • {req.reqDate}</span>
                   </div>
                   <h3 className="text-lg font-bold text-slate-800 mb-1">{req.desc}</h3>
                   <p className="text-sm font-medium text-slate-500">Requested by <span className="font-bold text-slate-700">{req.requestedBy}</span> for <span className="font-bold text-slate-700">{req.dept} Dept</span>.</p>
                </div>

                {/* Amount Section */}
                <div className="lg:w-48 lg:border-l lg:border-slate-100 lg:pl-6 text-left lg:text-right">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Amount Requested</p>
                   <p className="text-2xl font-black text-slate-800">KSh {req.amount}</p>
                </div>

                {/* Actions / Status Section */}
                <div className="lg:w-56 flex justify-end items-center">
                   {req.status === 'Pending' ? (
                      <div className="flex gap-2">
                         <button className="p-2 text-slate-400 hover:text-primary-900 bg-slate-50 hover:bg-primary-50 rounded-xl transition-colors shadow-sm border border-slate-100" title="Request Info">
                            <MessageSquare className="w-4 h-4" />
                         </button>
                         <button className="flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded-xl text-sm font-bold shadow-sm transition-colors">
                            <XCircle className="w-4 h-4" /> Reject
                         </button>
                         <button className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/20 transition-colors">
                            <CheckCircle2 className="w-4 h-4" /> Approve
                         </button>
                      </div>
                   ) : (
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider ${
                        req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                      }`}>
                         {req.status === 'Approved' ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                         {req.status}
                      </span>
                   )}
                </div>

             </div>
          </div>
        ))}

        {filteredApprovals.length === 0 && (
           <div className="text-center py-12">
              <CheckSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-700">All caught up!</h3>
              <p className="text-slate-500 text-sm mt-1">There are no {activeTab.toLowerCase()} requests to review.</p>
           </div>
        )}
      </div>

    </div>
  );
}
