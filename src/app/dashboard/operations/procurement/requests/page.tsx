"use client";

import React from "react";
import { FileText, Search, Filter, Clock, CheckCircle2, XCircle, MoreHorizontal } from "lucide-react";

export default function PurchaseRequestsPage() {
  const requests = [
    { id: "PR-2024-1042", department: "IT & Technology", item: "MacBook Pro M3 (x5)", cost: "$12,500.00", date: "Aug 11, 2024", status: "Pending", priority: "High" },
    { id: "PR-2024-1041", department: "Administration", item: "Office Supplies Bulk Order", cost: "$850.00", date: "Aug 10, 2024", status: "Approved", priority: "Low" },
    { id: "PR-2024-1040", department: "Academic Staff", item: "Smartboards for Room A & B", cost: "$4,200.00", date: "Aug 08, 2024", status: "Approved", priority: "Medium" },
    { id: "PR-2024-1039", department: "Support & Maintenance", item: "HVAC Filters & Belts", cost: "$1,150.00", date: "Aug 05, 2024", status: "Rejected", priority: "Medium" },
    { id: "PR-2024-1038", department: "Management", item: "Executive Chair Replacement", cost: "$600.00", date: "Aug 02, 2024", status: "Pending", priority: "Low" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-primary-50 text-primary-600 rounded-2xl hidden md:block">
                 <FileText className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Purchase Requests</h2>
                 <p className="text-sm font-medium text-slate-500">Track and manage internal requisition requests from all departments.</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="text-center px-4 border-r border-slate-200">
                 <p className="text-2xl font-black text-slate-800">12</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total this month</p>
              </div>
              <div className="text-center px-4 border-r border-slate-200">
                 <p className="text-2xl font-black text-amber-600">4</p>
                 <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">Pending Approval</p>
              </div>
              <div className="text-center px-4">
                 <p className="text-2xl font-black text-emerald-600">$18.5k</p>
                 <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Approved Value</p>
              </div>
           </div>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by ID, item, or department..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Statuses</option>
                 <option>Pending</option>
                 <option>Approved</option>
                 <option>Rejected</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 More Filters
              </button>
           </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Request ID</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Department</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Items Requested</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Estimated Cost</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-700 text-sm">{req.id}</span>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{req.date}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-slate-800 text-sm">{req.department}</span>
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-slate-800 text-sm">{req.item}</p>
                    <span className={`inline-block mt-1 px-2 py-0.5 text-[10px] font-bold uppercase rounded-md ${
                       req.priority === 'High' ? 'bg-rose-50 text-rose-600' :
                       req.priority === 'Medium' ? 'bg-amber-50 text-amber-600' :
                       'bg-slate-100 text-slate-600'
                    }`}>{req.priority} Priority</span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="font-black text-slate-800 text-sm">{req.cost}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                      req.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 
                      req.status === 'Rejected' ? 'bg-rose-50 text-rose-600' : 
                      'bg-amber-50 text-amber-600'
                    }`}>
                      {req.status === 'Approved' && <CheckCircle2 className="w-3.5 h-3.5" />}
                      {req.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                      {req.status === 'Rejected' && <XCircle className="w-3.5 h-3.5" />}
                      {req.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                     <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                     </button>
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
