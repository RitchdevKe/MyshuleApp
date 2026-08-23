"use client";
import React from "react";
import { CheckCircle2, FileWarning, Trophy, Users, BarChart3, AlertCircle, HeartHandshake } from "lucide-react";
import Link from "next/link";

export default function StudentLifeDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-6 md:p-8 rounded-3xl border border-white/60 backdrop-blur-md shadow-sm">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            Student Life
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-2 max-w-2xl">
            The operating system for the student's experience outside core academics. Monitor engagement, welfare, leadership, and behavior.
          </p>
        </div>
        <div className="flex gap-2">
          <select className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
            <option>This Term</option>
            <option>Last Term</option>
            <option>This Year</option>
          </select>
          <select className="bg-white border border-slate-200 text-slate-700 text-sm font-bold rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm">
            <option>All Sections</option>
            <option>Preschool</option>
            <option>Primary</option>
            <option>Secondary</option>
          </select>
        </div>
      </div>

      {/* KPI Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/student-life/attendance" className="bg-white/80 border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-center items-center text-center">
          <div className="text-5xl font-black text-indigo-600 group-hover:scale-105 transition-transform">94.8%</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Attendance</div>
        </Link>
        
        <Link href="/dashboard/student-life/discipline-welfare" className="bg-white/80 border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-center items-center text-center">
          <div className="text-5xl font-black text-rose-600 group-hover:scale-105 transition-transform">28</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Open Cases</div>
        </Link>
        
        <Link href="/dashboard/student-life/activities" className="bg-white/80 border border-slate-200/80 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all group flex flex-col justify-center items-center text-center">
          <div className="text-5xl font-black text-emerald-600 group-hover:scale-105 transition-transform">642</div>
          <div className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-2">Activities</div>
        </Link>
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/dashboard/student-life/activities" className="bg-white/60 border border-slate-200/60 p-6 rounded-3xl shadow-sm hover:bg-white transition-all flex items-center justify-between">
          <div>
            <div className="text-4xl font-black text-slate-700">1,284</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Club Members</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <Users className="w-6 h-6" />
          </div>
        </Link>
        
        <Link href="/dashboard/student-life/engagement" className="bg-white/60 border border-slate-200/60 p-6 rounded-3xl shadow-sm hover:bg-white transition-all flex items-center justify-between">
          <div>
            <div className="text-4xl font-black text-amber-600">86</div>
            <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Achievements</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-500">
            <Trophy className="w-6 h-6" />
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Students Requiring Attention */}
        <div className="lg:col-span-1 bg-rose-50/50 border border-rose-100 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-rose-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" /> Action Required
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white border border-rose-100 rounded-xl shadow-sm">
              <span className="text-sm font-bold text-slate-700">Attendance concern</span>
              <span className="text-xs font-black bg-rose-100 text-rose-700 px-2 py-1 rounded-md">12</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-rose-100 rounded-xl shadow-sm">
              <span className="text-sm font-bold text-slate-700">Open welfare cases</span>
              <span className="text-xs font-black bg-amber-100 text-amber-700 px-2 py-1 rounded-md">7</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-rose-100 rounded-xl shadow-sm">
              <span className="text-sm font-bold text-slate-700">Repeated lateness</span>
              <span className="text-xs font-black bg-slate-100 text-slate-700 px-2 py-1 rounded-md">9</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white border border-rose-100 rounded-xl shadow-sm">
              <span className="text-sm font-bold text-slate-700">Pending interventions</span>
              <span className="text-xs font-black bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md">5</span>
            </div>
          </div>
        </div>

        {/* Upcoming Activities */}
        <div className="lg:col-span-2 bg-white border border-slate-200/80 rounded-3xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Upcoming Activities
          </h3>
          
          <div className="space-y-6">
            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Today</div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                  <div className="w-1.5 h-10 bg-emerald-500 rounded-full"></div>
                  <div>
                    <div className="font-bold text-slate-800">Football Training</div>
                    <div className="text-xs text-slate-500 mt-0.5">School Football U16 • 4:00 PM</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                  <div className="w-1.5 h-10 bg-indigo-500 rounded-full"></div>
                  <div>
                    <div className="font-bold text-slate-800">Debate Club</div>
                    <div className="text-xs text-slate-500 mt-0.5">Room 4B • 4:30 PM</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-3">Tomorrow</div>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                  <div className="w-1.5 h-10 bg-amber-500 rounded-full"></div>
                  <div>
                    <div className="font-bold text-slate-800">Science Club</div>
                    <div className="text-xs text-slate-500 mt-0.5">Lab 2 • 3:30 PM</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                  <div className="w-1.5 h-10 bg-emerald-500 rounded-full"></div>
                  <div>
                    <div className="font-bold text-slate-800">Basketball Match</div>
                    <div className="text-xs text-slate-500 mt-0.5">vs Green Valley • 10:00 AM</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
