"use client";

import React, { useState } from "react";
import { Users, Calendar, Megaphone, ClipboardList, Plus, Search, MapPin, Target, BarChart2, TrendingUp, Activity, CheckCircle2 } from "lucide-react";

export default function EngagementPage() {
  const [activeTab, setActiveTab] = useState("campaigns");

  const campaigns = [
    { id: 1, name: "Back to School Registration", target: "All Parents", status: "Active", conversion: "68%" },
    { id: 2, name: "Alumni Donation Drive", target: "Alumni", status: "Scheduled", conversion: "-" },
  ];

  const events = [
    { id: 1, name: "Science Fair 2024", date: "Oct 15, 2024", location: "Main Hall", rsvps: "124/200" },
    { id: 2, name: "PTA Monthly Meeting", date: "Sep 05, 2024", location: "Room 101", rsvps: "45/50" },
  ];

  const surveys = [
    { id: 1, name: "Cafeteria Menu Feedback", audience: "Students", responses: 342, status: "Active" },
    { id: 2, name: "Parent Satisfaction 2024", audience: "Parents", responses: 890, status: "Closed" },
  ];

  return (
    <div className="space-y-6">
      {/* Quick Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
               <TrendingUp className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Avg. Engagement</p>
               <h3 className="text-2xl font-black text-slate-800">76%</h3>
               <p className="text-xs font-bold text-emerald-600 mt-1">+4% this month</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
               <Activity className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Active Campaigns</p>
               <h3 className="text-2xl font-black text-slate-800">4</h3>
               <p className="text-xs font-bold text-slate-500 mt-1">Currently running</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
               <Calendar className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Upcoming Events</p>
               <h3 className="text-2xl font-black text-slate-800">12</h3>
               <p className="text-xs font-bold text-slate-500 mt-1">Next 30 days</p>
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-sm w-fit">
        <button 
           onClick={() => setActiveTab('campaigns')}
           className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'campaigns' ? 'bg-secondary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
           <Megaphone className="w-4 h-4" /> Campaigns
        </button>
        <button 
           onClick={() => setActiveTab('events')}
           className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'events' ? 'bg-secondary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
           <Calendar className="w-4 h-4" /> Events & RSVPs
        </button>
        <button 
           onClick={() => setActiveTab('surveys')}
           className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === 'surveys' ? 'bg-secondary-500 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
        >
           <ClipboardList className="w-4 h-4" /> Surveys & Feedback
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden min-h-[400px]">
        {/* Header Actions */}
        <div className="p-5 border-b border-slate-200/60 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
           <div className="flex items-center gap-2 w-full md:w-auto relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder={`Search ${activeTab}...`} className="w-full md:w-80 pl-9 pr-4 py-2 bg-white border border-slate-200/60 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-900" />
           </div>
           <button className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20">
              <Plus className="w-4 h-4" />
              Create New
           </button>
        </div>

        {/* Dynamic Content */}
        <div className="p-0">
           <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
               <thead>
                 <tr className="bg-slate-50/50">
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Name</th>
                   {activeTab === 'campaigns' && <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Target Audience</th>}
                   {activeTab === 'events' && <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Date & Location</th>}
                   {activeTab === 'surveys' && <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Audience</th>}
                   
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Metrics</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                   <th className="py-4 px-6 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {/* Campaigns View */}
                 {activeTab === 'campaigns' && campaigns.map((item) => (
                   <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="py-4 px-6 font-bold text-slate-800">{item.name}</td>
                     <td className="py-4 px-6">
                        <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                           <Target className="w-4 h-4 text-slate-400" /> {item.target}
                        </span>
                     </td>
                     <td className="py-4 px-6 font-bold text-primary-600">{item.conversion} Conv.</td>
                     <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span>
                     </td>
                     <td className="py-4 px-6 text-right"><button className="text-white bg-primary-900 hover:bg-primary-800 px-4 py-2 rounded-xl transition-all shadow-sm font-bold text-sm">Manage</button></td>
                   </tr>
                 ))}

                 {/* Events View */}
                 {activeTab === 'events' && events.map((item) => (
                   <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="py-4 px-6 font-bold text-slate-800">{item.name}</td>
                     <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                           <span className="text-sm font-bold text-slate-700">{item.date}</span>
                           <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3 h-3" /> {item.location}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6 font-bold text-indigo-600">{item.rsvps} RSVPs</td>
                     <td className="py-4 px-6">
                        <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-blue-100 text-blue-700">Upcoming</span>
                     </td>
                     <td className="py-4 px-6 text-right"><button className="text-white bg-primary-900 hover:bg-primary-800 px-4 py-2 rounded-xl transition-all shadow-sm font-bold text-sm">Manage</button></td>
                   </tr>
                 ))}

                 {/* Surveys View */}
                 {activeTab === 'surveys' && surveys.map((item) => (
                   <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="py-4 px-6 font-bold text-slate-800">{item.name}</td>
                     <td className="py-4 px-6">
                        <span className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                           <Users className="w-4 h-4 text-slate-400" /> {item.audience}
                        </span>
                     </td>
                     <td className="py-4 px-6 font-bold text-emerald-600">{item.responses} Responses</td>
                     <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{item.status}</span>
                     </td>
                     <td className="py-4 px-6 text-right"><button className="text-white bg-primary-900 hover:bg-primary-800 px-4 py-2 rounded-xl transition-all shadow-sm font-bold text-sm flex items-center gap-1 ml-auto"><BarChart2 className="w-4 h-4" /> Results</button></td>
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