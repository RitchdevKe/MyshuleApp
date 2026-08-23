"use client";

import React from "react";
import { ChefHat, Flame, Clock, CheckCircle, Plus, PenTool, Thermometer, AlertCircle } from "lucide-react";

export default function KitchenPage() {
  const prepTasks = [
    { task: "Breakfast Prep", status: "Completed", time: "04:30 AM", icon: CheckCircle, color: "text-emerald-500", bg: "bg-emerald-50", border: "border-emerald-200" },
    { task: "Lunch Cooking", status: "In Progress", time: "10:00 AM", icon: Flame, color: "text-amber-500", bg: "bg-amber-50", border: "border-amber-200" },
    { task: "Dinner Prep", status: "Scheduled", time: "03:00 PM", icon: Clock, color: "text-slate-500", bg: "bg-slate-50", border: "border-slate-200" },
  ];

  return (
    <div className="p-6 space-y-6">
      
      <div className="flex justify-between items-center">
         <div>
            <h2 className="text-lg font-black text-slate-800">Kitchen Operations</h2>
            <p className="text-sm text-slate-500">Manage daily production schedules, staff, and equipment.</p>
         </div>
         <button className="flex items-center gap-2 bg-primary-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-primary-800 transition-colors">
            <Plus className="w-4 h-4" /> New Task
         </button>
      </div>

      {/* Production Pipeline */}
      <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mt-4">Today's Production Pipeline</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {prepTasks.map((task, idx) => {
          const Icon = task.icon;
          return (
            <div key={idx} className={`bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm flex flex-col relative overflow-hidden group`}>
              <div className="flex justify-between items-center mb-6">
                <span className={`text-xs font-bold ${task.color} ${task.bg} border ${task.border} px-3 py-1 rounded-lg`}>{task.time}</span>
                <Icon className={`w-6 h-6 ${task.color}`} />
              </div>
              <h3 className="text-xl font-black text-slate-800 mb-1">{task.task}</h3>
              <p className={`text-sm font-bold ${task.color}`}>{task.status}</p>
              
              {task.status === "In Progress" && (
                 <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                       <span>Progress</span>
                       <span>65%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                       <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                 </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
         
         {/* Equipment Status */}
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="font-black text-slate-800 flex items-center gap-2">
                     <PenTool className="w-4 h-4 text-indigo-500" /> Equipment Status
                  </h3>
               </div>
            </div>
            <div className="p-5 space-y-4">
               {[
                  { name: "Main Oven (Gas)", status: "Operational", temp: "180°C", icon: Thermometer, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { name: "Cold Room A", status: "Operational", temp: "4°C", icon: Thermometer, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { name: "Dishwasher 2", status: "Maintenance Req.", icon: AlertCircle, color: "text-rose-500", bg: "bg-rose-50" },
               ].map((eq, i) => {
                  const Icon = eq.icon;
                  return (
                     <div key={i} className="flex justify-between items-center p-3 border border-slate-100 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-3">
                           <div className={`w-10 h-10 rounded-lg ${eq.bg} ${eq.color} flex items-center justify-center`}>
                              <Icon className="w-5 h-5" />
                           </div>
                           <div>
                              <div className="font-bold text-slate-800 text-sm">{eq.name}</div>
                              <div className={`text-xs font-bold ${eq.color}`}>{eq.status}</div>
                           </div>
                        </div>
                        {eq.temp && (
                           <div className="text-sm font-black text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
                              {eq.temp}
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>
         </div>

         {/* Staff Shifts */}
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <div>
                  <h3 className="font-black text-slate-800 flex items-center gap-2">
                     <ChefHat className="w-4 h-4 text-indigo-500" /> Today's Kitchen Staff
                  </h3>
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                  <thead>
                     <tr className="bg-slate-50 border-b border-slate-100">
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Staff Name</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Shift</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {[
                        { name: "John Njoroge", role: "Head Chef", shift: "04:00 AM - 01:00 PM" },
                        { name: "Mary Wambui", role: "Cook", shift: "04:00 AM - 01:00 PM" },
                        { name: "Peter Ochieng", role: "Prep Assistant", shift: "08:00 AM - 05:00 PM" },
                        { name: "Sarah Mutua", role: "Cleaner", shift: "08:00 AM - 05:00 PM" },
                     ].map((staff, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                           <td className="p-4 font-bold text-slate-800 text-sm">{staff.name}</td>
                           <td className="p-4 text-sm font-medium text-slate-600">
                              <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold">{staff.role}</span>
                           </td>
                           <td className="p-4 text-sm font-medium text-slate-500 text-right">{staff.shift}</td>
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
