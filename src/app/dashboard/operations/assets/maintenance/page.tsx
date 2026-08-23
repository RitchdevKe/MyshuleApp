"use client";

import React from "react";
import { Wrench, Search, Filter, Calendar, AlertCircle, Clock, CheckCircle2, ChevronRight, Plus } from "lucide-react";

export default function MaintenancePage() {
  const schedules = [
    { id: "PM-2024-08-01", asset: "Industrial Generator (AST-2023-112)", task: "Quarterly Oil & Filter Change", dueDate: "Aug 15, 2024", frequency: "Quarterly", assignee: "Michael Ochieng", priority: "High", status: "Upcoming" },
    { id: "PM-2024-08-02", asset: "HVAC System - Block A", task: "Filter Replacement & Vent Cleaning", dueDate: "Aug 10, 2024", frequency: "Bi-Annual", assignee: "CoolingTech Ltd (Vendor)", priority: "Medium", status: "Overdue" },
    { id: "PM-2024-08-03", asset: "School Bus (KBC 123Z)", task: "50,000km Major Service", dueDate: "Aug 12, 2024", frequency: "Mileage Based", assignee: "Transport Dept", priority: "High", status: "In Progress" },
    { id: "PM-2024-07-28", asset: "Server Room UPS", task: "Battery Health Check", dueDate: "Jul 28, 2024", frequency: "Monthly", assignee: "IT Dept", priority: "Critical", status: "Completed" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl hidden md:block">
                 <Wrench className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Preventative Maintenance</h2>
                 <p className="text-sm font-medium text-slate-500">Schedule and track routine maintenance for facilities and assets.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Create Schedule
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Asset, Task, or Assignee..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <Calendar className="w-4 h-4" />
                 This Month
              </button>
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
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule ID & Priority</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Asset & Task</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Timing & Assignee</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Action</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {schedules.map((schedule) => (
                   <tr key={schedule.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-700 text-sm">{schedule.id}</span>
                        <div className="mt-1">
                           <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md ${
                              schedule.priority === 'Critical' ? 'bg-rose-100 text-rose-700' :
                              schedule.priority === 'High' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                           }`}>
                              {schedule.priority}
                           </span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <p className="font-bold text-slate-800 text-sm">{schedule.asset}</p>
                       <p className="text-xs font-medium text-slate-500 mt-0.5">{schedule.task}</p>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-2 mb-1">
                           <Calendar className="w-3.5 h-3.5 text-slate-400" />
                           <span className={`text-sm font-bold ${schedule.status === 'Overdue' ? 'text-rose-600' : 'text-slate-700'}`}>
                              {schedule.dueDate}
                           </span>
                           <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase tracking-wider ml-1">
                              {schedule.frequency}
                           </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mt-1">Assigned: {schedule.assignee}</p>
                     </td>
                     <td className="py-4 px-6">
                       <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg ${
                         schedule.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 
                         schedule.status === 'In Progress' ? 'bg-blue-50 text-blue-600' : 
                         schedule.status === 'Overdue' ? 'bg-rose-50 text-rose-600' : 
                         'bg-slate-100 text-slate-600'
                       }`}>
                         {schedule.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                         {schedule.status === 'In Progress' && <Clock className="w-3.5 h-3.5" />}
                         {schedule.status === 'Overdue' && <AlertCircle className="w-3.5 h-3.5" />}
                         {schedule.status === 'Upcoming' && <Calendar className="w-3.5 h-3.5" />}
                         {schedule.status}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
                           <ChevronRight className="w-5 h-5" />
                        </button>
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
