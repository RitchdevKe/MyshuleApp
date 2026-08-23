"use client";

import React from "react";
import { Bell, Search, Filter, Plus, Calendar, AlertTriangle, Users, MailCheck, Megaphone, Activity, CheckCircle2 } from "lucide-react";

export default function AnnouncementsPage() {
  const announcements = [
    { id: "ANN-01", title: "Severe Weather Warning: Early Dismissal", audience: "All Students, Parents, Staff", date: "Aug 11, 2024", type: "Emergency", status: "Published", reach: "2,450 / 2,500" },
    { id: "ANN-02", title: "Term 2 Syllabus Updates Available", audience: "All Students, Parents", date: "Aug 10, 2024", type: "Academic", status: "Published", reach: "1,890 / 2,100" },
    { id: "ANN-03", title: "Staff Development Day - No Classes", audience: "All Staff", date: "Aug 15, 2024", type: "Notice", status: "Scheduled", reach: "0 / 400" },
    { id: "ANN-04", title: "Monthly Parent Newsletter - August", audience: "Parents", date: "Aug 01, 2024", type: "Newsletter", status: "Published", reach: "1,950 / 2,100" },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
               <Megaphone className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Broadcasts</p>
               <h3 className="text-2xl font-black text-slate-800">45</h3>
               <p className="text-xs font-bold text-emerald-600 mt-1">+12 this month</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
               <Activity className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Avg. Reach</p>
               <h3 className="text-2xl font-black text-slate-800">92%</h3>
               <p className="text-xs font-bold text-slate-500 mt-1">Across all audiences</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
               <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Scheduled</p>
               <h3 className="text-2xl font-black text-slate-800">3</h3>
               <p className="text-xs font-bold text-slate-500 mt-1">Pending publication</p>
            </div>
         </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl hidden md:block">
                 <Bell className="w-6 h-6" />
              </div>
              <div>
                 <h2 className="text-lg font-black text-slate-800">School Announcements</h2>
                 <p className="text-sm font-medium text-slate-500">Manage broadcasts, newsletters, and emergency alerts.</p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              New Announcement
           </button>
        </div>

        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search announcements..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <div className="flex gap-2">
              <select className="px-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-900 cursor-pointer">
                 <option>All Types</option>
                 <option>Emergency</option>
                 <option>Academic</option>
                 <option>Notice</option>
                 <option>Newsletter</option>
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
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Announcement</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Audience & Reach</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {announcements.map((ann) => (
                   <tr key={ann.id} className="hover:bg-slate-50/50 transition-colors group">
                     <td className="py-4 px-6">
                        <span className="font-bold text-slate-800 text-sm leading-tight block mb-1">{ann.title}</span>
                        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                           <Calendar className="w-3 h-3" /> {ann.date}
                        </div>
                     </td>
                     <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-lg border ${
                          ann.type === 'Emergency' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          ann.type === 'Academic' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          ann.type === 'Newsletter' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {ann.type === 'Emergency' && <AlertTriangle className="w-3 h-3" />}
                          {ann.type}
                        </span>
                     </td>
                     <td className="py-4 px-6">
                        <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700 mb-1">
                           <Users className="w-3.5 h-3.5 text-slate-400" />
                           {ann.audience}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                           <MailCheck className="w-3.5 h-3.5" /> Reach: {ann.reach}
                        </div>
                     </td>
                     <td className="py-4 px-6">
                       <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-black uppercase tracking-wider rounded ${
                         ann.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                       }`}>
                         {ann.status}
                       </span>
                     </td>
                     <td className="py-4 px-6 text-right">
                        <button className="text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 px-4 py-2 rounded-xl transition-all shadow-sm shadow-primary-900/20 flex items-center gap-1 ml-auto">
                           View Details
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