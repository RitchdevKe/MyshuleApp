"use client";

import React from "react";
import Link from "next/link";
import { 
  Users, UserPlus, FileText, ArrowRightLeft, 
  Sparkles, GraduationCap, Building2, TrendingUp, AlertCircle 
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from "recharts";

// Mock Data
const studentsByGrade = [
  { name: "Grade 1", value: 120 },
  { name: "Grade 2", value: 110 },
  { name: "Grade 3", value: 115 },
  { name: "Grade 4", value: 95 },
  { name: "Grade 5", value: 130 },
  { name: "Grade 6", value: 105 },
];

const studentsByBranch = [
  { name: "Main Campus", value: 650 },
  { name: "West Wing", value: 280 },
];

const BRANCH_COLORS = ["#10b981", "#3b82f6"];

const recentEnrollments = [
  { id: "ENR-001", name: "Alice Mwangangi", grade: "Grade 4", date: "Today", branch: "Main Campus", status: "Completed" },
  { id: "ENR-002", name: "David Ochieng", grade: "Grade 1", date: "Yesterday", branch: "West Wing", status: "Completed" },
  { id: "ENR-003", name: "Sarah Wanjiku", grade: "Grade 6", date: "Yesterday", branch: "Main Campus", status: "Processing" },
  { id: "ENR-004", name: "Kevin Kiprop", grade: "Grade 3", date: "Oct 12", branch: "Main Campus", status: "Completed" },
];

export default function RegistrationDashboard() {
  return (
    <div className="space-y-6 pb-12">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-6 rounded-3xl border border-white/60 backdrop-blur-md shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Registration Overview
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Monitor admissions, enrollments, and student demographics across the institution.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <select className="px-4 py-2.5 bg-white/80 border border-slate-200/60 rounded-xl text-sm font-bold text-slate-700 shadow-sm backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer">
            <option>Academic Year 2026</option>
            <option>Academic Year 2025</option>
          </select>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center gap-6 border border-indigo-700 group hover:-translate-y-1 transition-transform duration-300">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute -bottom-10 right-20 w-32 h-32 bg-indigo-500/40 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        
        <div className="bg-white/10 p-4 rounded-2xl shrink-0 relative z-10 backdrop-blur-md border border-white/10">
          <Sparkles className="w-8 h-8 text-indigo-300" />
        </div>
        <div className="relative z-10 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-black text-white tracking-tight">AI Insight</h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Opportunity</span>
          </div>
          <p className="text-indigo-100 text-sm font-medium leading-relaxed">
            Admissions for Grade 5 are up <strong className="text-emerald-300 font-black">+12%</strong> compared to last term. 
            We project capacity issues by next month. We recommend opening a new stream for Grade 5 in the West Wing.
          </p>
        </div>
        <div className="relative z-10 shrink-0">
          <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-sm font-bold transition-colors">
            Review Capacity
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Students */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 rounded-2xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-200/50 transition-all duration-300">
              <Users className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-extrabold text-blue-700 bg-blue-100/80 px-2.5 py-1.5 rounded-lg border border-blue-200/50 backdrop-blur-sm">
              <TrendingUp className="w-3.5 h-3.5" /> 4%
            </span>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Total Students</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10 mb-2">930</h3>
          <div className="flex items-center gap-2 text-xs relative z-10">
            <span className="text-slate-500 font-bold bg-white px-2 py-1 rounded-md border border-slate-200/60 shadow-sm">450 Boys</span>
            <span className="text-slate-500 font-bold bg-white px-2 py-1 rounded-md border border-slate-200/60 shadow-sm">480 Girls</span>
          </div>
        </div>

        {/* New Admissions */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-emerald-200/50 transition-all duration-300">
              <UserPlus className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">New Admissions</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10 mb-2">42</h3>
          <div className="flex items-center gap-2 text-xs relative z-10">
            <span className="text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5" /> +12% this term
            </span>
          </div>
        </div>

        {/* Pending Applications */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl group-hover:bg-amber-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-gradient-to-br from-amber-100 to-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-amber-200/50 transition-all duration-300">
              <FileText className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs font-extrabold text-amber-700 bg-amber-100/80 px-2.5 py-1.5 rounded-lg border border-amber-200/50 backdrop-blur-sm">
              <AlertCircle className="w-3.5 h-3.5" /> Review
            </span>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Pending Apps</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10 mb-2">18</h3>
          <div className="flex items-center gap-2 text-xs relative z-10">
            <span className="text-amber-600 font-bold bg-amber-50 px-2 py-1 rounded-md border border-amber-100">Action Required</span>
          </div>
        </div>

        {/* Transfers */}
        <div className="bg-gradient-to-br from-white to-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl group-hover:bg-indigo-500/10 transition-colors duration-500"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className="p-3 bg-gradient-to-br from-indigo-100 to-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-indigo-200/50 transition-all duration-300">
              <ArrowRightLeft className="w-6 h-6" />
            </div>
          </div>
          <p className="text-sm font-bold text-slate-500 mb-1 relative z-10">Transfers</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight relative z-10 mb-2">7</h3>
          <div className="flex items-center gap-2 text-xs relative z-10">
            <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100">5 In</span>
            <span className="text-rose-600 font-bold bg-rose-50 px-2 py-1 rounded-md border border-rose-100">2 Out</span>
          </div>
        </div>
      </div>

      {/* Analytical Charts & Tables Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Students by Grade (Chart) */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 lg:col-span-2 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-indigo-500" />
                Students by Grade
              </h3>
              <p className="text-xs font-bold text-slate-400 mt-1">Current academic year distribution</p>
            </div>
          </div>
          <div className="flex-1 w-full h-full min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={studentsByGrade} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} width={60} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800, color: '#4f46e5' }}
                />
                <Bar dataKey="value" name="Students" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: Branch Distribution & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm p-6 flex flex-col h-[280px]">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-500" />
                Branch Distribution
              </h3>
            </div>
            <div className="flex-1 relative mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={studentsByBranch}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {studentsByBranch.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BRANCH_COLORS[index % BRANCH_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 800 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-xl font-black text-slate-800">930</span>
              </div>
            </div>
            <div className="mt-2 space-y-2">
              {studentsByBranch.map((entry, index) => (
                <div key={entry.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: BRANCH_COLORS[index % BRANCH_COLORS.length] }}></div>
                    <span className="text-slate-600 font-bold">{entry.name}</span>
                  </div>
                  <span className="font-black text-slate-800">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white backdrop-blur-lg rounded-3xl border border-indigo-100 shadow-sm p-6">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/dashboard/registration/admissions/applications/new" className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/60 hover:border-indigo-300 hover:shadow-sm transition-all group">
                <span className="font-bold text-slate-700 group-hover:text-indigo-700">New Enrollment</span>
                <UserPlus className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
              </Link>
              <button className="w-full flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200/60 hover:border-indigo-300 hover:shadow-sm transition-all group">
                <span className="font-bold text-slate-700 group-hover:text-indigo-700">Process Transfer</span>
                <ArrowRightLeft className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Recent Enrollments Table */}
        <div className="lg:col-span-3 bg-white/80 backdrop-blur-lg rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200/60 flex items-center justify-between bg-white/40">
            <div>
              <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-widest">Recent Enrollments</h3>
              <p className="text-xs font-bold text-slate-400 mt-1">Latest student entries into the system</p>
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-4 py-2 rounded-xl transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50/50 text-[10px] uppercase font-black text-slate-500 border-b border-slate-200/60 tracking-wider">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Grade</th>
                  <th className="px-6 py-4">Branch</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80">
                {recentEnrollments.map((student) => (
                  <tr key={student.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-500">{student.id}</td>
                    <td className="px-6 py-4 font-bold text-slate-800">{student.name}</td>
                    <td className="px-6 py-4">
                      <span className="bg-white border border-slate-200 shadow-sm text-slate-600 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider">
                        {student.grade}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-600">{student.branch}</td>
                    <td className="px-6 py-4 font-medium text-slate-500">{student.date}</td>
                    <td className="px-6 py-4">
                      {student.status === "Completed" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-emerald-100/80 text-emerald-700 border border-emerald-200">
                          Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-amber-100/80 text-amber-700 border border-amber-200">
                          Processing
                        </span>
                      )}
                    </td>
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
