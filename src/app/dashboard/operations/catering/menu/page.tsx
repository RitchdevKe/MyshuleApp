"use client";

import React from "react";
import { Utensils, Edit3, Info, Sun, Coffee, Moon, CalendarDays, Activity } from "lucide-react";

export default function MenuPage() {
  const todayMenu = [
    { 
      meal: "Breakfast", 
      icon: Coffee, 
      items: "Tea, Bread, Eggs, Fresh Fruit", 
      time: "06:30 AM", 
      count: 850, 
      calories: "450 kcal",
      allergens: "Gluten, Eggs",
      color: "text-amber-500", 
      bg: "bg-amber-50",
      border: "border-amber-200",
      accent: "bg-amber-500"
    },
    { 
      meal: "Lunch", 
      icon: Sun, 
      items: "Rice, Beef Stew, Cabbage, Banana", 
      time: "01:00 PM", 
      count: 1200, 
      calories: "780 kcal",
      allergens: "None",
      color: "text-orange-500", 
      bg: "bg-orange-50",
      border: "border-orange-200",
      accent: "bg-orange-500"
    },
    { 
      meal: "Dinner", 
      icon: Moon, 
      items: "Ugali, Beans, Spinach", 
      time: "06:30 PM", 
      count: 642, 
      calories: "620 kcal",
      allergens: "None",
      color: "text-indigo-500", 
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      accent: "bg-indigo-500"
    },
  ];

  return (
    <div className="p-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 flex items-center gap-3">
            <Utensils className="w-7 h-7 text-indigo-500" /> Today's Menu
          </h2>
          <p className="text-slate-500 font-medium text-sm mt-1">Monday, 10th August 2026</p>
        </div>
        <div className="flex gap-3">
           <button className="px-4 py-2 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm flex items-center gap-2">
             <CalendarDays className="w-4 h-4" /> Weekly View
           </button>
           <button className="px-5 py-2.5 bg-primary-900 text-white font-bold rounded-xl hover:bg-primary-800 transition-colors shadow-sm flex items-center gap-2 justify-center">
             <Edit3 className="w-4 h-4" /> Edit Menu
           </button>
        </div>
      </div>

      {/* Daily Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {todayMenu.map((meal, idx) => {
          const Icon = meal.icon;
          return (
            <div key={idx} className={`bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col h-full relative overflow-hidden group`}>
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl ${meal.bg} ${meal.color} shadow-inner`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-slate-800">{meal.meal}</h3>
                    <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">{meal.time}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex-grow flex flex-col gap-4">
                <div className={`bg-slate-50 rounded-2xl p-5 border ${meal.border}`}>
                  <p className="text-slate-800 font-bold leading-relaxed">{meal.items}</p>
                </div>

                <div className="flex gap-2">
                   <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded border border-slate-200 flex items-center gap-1">
                      <Activity className="w-3 h-3" /> {meal.calories}
                   </span>
                   {meal.allergens !== "None" && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-200">
                         {meal.allergens}
                      </span>
                   )}
                </div>
              </div>
              
              <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-6">
                <div className="flex items-center gap-2 text-slate-500">
                  <Info className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Expected Pax</span>
                </div>
                <span className="font-black text-slate-800 text-2xl">{meal.count}</span>
              </div>

              {/* Decorative Accent Line */}
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${meal.accent} opacity-80 group-hover:opacity-100 transition-opacity`}></div>
            </div>
          );
        })}
      </div>

      {/* Weekly Preview Snippet */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col">
         <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div>
               <h3 className="font-black text-slate-800 flex items-center gap-2">
                  <CalendarDays className="w-4 h-4 text-indigo-500" /> Upcoming Days
               </h3>
               <p className="text-xs text-slate-500 mt-1">Quick preview of the meal plan for the rest of the week.</p>
            </div>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Day</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Breakfast</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Lunch</th>
                     <th className="p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Dinner</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-50">
                  {[
                     { day: "Tuesday", b: "Porridge, Ndazi", l: "Githeri, Cabbage", d: "Rice, Ndengu" },
                     { day: "Wednesday", b: "Tea, Bread, Eggs", l: "Ugali, Sukuma Wiki, Beef", d: "Spaghetti, Minced Meat" },
                     { day: "Thursday", b: "Tea, Sweet Potatoes", l: "Pilau, Kachumbari", d: "Ugali, Cabbage" },
                  ].map((row, i) => (
                     <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 font-black text-slate-800 text-sm">{row.day}</td>
                        <td className="p-4 text-sm font-medium text-slate-600">{row.b}</td>
                        <td className="p-4 text-sm font-medium text-slate-600">{row.l}</td>
                        <td className="p-4 text-sm font-medium text-slate-600">{row.d}</td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}
