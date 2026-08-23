"use client";

import React from "react";
import { ClipboardList, Search, Filter, Plus, Wrench, CircleDashed, Clock, CheckCircle2, User } from "lucide-react";

export default function WorkOrdersPage() {
  const workOrders = [
    { id: "WO-8891", title: "Broken Projector Mount", location: "Block A - Room 102", priority: "Medium", requester: "Jane Doe", assignee: "IT Support", date: "Aug 11, 2024", status: "Open", estimatedCost: "$0.00" },
    { id: "WO-8890", title: "Leaking Faucet", location: "Science Block Washrooms", priority: "High", requester: "Dr. Smith", assignee: "Plumbing Team", date: "Aug 10, 2024", status: "In Progress", estimatedCost: "$45.00" },
    { id: "WO-8889", title: "Flickering Lights", location: "Main Library", priority: "Low", requester: "Alice Johnson", assignee: "Electrical Team", date: "Aug 09, 2024", status: "Open", estimatedCost: "$15.00" },
    { id: "WO-8888", title: "AC Unit Malfunction", location: "Server Room A", priority: "Critical", requester: "System Admin", assignee: "CoolingTech Ltd", date: "Aug 08, 2024", status: "Completed", estimatedCost: "$250.00" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl hidden md:block">
                 <ClipboardList className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Repair Work Orders</h2>
                 <p className="text-sm font-medium text-slate-500">Helpdesk tracker for asset breakages and facility repairs.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Create Work Order
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search tickets by ID, Title, or Location..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Statuses</option>
                 <option>Open</option>
                 <option>In Progress</option>
                 <option>Completed</option>
              </select>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Filter className="w-4 h-4" />
                 Filter
              </button>
           </div>
        </div>
        
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Ticket Info</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Requester & Location</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Assignee & Cost</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {workOrders.map((wo) => (
                   <tr key={wo.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm">{wo.title}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{wo.id}</span>
                           <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                           <span className={`text-[10px] font-black uppercase tracking-wider ${
                              wo.priority === 'Critical' ? 'text-rose-600' :
                              wo.priority === 'High' ? 'text-amber-600' :
                              wo.priority === 'Medium' ? 'text-blue-600' : 'text-slate-500'
                           }`}>
                              {wo.priority} Priority
                           </span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 mb-1 text-sm">
                           <User className="w-3.5 h-3.5 text-slate-400" />
                           <span className="font-bold text-slate-700">{wo.requester}</span>
                        </div>
                        <p className="text-xs font-medium text-slate-500">{wo.location}</p>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 mb-1 text-sm">
                           <Wrench className="w-3.5 h-3.5 text-slate-400" />
                           <span className="font-bold text-slate-700">{wo.assignee}</span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. {wo.estimatedCost}</p>
                     </td>
                     <td className="py-4 px-6">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                         wo.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                         wo.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 
                         'bg-slate-100 text-slate-600'
                       }`}>
                         {wo.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {wo.status === 'In Progress' && <Clock className="w-3.5 h-3.5" />}
                         {wo.status === 'Open' && <CircleDashed className="w-3.5 h-3.5" />}
                         {wo.status}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100">
                              Manage
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
    </div>
  );
}
