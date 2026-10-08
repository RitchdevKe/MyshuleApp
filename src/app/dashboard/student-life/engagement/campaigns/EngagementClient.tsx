"use client";

import React, { useState, useTransition } from "react";
import { Users, Calendar, Megaphone, ClipboardList, Plus, Search, MapPin, Target, BarChart2, TrendingUp, Activity, CheckCircle2, X } from "lucide-react";
import { EngagementCampaign, EngagementEvent, EngagementSurvey } from "@prisma/client";
import { createCampaign, deleteCampaign, updateCampaign, createEvent, deleteEvent, updateEvent, createSurvey, deleteSurvey, updateSurvey } from "./actions";

interface EngagementClientProps {
  initialCampaigns: EngagementCampaign[];
  initialEvents: EngagementEvent[];
  initialSurveys: EngagementSurvey[];
  tenantId: string;
}

export default function EngagementClient({ initialCampaigns, initialEvents, initialSurveys, tenantId }: EngagementClientProps) {
  const [activeTab, setActiveTab] = useState("campaigns");
  const [isPending, startTransition] = useTransition();

  // Optimistic State
  const [campaigns, setCampaigns] = useState<EngagementCampaign[]>(initialCampaigns);
  const [events, setEvents] = useState<EngagementEvent[]>(initialEvents);
  const [surveys, setSurveys] = useState<EngagementSurvey[]>(initialSurveys);

  // Forms states
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", targetOrAudience: "", location: "" });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (activeTab === "campaigns") {
      startTransition(async () => {
        const newCampaign = await createCampaign({
          tenantId,
          name: formData.name,
          target: formData.targetOrAudience || "All Parents",
          status: "Active",
          conversion: "0%",
        });
        setCampaigns((prev) => [newCampaign, ...prev]);
        setShowForm(false);
        setFormData({ name: "", targetOrAudience: "", location: "" });
      });
    } else if (activeTab === "events") {
      startTransition(async () => {
        const newEvent = await createEvent({
          tenantId,
          name: formData.name,
          date: new Date(),
          location: formData.location || "Main Hall",
          rsvps: "0/0",
        });
        setEvents((prev) => [newEvent, ...prev]);
        setShowForm(false);
        setFormData({ name: "", targetOrAudience: "", location: "" });
      });
    } else if (activeTab === "surveys") {
      startTransition(async () => {
        const newSurvey = await createSurvey({
          tenantId,
          name: formData.name,
          audience: formData.targetOrAudience || "Students",
          responses: 0,
          status: "Active",
        });
        setSurveys((prev) => [newSurvey, ...prev]);
        setShowForm(false);
        setFormData({ name: "", targetOrAudience: "", location: "" });
      });
    }
  };

  const handleDelete = (id: string, type: "campaign" | "event" | "survey") => {
    if (!confirm("Are you sure?")) return;
    startTransition(async () => {
      if (type === "campaign") {
        await deleteCampaign(id);
        setCampaigns((prev) => prev.filter((c) => c.id !== id));
      } else if (type === "event") {
        await deleteEvent(id);
        setEvents((prev) => prev.filter((e) => e.id !== id));
      } else if (type === "survey") {
        await deleteSurvey(id);
        setSurveys((prev) => prev.filter((s) => s.id !== id));
      }
    });
  };

  const handleUpdateStatus = (id: string, type: "campaign" | "survey", currentStatus: string) => {
    const newStatus = currentStatus === "Active" ? (type === "campaign" ? "Scheduled" : "Closed") : "Active";
    startTransition(async () => {
      if (type === "campaign") {
        await updateCampaign(id, { status: newStatus });
        setCampaigns((prev) => prev.map((c) => c.id === id ? { ...c, status: newStatus } : c));
      } else if (type === "survey") {
        await updateSurvey(id, { status: newStatus });
        setSurveys((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s));
      }
    });
  };

  const activeCampaignsCount = campaigns.filter(c => c.status === "Active").length;
  const upcomingEventsCount = events.length;
  
  // Calculate average engagement from campaign conversions (if available)
  const avgEngagement = campaigns.length > 0 
    ? Math.round(campaigns.reduce((acc, c) => acc + parseInt(c.conversion || "0", 10), 0) / campaigns.length)
    : 0;

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
               <h3 className="text-2xl font-black text-slate-800">{avgEngagement}%</h3>
               <p className="text-xs font-bold text-emerald-600 mt-1">+4% this month</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
               <Activity className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Active Campaigns</p>
               <h3 className="text-2xl font-black text-slate-800">{activeCampaignsCount}</h3>
               <p className="text-xs font-bold text-slate-500 mt-1">Currently running</p>
            </div>
         </div>
         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
               <Calendar className="w-6 h-6" />
            </div>
            <div>
               <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Upcoming Events</p>
               <h3 className="text-2xl font-black text-slate-800">{upcomingEventsCount}</h3>
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
           <button 
              onClick={() => setShowForm(true)}
              disabled={isPending}
              className="flex items-center gap-2 px-4 py-2 bg-primary-900 hover:bg-primary-800 text-white rounded-xl font-bold text-sm transition-all shadow-sm shadow-primary-900/20 disabled:opacity-50">
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
                     <td className="py-4 px-6 font-bold text-primary-600">{item.conversion || "0%"} Conv.</td>
                     <td className="py-4 px-6 cursor-pointer" onClick={() => handleUpdateStatus(item.id, "campaign", item.status)}>
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{item.status}</span>
                     </td>
                     <td className="py-4 px-6 text-right flex justify-end gap-2">
                        <button onClick={() => handleDelete(item.id, "campaign")} className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all font-bold text-xs">Delete</button>
                        <button className="text-white bg-primary-900 hover:bg-primary-800 px-4 py-2 rounded-xl transition-all shadow-sm font-bold text-sm">Manage</button>
                     </td>
                   </tr>
                 ))}

                 {/* Events View */}
                 {activeTab === 'events' && events.map((item) => (
                   <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                     <td className="py-4 px-6 font-bold text-slate-800">{item.name}</td>
                     <td className="py-4 px-6">
                        <div className="flex flex-col gap-1">
                           <span className="text-sm font-bold text-slate-700">{new Date(item.date).toLocaleDateString()}</span>
                           <span className="flex items-center gap-1 text-xs text-slate-500"><MapPin className="w-3 h-3" /> {item.location}</span>
                        </div>
                     </td>
                     <td className="py-4 px-6 font-bold text-indigo-600">{item.rsvps} RSVPs</td>
                     <td className="py-4 px-6">
                        <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg bg-blue-100 text-blue-700">Upcoming</span>
                     </td>
                     <td className="py-4 px-6 text-right flex justify-end gap-2">
                        <button onClick={() => handleDelete(item.id, "event")} className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all font-bold text-xs">Delete</button>
                        <button className="text-white bg-primary-900 hover:bg-primary-800 px-4 py-2 rounded-xl transition-all shadow-sm font-bold text-sm">Manage</button>
                     </td>
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
                     <td className="py-4 px-6 cursor-pointer" onClick={() => handleUpdateStatus(item.id, "survey", item.status)}>
                        <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-lg ${item.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'}`}>{item.status}</span>
                     </td>
                     <td className="py-4 px-6 text-right flex justify-end gap-2">
                        <button onClick={() => handleDelete(item.id, "survey")} className="text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg transition-all font-bold text-xs">Delete</button>
                        <button className="text-white bg-primary-900 hover:bg-primary-800 px-4 py-2 rounded-xl transition-all shadow-sm font-bold text-sm flex items-center gap-1 ml-auto"><BarChart2 className="w-4 h-4" /> Results</button>
                     </td>
                   </tr>
                 ))}
                 
                 {activeTab === 'campaigns' && campaigns.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">No campaigns found.</td>
                   </tr>
                 )}
                 {activeTab === 'events' && events.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">No events found.</td>
                   </tr>
                 )}
                 {activeTab === 'surveys' && surveys.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-slate-500 font-medium">No surveys found.</td>
                   </tr>
                 )}
               </tbody>
             </table>
           </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="font-bold text-slate-800">
                {activeTab === 'campaigns' && 'Create Campaign'}
                {activeTab === 'events' && 'Create Event'}
                {activeTab === 'surveys' && 'Create Survey'}
              </h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1">Name</label>
                <input 
                  required 
                  type="text" 
                  value={formData.name}
                  onChange={e => setFormData(f => ({ ...f, name: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500" 
                />
              </div>
              
              {activeTab !== 'events' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Target Audience</label>
                  <input 
                    type="text" 
                    value={formData.targetOrAudience}
                    onChange={e => setFormData(f => ({ ...f, targetOrAudience: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500" 
                  />
                </div>
              )}

              {activeTab === 'events' && (
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1">Location</label>
                  <input 
                    type="text" 
                    value={formData.location}
                    onChange={e => setFormData(f => ({ ...f, location: e.target.value }))}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary-500" 
                  />
                </div>
              )}
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 font-bold text-slate-600 text-sm">Cancel</button>
                <button type="submit" disabled={isPending} className="px-6 py-2 bg-primary-900 text-white font-bold rounded-xl text-sm disabled:opacity-50">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
