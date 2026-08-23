"use client";

import React from "react";
import { RefreshCcw, Search, Filter, ScanLine, Clock, AlertCircle, CheckCircle2, MoreHorizontal } from "lucide-react";

export default function CirculationPage() {
  const circulations = [
    { id: "CIR-901", bookTitle: "The Mythical Man-Month", bookId: "LIB-8841", member: "Emily Chen (Grade 10)", memberId: "MEM-405", checkoutDate: "Aug 01, 2024", dueDate: "Aug 15, 2024", status: "Active", fine: "$0.00" },
    { id: "CIR-900", bookTitle: "Design Patterns", bookId: "LIB-8839", member: "David Kim (Staff)", memberId: "MEM-042", checkoutDate: "Jul 15, 2024", dueDate: "Jul 29, 2024", status: "Overdue", fine: "$12.50" },
    { id: "CIR-899", bookTitle: "Clean Code", bookId: "LIB-8838", member: "Sophia Patel (Grade 12)", memberId: "MEM-112", checkoutDate: "Aug 05, 2024", dueDate: "Aug 19, 2024", status: "Active", fine: "$0.00" },
    { id: "CIR-898", bookTitle: "Introduction to Algorithms", bookId: "LIB-8840", member: "James Wilson (Grade 8)", memberId: "MEM-889", checkoutDate: "Aug 08, 2024", dueDate: "Aug 22, 2024", status: "Active", fine: "$0.00" },
    { id: "CIR-897", bookTitle: "The C Programming Language", bookId: "LIB-8842", member: "Alice Johnson (Staff)", memberId: "MEM-018", checkoutDate: "Jul 20, 2024", dueDate: "Aug 03, 2024", status: "Returned", fine: "$0.00" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hidden md:block">
                 <RefreshCcw className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">Book Circulation</h2>
                 <p className="text-sm font-medium text-slate-500">Track check-outs, returns, and overdue library items.</p>
              </div>
           </div>
           <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
                 <ScanLine className="w-4 h-4" />
                 Check In
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
                 <ScanLine className="w-4 h-4" />
                 Check Out
              </button>
           </div>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search by Book, Member, or ID..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Statuses</option>
                 <option>Active</option>
                 <option>Overdue</option>
                 <option>Returned</option>
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
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Book & ID</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Member</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Dates</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status & Fines</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {circulations.map((circ) => (
                   <tr key={circ.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">{circ.bookTitle}</span>
                        <div className="flex items-center gap-2">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{circ.id}</span>
                           <span className="text-[10px] font-medium text-slate-500">{circ.bookId}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <p className="font-bold text-primary-700 text-sm">{circ.member}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">{circ.memberId}</p>
                     </td>
                     <td className="py-4 px-6">
                        <div className="text-xs space-y-1">
                           <div className="flex justify-between w-40">
                              <span className="text-slate-500">Out:</span>
                              <span className="font-medium text-slate-700">{circ.checkoutDate}</span>
                           </div>
                           <div className="flex justify-between w-40">
                              <span className="text-slate-500">Due:</span>
                              <span className={`font-bold ${circ.status === 'Overdue' ? 'text-rose-600' : 'text-slate-700'}`}>{circ.dueDate}</span>
                           </div>
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <div className="flex flex-col items-start gap-1">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg ${
                            circ.status === 'Active' ? 'bg-blue-50 text-blue-600' : 
                            circ.status === 'Overdue' ? 'bg-rose-50 text-rose-600' : 
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {circ.status === 'Active' && <Clock className="w-3.5 h-3.5" />}
                            {circ.status === 'Overdue' && <AlertCircle className="w-3.5 h-3.5" />}
                            {circ.status === 'Returned' && <CheckCircle2 className="w-3.5 h-3.5" />}
                            {circ.status}
                          </span>
                          {circ.fine !== '$0.00' && (
                             <span className="text-[10px] font-bold text-rose-600 ml-1">Fine: {circ.fine}</span>
                          )}
                       </div>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-slate-400 hover:text-primary-600 hover:bg-primary-50 p-2 rounded-lg transition-colors inline-flex">
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
    </div>
  );
}
