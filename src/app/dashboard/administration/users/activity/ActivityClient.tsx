"use client";

import React from "react";
import { Search, LogIn, UserPlus, UserMinus, Shield, Filter, Activity } from "lucide-react";

export default function ActivityClient({ initialActivities }: { initialActivities: any[] }) {
  
  const getIconForAction = (action: string) => {
    if (action.includes("Login")) return { icon: LogIn, color: "text-blue-600 bg-blue-50" };
    if (action.includes("Role")) return { icon: Shield, color: "text-amber-600 bg-amber-50" };
    if (action.includes("Create")) return { icon: UserPlus, color: "text-emerald-600 bg-emerald-50" };
    if (action.includes("Suspend") || action.includes("Delete")) return { icon: UserMinus, color: "text-rose-600 bg-rose-50" };
    return { icon: Activity, color: "text-primary-600 bg-primary-50" };
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[500px]">
      <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
         <div className="flex items-center gap-2 w-full md:w-auto relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="Search activity logs..." className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
         </div>
         <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200/60 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-sm transition-all shadow-sm">
            <Filter className="w-4 h-4" />
            Filter Logs
         </button>
      </div>

      <div className="p-6">
         <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4">
            {initialActivities.map((activity) => {
               const { icon: Icon, color } = getIconForAction(activity.action);
               return (
                  <div key={activity.id} className="relative pl-8 group">
                     {/* Timeline Node */}
                     <div className={`absolute -left-[17px] top-0.5 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${color} shadow-sm group-hover:scale-110 transition-transform`}>
                        <Icon className="w-3.5 h-3.5" />
                     </div>
                     
                     {/* Content */}
                     <div className="bg-white border border-slate-100 p-4 rounded-2xl shadow-sm group-hover:border-primary-200 transition-colors">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                           <h4 className="font-bold text-slate-800">{activity.action}</h4>
                           <span className="text-xs font-black uppercase tracking-wider text-slate-400">{new Date(activity.createdAt).toLocaleString()}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-500 mb-1">{activity.entityName}</p>
                        <p className="text-xs font-bold text-slate-400">By {activity.user?.email || "System"}</p>
                     </div>
                  </div>
               );
            })}
            
            {initialActivities.length === 0 && (
               <div className="text-center text-slate-500 font-medium text-sm pt-8">
                  No activity logs recorded yet.
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
