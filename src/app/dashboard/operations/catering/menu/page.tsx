import React from "react";
import { Utensils, CalendarDays, Activity } from "lucide-react";
import { getMenuItems, getMenuStats } from "./actions";
import MenuClient from "./MenuClient";

export default async function MenuPage() {
  const [items, stats] = await Promise.all([getMenuItems(), getMenuStats()]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-orange-50 text-orange-600 rounded-xl"><Utensils className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Menu Items</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.totalItems}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl"><Activity className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Active Meals</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.activeMeals}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><CalendarDays className="w-6 h-6" /></div>
          <div>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Days Planned</p>
            <h3 className="text-2xl font-black text-slate-800">{stats.daysPlanned}/7</h3>
          </div>
        </div>
      </div>
      <MenuClient initialItems={items} />
    </div>
  );
}
