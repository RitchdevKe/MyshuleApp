"use client";

import React, { useState, useEffect } from "react";
import { Table, Calendar, Clock, Plus, ArrowRight, Layout, CheckCircle2, AlertTriangle, PlayCircle, X } from "lucide-react";
import { getSchedulingOverview } from "@/app/actions/scheduling";
import Link from "next/link";

interface SchedulingData {
  totalTimetables: number;
  activeEvents: number;
  upcomingClasses: number;
  recentTimetables: Array<{ id: string; name: string; status: string; createdAt: string }>;
  upcomingEventsList: Array<{ id: string; title: string; date: string; type: string }>;
}

export default function SchedulingOverviewPage() {
  const [data, setData] = useState<SchedulingData | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"timetable" | "event" | null>(null);

  useEffect(() => {
    async function loadData() {
      const overviewData = await getSchedulingOverview();
      setData(overviewData);
    }
    loadData();
  }, []);

  const openModal = (type: "timetable" | "event") => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalType(null);
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-lg flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Table className="w-24 h-24 text-primary-900" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 shadow-sm border border-primary-200">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800">Total Timetables</h3>
              <p className="text-xs font-bold text-slate-500">Active & Drafts</p>
            </div>
          </div>
          <div className="mt-auto relative z-10">
            <div className="text-4xl font-black text-primary-950 mb-1">{data.totalTimetables}</div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5" /> Up to date
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-lg flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="w-24 h-24 text-secondary-500" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center text-secondary-600 shadow-sm border border-secondary-100">
              <PlayCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800">Active Events</h3>
              <p className="text-xs font-bold text-slate-500">School Calendar</p>
            </div>
          </div>
          <div className="mt-auto relative z-10 w-full">
            <div className="text-4xl font-black text-secondary-600 mb-1">{data.activeEvents}</div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 w-fit px-2 py-0.5 rounded-lg border border-amber-100">
              <AlertTriangle className="w-3.5 h-3.5" /> Action needed
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-lg flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Clock className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800">Upcoming Classes</h3>
              <p className="text-xs font-bold text-slate-500">Next 7 Days</p>
            </div>
          </div>
          <div className="mt-auto relative z-10">
            <div className="text-4xl font-black text-emerald-700 mb-1">{data.upcomingClasses}</div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-lg border border-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5" /> Scheduled
            </div>
          </div>
        </div>
      </div>

      {/* Main Content & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (Lists) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Table className="w-5 h-5 text-primary-900" /> Recent Timetables
              </h3>
              <Link href="/dashboard/academics/scheduling/timetables" className="text-xs font-bold text-secondary-600 hover:text-secondary-700 flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {data.recentTimetables.length === 0 ? (
                <p className="text-sm text-slate-500">No timetables found.</p>
              ) : (
                data.recentTimetables.map((tt) => (
                  <div key={tt.id} className="flex items-center justify-between p-4 bg-white/80 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 border border-primary-100 flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Table className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{tt.name}</p>
                        <p className="text-xs font-bold text-slate-500 mt-0.5">Created {new Date(tt.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md border mb-1 ${
                        tt.status === "Active" 
                          ? "bg-emerald-50 text-emerald-600 border-emerald-100" 
                          : "bg-slate-50 text-slate-500 border-slate-200"
                      }`}>
                        {tt.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-secondary-500" /> Upcoming Events
              </h3>
              <Link href="/dashboard/academics/scheduling/calendar" className="text-xs font-bold text-secondary-600 hover:text-secondary-700 flex items-center gap-1">
                View calendar <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            
            <div className="space-y-3">
              {data.upcomingEventsList.length === 0 ? (
                <p className="text-sm text-slate-500">No upcoming events found.</p>
              ) : (
                data.upcomingEventsList.map((evt) => (
                  <div key={evt.id} className="flex items-center justify-between p-4 bg-white/80 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 border border-amber-100 flex-shrink-0 group-hover:scale-110 transition-transform">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-800">{evt.title}</p>
                        <p className="text-xs font-bold text-slate-500 mt-0.5">{evt.type}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-bold text-slate-600 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md border border-slate-100 mb-1">
                        {new Date(evt.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column (Quick Actions) */}
        <div className="space-y-6">
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg p-6">
            <h3 className="text-lg font-black text-slate-800 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={() => openModal("timetable")}
                className="w-full flex items-center justify-between p-4 bg-primary-900 text-white rounded-2xl shadow-md hover:bg-primary-800 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-xl">
                    <Table className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm">Create Timetable</span>
                </div>
                <Plus className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>

              <button 
                onClick={() => openModal("event")}
                className="w-full flex items-center justify-between p-4 bg-secondary-500 text-white rounded-2xl shadow-md hover:bg-secondary-600 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-white/10 p-2 rounded-xl">
                    <Calendar className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-sm">Add School Event</span>
                </div>
                <Plus className="w-4 h-4 opacity-50 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          <div className="bg-primary-50/50 border border-primary-100 rounded-3xl p-6">
             <h4 className="font-black text-primary-900 mb-2">Scheduling Tips</h4>
             <p className="text-xs font-bold text-primary-800/70 leading-relaxed mb-4">
               Always review your daily periods and bells before generating a new timetable to avoid conflicts.
             </p>
             <Link href="/dashboard/academics/scheduling/periods" className="text-xs font-black text-primary-700 hover:text-primary-900 flex items-center gap-1">
               Manage Periods <ArrowRight className="w-3 h-3" />
             </Link>
          </div>
        </div>
      </div>

      {/* Modal for Quick Actions */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800">
                {modalType === "timetable" ? "Create Timetable" : "Add School Event"}
              </h2>
              <button 
                onClick={closeModal}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500">
                This is a simulated modal for the {modalType} creation flow. Since backend models are not fully implemented, this serves as a structural placeholder.
              </p>
              
              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {modalType === "timetable" ? "Timetable Name" : "Event Title"}
                  </label>
                  <input 
                    type="text" 
                    placeholder="Enter name..." 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                
                {modalType === "event" && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Event Date</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={closeModal}
                className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-200 bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={closeModal}
                className="px-4 py-2 text-sm font-black text-white bg-primary-900 hover:bg-primary-800 rounded-xl transition-colors shadow-md shadow-primary-900/20"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}