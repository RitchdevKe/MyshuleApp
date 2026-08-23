"use client";

import React from "react";
import { Users, Search, Filter, UserPlus, ShieldCheck, AlertCircle, BookOpen, CreditCard } from "lucide-react";

export default function MembersPage() {
  const members = [
    { id: "MEM-405", name: "Emily Chen", type: "Student", group: "Grade 10", borrowed: 2, overdue: 0, fines: "$0.00", status: "Active" },
    { id: "MEM-042", name: "David Kim", type: "Staff", group: "Science Dept", borrowed: 5, overdue: 1, fines: "$12.50", status: "Active" },
    { id: "MEM-112", name: "Sophia Patel", type: "Student", group: "Grade 12", borrowed: 1, overdue: 0, fines: "$0.00", status: "Active" },
    { id: "MEM-889", name: "James Wilson", type: "Student", group: "Grade 8", borrowed: 3, overdue: 0, fines: "$5.00", status: "Suspended" },
    { id: "MEM-018", name: "Alice Johnson", type: "Staff", group: "English Dept", borrowed: 0, overdue: 0, fines: "$0.00", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl hidden md:block">
                 <Users className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Library Members</h2>
                 <p className="text-sm font-medium text-slate-500">Manage student and staff library access, limits, and fines.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <UserPlus className="w-4 h-4" />
              Register Member
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Name, ID, or Group..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Types</option>
                 <option>Student</option>
                 <option>Staff</option>
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
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Member Details</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Type & Group</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Active Loans</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Fines & Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {members.map((member) => (
                   <tr key={member.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm">{member.name}</span>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{member.id}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded-md mb-1 ${
                           member.type === 'Student' ? 'bg-blue-50 text-blue-700' : 'bg-emerald-50 text-emerald-700'
                        }`}>
                           {member.type}
                        </span>
                        <p className="text-xs font-medium text-slate-500">{member.group}</p>
                     </td>
                     <td className="py-4 px-6 text-center">
                        <div className="flex justify-center items-center gap-4">
                           <div className="text-center">
                              <span className="block text-lg font-black text-slate-800">{member.borrowed}</span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Borrowed</span>
                           </div>
                           {member.overdue > 0 && (
                              <div className="text-center">
                                 <span className="block text-lg font-black text-rose-600">{member.overdue}</span>
                                 <span className="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Overdue</span>
                              </div>
                           )}
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                            member.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 
                            'bg-rose-50 text-rose-600'
                          }`}>
                            {member.status === 'Active' && <ShieldCheck className="w-3.5 h-3.5" />}
                            {member.status === 'Suspended' && <AlertCircle className="w-3.5 h-3.5" />}
                            {member.status}
                          </span>
                          {member.fines !== '$0.00' && (
                             <span className="text-[10px] font-bold text-rose-600 ml-1 flex items-center gap-1 mt-1">
                                <CreditCard className="w-3 h-3" /> Fines: {member.fines}
                             </span>
                          )}
                       </div>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button className="text-sm font-bold text-primary-600 hover:text-primary-800 hover:bg-primary-50 px-3 py-1.5 rounded-lg transition-colors border border-primary-100 flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" /> View Loans
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
