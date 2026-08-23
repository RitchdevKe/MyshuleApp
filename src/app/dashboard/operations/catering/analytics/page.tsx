"use client";

import React from "react";
import { PieChart, TrendingUp, DollarSign, Activity, Calendar, Download } from "lucide-react";

export default function AnalyticsPage() {
  const stats = [
    { label: "Total Meals Served", value: "14,592", trend: "+12%", icon: TrendingUp },
    { label: "Average Cost/Meal", value: "$1.24", trend: "-3%", icon: DollarSign },
    { label: "Food Waste", value: "4.2%", trend: "-1.5%", icon: Activity },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Catering Analytics</h2>
          <p className="text-sm font-medium text-slate-500 mt-1">Cost analysis, consumption trends, and waste tracking.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" /> This Term
          </button>
          <button className="px-5 py-2.5 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors shadow-sm flex items-center gap-2 justify-center">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-500 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${stat.trend.startsWith('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {stat.trend} vs Last Term
                </span>
              </div>
              <p className="text-slate-500 font-semibold text-sm">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800 mt-1">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Popular Meals */}
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-indigo-500" /> Most Popular Meals
               </h3>
            </div>
            <div className="p-6">
               <div className="space-y-5">
                  {[
                     { name: "Rice & Beef Stew", percent: 92, color: "bg-emerald-500" },
                     { name: "Pilau & Kachumbari", percent: 88, color: "bg-emerald-400" },
                     { name: "Ugali & Sukuma Wiki", percent: 75, color: "bg-amber-400" },
                     { name: "Githeri", percent: 45, color: "bg-rose-400" },
                  ].map((meal, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-sm font-bold text-slate-700 mb-2">
                           <span>{meal.name}</span>
                           <span>{meal.percent}% approval</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                           <div className={`${meal.color} h-2 rounded-full`} style={{ width: `${meal.percent}%` }}></div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Waste Analysis */}
         <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-sm overflow-hidden flex flex-col">
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-500" /> Waste by Category
               </h3>
            </div>
            <div className="p-6 flex items-center justify-center h-full">
               {/* Simulated Donut Chart */}
               <div className="relative w-48 h-48 rounded-full border-[16px] border-slate-50 flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-[16px] border-emerald-500 border-r-transparent border-b-transparent transform -rotate-45"></div>
                  <div className="absolute inset-0 rounded-full border-[16px] border-amber-400 border-l-transparent border-b-transparent transform -rotate-45"></div>
                  <div className="absolute inset-0 rounded-full border-[16px] border-rose-400 border-l-transparent border-t-transparent border-r-transparent transform -rotate-45"></div>
                  
                  <div className="text-center">
                     <p className="text-3xl font-black text-slate-800">4.2%</p>
                     <p className="text-xs font-bold text-slate-500">Total Waste</p>
                  </div>
               </div>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-around bg-slate-50/50">
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span className="text-xs font-bold text-slate-600">Carbs (45%)</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <span className="text-xs font-bold text-slate-600">Veggies (35%)</span>
               </div>
               <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <span className="text-xs font-bold text-slate-600">Proteins (20%)</span>
               </div>
            </div>
         </div>
      </div>

    </div>
  );
}
