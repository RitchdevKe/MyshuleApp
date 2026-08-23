"use client";
import React, { useState } from "react";
import { Truck, Package, Settings, BookOpen, Users, Activity, ShoppingCart, Wrench, AlertTriangle, CheckCircle2, Clock, Plus, Filter, ArrowRight, ShieldCheck, Zap } from "lucide-react";

export default function OperationsDashboard() {
  const [activeTab, setActiveTab] = useState("Overview");
  
  const tabs = ["Overview", "Logistics & Fleet", "Inventory", "Facilities", "Security", "Health & Safety"];

  const kpis = [
    { label: "Fleet Status", value: "12", sub: "10 Active • 2 Maintenance", icon: Truck, color: "blue", trend: "+2%" },
    { label: "Inventory Value", value: "KSh 6.2M", sub: "4,820 Items • 11 Reorder", icon: Package, color: "emerald", trend: "-1.5%" },
    { label: "Work Orders", value: "18", sub: "5 High Priority", icon: Wrench, color: "rose", trend: "+4" },
    { label: "Library Circulation", value: "1,245", sub: "12 Overdue", icon: BookOpen, color: "indigo", trend: "Steady" },
    { label: "Boarding Occupancy", value: "98%", sub: "642 Residents • 8 Vacant", icon: Users, color: "purple", trend: "Full" },
    { label: "Power Usage", value: "480 kWh", sub: "Main Grid Active", icon: Zap, color: "amber", trend: "-5%" },
  ];

  const alerts = [
    { id: 1, type: "warning", message: "11 items below reorder level in Main Store.", area: "Inventory", time: "10 mins ago" },
    { id: 2, type: "danger", message: "Bus KXX 123A insurance expires in 12 days.", area: "Fleet", time: "1 hour ago" },
    { id: 3, type: "warning", message: "Main Campus Generator maintenance due next week.", area: "Facilities", time: "2 hours ago" },
    { id: 4, type: "danger", message: "7 library books are overdue by more than 30 days.", area: "Library", time: "Yesterday" },
    { id: 5, type: "warning", message: "3 hostel rooms require immediate inspection (Plumbing).", area: "Boarding", time: "Yesterday" },
  ];

  const timeline = [
    { time: "06:30", event: "Morning Fleet Departure", status: "completed", desc: "All 12 routes dispatched successfully." },
    { time: "07:30", event: "Boarding Roll Call & Breakfast", status: "completed", desc: "No absentees reported." },
    { time: "08:00", event: "Facility Morning Inspection", status: "completed", desc: "Main Campus & West Wing clear." },
    { time: "10:00", event: "Supplier Delivery (Stationery)", status: "pending", desc: "Expected arrival at Main Gate." },
    { time: "14:00", event: "Library Stocktake (Science Section)", status: "pending", desc: "Scheduled for 2 hours." },
    { time: "16:30", event: "Afternoon Fleet Departure", status: "pending", desc: "Preparing for dispatch." },
  ];

  const tasks = [
    { label: "Approve Procurement Requisitions", count: 12, urgent: true },
    { label: "Review Pending Work Orders", count: 18, urgent: true },
    { label: "Authorize Stock Requests", count: 7, urgent: false },
    { label: "Conduct Safety Inspections", count: 4, urgent: false },
  ];
  
  const quickActions = [
    { label: "New Work Order", icon: Plus },
    { label: "Log Delivery", icon: Package },
    { label: "Dispatch Vehicle", icon: Truck },
    { label: "Report Incident", icon: AlertTriangle },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col xl:flex-row xl:items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Operations Command</h1>
          <p className="text-base text-slate-500 font-medium mt-2 max-w-2xl">
            Real-time control center for physical resources, campus services, logistics, and facility maintenance.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {quickActions.map((action, idx) => {
            const ActionIcon = action.icon;
            return (
              <button 
                key={idx}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm hover:shadow-md bg-primary-900 text-white hover:bg-secondary-500 active:bg-secondary-500"
              >
                <ActionIcon className="w-4 h-4" />
                {action.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`whitespace-nowrap px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-sm ${
              activeTab === tab 
                ? "bg-secondary-500 text-white shadow-md transform -translate-y-0.5" 
                : "bg-primary-900 text-white hover:bg-secondary-500 hover:-translate-y-0.5"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5">
        {kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <div key={index} className="bg-white/80 backdrop-blur-xl p-6 rounded-3xl border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group cursor-default">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${kpi.color}-50 text-${kpi.color}-600 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300 shadow-sm`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className={`text-[10px] font-black px-2 py-1 rounded-full bg-slate-100 text-slate-500`}>
                  {kpi.trend}
                </span>
              </div>
              <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider">{kpi.label}</h3>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-800 tracking-tight">{kpi.value}</span>
              </div>
              <div className="mt-3 text-xs font-semibold text-slate-500 bg-slate-50/50 p-2 rounded-xl border border-slate-100/50">
                {kpi.sub}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column: Alerts & Tasks */}
        <div className="xl:col-span-2 space-y-8">
          
          {/* Active Alerts */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-lg overflow-hidden relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/30 to-transparent pointer-events-none"></div>
            <div className="p-8 border-b border-slate-200/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">System Alerts</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Requires immediate attention</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <button className="px-4 py-2 bg-primary-900 text-white hover:bg-secondary-500 rounded-xl text-sm font-bold transition-colors shadow-sm">
                   Acknowledge All
                 </button>
                 <button className="p-2 bg-white text-slate-600 hover:text-indigo-600 rounded-xl border border-slate-200 shadow-sm transition-colors">
                   <Filter className="w-5 h-5" />
                 </button>
              </div>
            </div>
            
            <div className="divide-y divide-slate-100/50 relative z-10">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:bg-white/60 transition-colors">
                  <div className={`shrink-0 p-3 rounded-2xl shadow-sm ${alert.type === 'danger' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-amber-50 text-amber-600 border border-amber-100'}`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-500">{alert.area}</span>
                      <span className="text-xs font-bold text-slate-400">{alert.time}</span>
                    </div>
                    <p className="text-base font-bold text-slate-700 leading-snug">{alert.message}</p>
                  </div>
                  <button className="shrink-0 text-sm font-bold bg-primary-900 text-white hover:bg-secondary-500 px-5 py-2.5 rounded-xl transition-colors shadow-sm w-full sm:w-auto mt-4 sm:mt-0">
                    Resolve Issue
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Operational Tasks */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-lg p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none group-hover:scale-110 transition-transform duration-700 group-hover:rotate-12">
               <Settings className="w-48 h-48" />
             </div>
             
             <div className="relative z-10 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Pending Tasks</h2>
                    <p className="text-sm text-slate-500 font-medium mt-1">Actions awaiting your approval or execution</p>
                  </div>
                </div>
                <button className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                  View All <ArrowRight className="w-4 h-4" />
                </button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative z-10">
               {tasks.map((task, idx) => (
                 <div key={idx} className="flex items-center justify-between p-5 bg-white border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-md transition-all cursor-pointer group/task">
                   <div className="flex items-center gap-3">
                     <div className={`w-2 h-10 rounded-full ${task.urgent ? 'bg-rose-500' : 'bg-slate-200'}`}></div>
                     <span className="text-sm font-bold text-slate-700 group-hover/task:text-indigo-700 transition-colors">{task.label}</span>
                   </div>
                   <span className={`px-4 py-1.5 rounded-xl text-sm font-black shadow-inner ${task.urgent ? 'bg-rose-50 text-rose-700' : 'bg-slate-50 text-slate-600'}`}>{task.count}</span>
                 </div>
               ))}
             </div>
          </div>

        </div>

        {/* Right Column: Timeline & Resource Status */}
        <div className="space-y-8">
          
          {/* Today's Timeline */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-lg p-8 relative">
             <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight">Daily Schedule</h2>
                  <p className="text-sm text-slate-500 font-medium mt-1">Timeline of key operations</p>
                </div>
              </div>

              <div className="relative border-l-2 border-slate-200/60 ml-4 space-y-8 pb-4 mt-4">
                {timeline.map((item, idx) => (
                  <div key={idx} className="relative pl-8 group">
                    <div className={`absolute -left-[11px] top-1 w-5 h-5 rounded-full border-4 border-white shadow-sm ${item.status === 'completed' ? 'bg-emerald-500' : 'bg-slate-300 group-hover:bg-indigo-400 transition-colors'}`}></div>
                    <div className="flex flex-col bg-white/60 p-4 rounded-2xl border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all">
                      <div className="flex justify-between items-start mb-1">
                        <span className={`text-xs font-black tracking-wider px-2 py-1 rounded-lg ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>{item.time}</span>
                      </div>
                      <span className={`text-base font-bold mt-2 ${item.status === 'completed' ? 'text-slate-800' : 'text-slate-700'}`}>{item.event}</span>
                      <span className="text-sm font-medium text-slate-500 mt-1">{item.desc}</span>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="w-full mt-4 py-4 rounded-2xl bg-primary-900 text-white hover:bg-secondary-500 text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
                <Plus className="w-4 h-4" /> Add Event
              </button>
          </div>

          {/* Quick Security Status */}
          <div className="bg-white/80 backdrop-blur-xl border border-white/60 rounded-[2.5rem] shadow-lg p-8 relative overflow-hidden text-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent pointer-events-none"></div>
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shadow-inner mb-4">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-black text-slate-800">Campus Security</h3>
              <p className="text-sm font-medium text-slate-500 mt-2 mb-6">All access control points and surveillance cameras are operating nominally.</p>
              
              <div className="w-full grid grid-cols-2 gap-4">
                 <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                   <div className="text-2xl font-black text-emerald-600">42/42</div>
                   <div className="text-xs font-bold text-slate-500 uppercase mt-1">Cameras Live</div>
                 </div>
                 <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
                   <div className="text-2xl font-black text-indigo-600">8</div>
                   <div className="text-xs font-bold text-slate-500 uppercase mt-1">Guards on Duty</div>
                 </div>
              </div>
              
              <button className="w-full mt-6 py-3 rounded-2xl bg-primary-900 text-white hover:bg-secondary-500 text-sm font-bold transition-colors shadow-sm">
                View Security Logs
              </button>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
