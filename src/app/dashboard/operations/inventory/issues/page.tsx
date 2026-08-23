"use client";

import React from "react";
import { History, Search, Filter, CheckCircle2, Clock, XCircle, PackageOpen, Plus } from "lucide-react";

export default function StockIssuesPage() {
  const issues = [
    { id: "ISS-2024-405", requester: "Sarah Palmer", department: "Sales", items: "A4 Printer Paper (x10)", store: "Stationery Cupboard", date: "Aug 09, 2024", status: "Fulfilled" },
    { id: "ISS-2024-406", requester: "David Kim", department: "IT & Technology", items: "Ethernet Cables (x50m)", store: "Main HQ Storage", date: "Aug 11, 2024", status: "Pending" },
    { id: "ISS-2024-407", requester: "Michael Ochieng", department: "Maintenance", items: "HVAC Filters (x2)", store: "Maintenance Depot", date: "Aug 11, 2024", status: "Partially Fulfilled" },
    { id: "ISS-2024-408", requester: "Jane Doe", department: "Administration", items: "Ergonomic Chair (x1)", store: "Main HQ Storage", date: "Aug 10, 2024", status: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl hidden md:block">
                 <History className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Stock Issues & Dispatch</h2>
                 <p className="text-sm font-medium text-slate-500">Track internal requests and distribution of inventory items.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              New Issue Request
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by ID, Requester, or Item..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Statuses</option>
                 <option>Pending</option>
                 <option>Fulfilled</option>
                 <option>Partially Fulfilled</option>
                 <option>Rejected</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Issue ID</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Requester & Dept</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Requested Items</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Source Store</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {issues.map((issue) => (
                <tr key={issue.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 text-sm">{issue.id}</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{issue.date}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 text-sm">{issue.requester}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{issue.department}</p>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-700 text-sm">{issue.items}</p>
                  </td>
                  <td className="py-4 px-6">
                     <span className="text-xs font-medium text-slate-600">{issue.store}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      issue.status === 'Fulfilled' ? 'bg-emerald-50 text-emerald-600' : 
                      issue.status === 'Partially Fulfilled' ? 'bg-blue-50 text-blue-600' : 
                      issue.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {issue.status === 'Fulfilled' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {issue.status === 'Partially Fulfilled' && <PackageOpen className="w-3.5 h-3.5" />}
                      {issue.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {issue.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                      {issue.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors">
                           Process
                        </button>
                     </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
