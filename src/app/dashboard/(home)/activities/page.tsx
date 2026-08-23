
"use client";

import React from 'react';
import { 
  CheckCircle2, Wallet, GraduationCap, Users, BookOpen, Truck, 
  Bell, Gift, FileWarning, Search
} from 'lucide-react';

const timeline = [
  { time: "11:00 AM", title: "Purchase Order approved", type: "Admin", icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-100" },
  { time: "10:30 AM", title: "Library book borrowed (To Kill a Mockingbird)", type: "Library", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-100" },
  { time: "10:05 AM", title: "3 new students admitted to Grade 1", type: "Admission", icon: GraduationCap, color: "text-purple-500", bg: "bg-purple-100" },
  { time: "09:45 AM", title: "Mr. Mwangi submitted Grade 8 Math marks", type: "Academic", icon: Users, color: "text-indigo-500", bg: "bg-indigo-100" },
  { time: "09:30 AM", title: "Mary Wanjiku paid KSh 25,000 (Term 2 Fees)", type: "Finance", icon: Wallet, color: "text-amber-500", bg: "bg-amber-100" },
  { time: "08:15 AM", title: "Bus #4 completed morning route", type: "Transport", icon: Truck, color: "text-teal-500", bg: "bg-teal-100" },
];

export default function ActivitiesPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-md border-t-4 border-t-primary-900">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Activity Center</h1>
          <p className="text-slate-500 text-sm">Real-time pulse of school operations.</p>
        </div>
        
        <div className="flex gap-2">
           <div className="relative">
             <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
             <input type="text" placeholder="Search activities..." className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-primary-500" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Timeline */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md border border-slate-100 p-6">
          
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
            {["All", "Academic", "Finance", "HR", "Transport", "Library", "Admin"].map((filter, i) => (
              <button key={filter} className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${i === 0 ? 'bg-primary-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {filter}
              </button>
            ))}
          </div>

          <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4">
            {timeline.map((item, index) => (
              <div key={index} className="relative pl-8">
                {/* Timeline Dot */}
                <div className={`absolute -left-4 top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center ${item.bg} ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                
                {/* Content */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-800 group-hover:text-primary-900 transition-colors">{item.title}</h4>
                    <span className="text-xs font-semibold text-slate-400">{item.time}</span>
                  </div>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-2 ${item.bg} ${item.color}`}>
                    {item.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-6 py-3 border-2 border-dashed border-slate-200 rounded-lg text-slate-500 font-bold text-sm hover:bg-slate-50 hover:border-slate-300 transition-colors">
            Load More Activities
          </button>
        </div>

        {/* Right Panel */}
        <div className="space-y-6">
          
          {/* Action Required */}
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <FileWarning className="w-5 h-5 text-amber-500" /> Pending Approvals
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 rounded-lg border border-amber-100">
                <p className="text-sm font-semibold text-slate-800">Transport Budget Q3</p>
                <p className="text-xs text-slate-500 mt-1">Requires Principal Signature</p>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-amber-500 text-white py-1.5 rounded text-xs font-bold hover:bg-amber-600">Approve</button>
                  <button className="flex-1 bg-white border border-slate-200 text-slate-600 py-1.5 rounded text-xs font-bold hover:bg-slate-50">View</button>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-sm font-semibold text-slate-800">Leave Request: John Doe</p>
                <p className="text-xs text-slate-500 mt-1">3 Days Medical</p>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-primary-900 text-white py-1.5 rounded text-xs font-bold hover:bg-secondary-500">Approve</button>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Birthdays */}
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Gift className="w-5 h-5 text-pink-500" /> Today's Birthdays
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Sarah Ochieng</p>
                  <p className="text-xs text-slate-500">Grade 4 Blue</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-200"></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Mr. Kevin Kamau</p>
                  <p className="text-xs text-slate-500">Science Teacher</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
