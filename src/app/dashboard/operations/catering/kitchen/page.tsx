import React from "react";
import { ChefHat, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { getKitchenTasks, getKitchenStats } from "./actions";
import KitchenClient from "./KitchenClient";

export default async function KitchenPage() {
  const [tasks, stats] = await Promise.all([getKitchenTasks(), getKitchenStats()]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><ChefHat className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Tasks</p><h3 className="text-2xl font-black text-slate-800">{stats.totalTasks}</h3></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl"><Clock className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Pending</p><h3 className="text-2xl font-black text-slate-800">{stats.pending}</h3></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><AlertCircle className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">In Progress</p><h3 className="text-2xl font-black text-slate-800">{stats.inProgress}</h3></div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><CheckCircle2 className="w-6 h-6" /></div>
          <div><p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Completed</p><h3 className="text-2xl font-black text-slate-800">{stats.completed}</h3></div>
        </div>
      </div>
      <KitchenClient initialTasks={tasks} />
    </div>
  );
}
