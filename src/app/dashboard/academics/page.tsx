"use client";

import React from "react";
import { 
  GraduationCap, BookOpen, Clock, BrainCircuit,
  TrendingUp, Activity, Sparkles, BookMarked
} from "lucide-react";
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";

// Mock Data
const performanceTrend = [
  { term: "Term 1 (2025)", mean: 6.8 },
  { term: "Term 2 (2025)", mean: 7.1 },
  { term: "Term 3 (2025)", mean: 7.5 },
  { term: "Term 1 (2026)", mean: 7.4 },
  { term: "Term 2 (2026)", mean: 8.2 },
];

const subjectPerformance = [
  { subject: "Maths", score: 78 },
  { subject: "English", score: 82 },
  { subject: "Kiswahili", score: 75 },
  { subject: "Science", score: 85 },
  { subject: "Social", score: 79 },
];

export default function AcademicsDashboard() {
  return (
    <div className="space-y-8 pb-12">
      
      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 p-6 rounded-3xl border border-white/60 backdrop-blur-md shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            Academics Overview
          </h1>
          <p className="text-slate-500 font-medium mt-1 text-sm">
            Monitor school performance, curriculum delivery, and AI insights.
          </p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-3 text-sm font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md shadow-indigo-500/20">
            <Sparkles className="w-4 h-4 text-purple-200" />
            Generate AI Report
          </button>
        </div>
      </div>

      {/* AI Insight Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row items-start md:items-center gap-6 border border-indigo-900/50">
        <div className="bg-white/10 p-5 rounded-2xl shrink-0 relative z-10 border border-white/10 backdrop-blur-sm">
          <BrainCircuit className="w-10 h-10 text-indigo-400" />
        </div>
        <div className="relative z-10">
          <h3 className="text-xl font-black text-white mb-2 flex items-center gap-2">
            AI Academic Assistant
          </h3>
          <p className="text-slate-300 text-sm max-w-4xl leading-relaxed font-medium">
            <strong className="text-rose-400">Attention required:</strong> 30% of Grade 4 students are struggling with Fractions in Mathematics. 
            I recommend generating a targeted revision worksheet and scheduling a 30-minute remedial session this Friday.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="text-xs font-bold bg-white text-slate-900 px-4 py-2.5 rounded-xl flex items-center gap-2 hover:bg-slate-100 transition-colors shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Generate Worksheet
            </button>
            <button className="text-xs font-bold bg-white/10 text-white px-4 py-2.5 rounded-xl hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-sm">
              Schedule Remedial
            </button>
          </div>
        </div>
        {/* Background decorations */}
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-16 right-32 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* 1. Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* School Mean Score */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">School Mean Score</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">8.2 <span className="text-lg text-slate-400 font-bold">/ 12</span></h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 relative z-10">
            <span className="text-emerald-700 text-xs font-bold bg-emerald-100/80 px-2.5 py-1 rounded-lg border border-emerald-200/50 backdrop-blur-sm">
              +0.8 from last term
            </span>
          </div>
        </div>

        {/* Teacher Workload */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Avg Workload</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">24 <span className="text-lg text-slate-400 font-bold">hrs/wk</span></h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
              <Clock className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 relative z-10">
            <span className="text-slate-500 text-xs font-bold bg-slate-100/80 px-2.5 py-1 rounded-lg border border-slate-200/50 backdrop-blur-sm">
              Optimal capacity
            </span>
          </div>
        </div>

        {/* Total Subjects/Areas */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Learning Areas</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">18</h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-sky-50 flex items-center justify-center text-sky-600 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 relative z-10">
            <span className="text-sky-700 text-xs font-bold bg-sky-100/80 px-2.5 py-1 rounded-lg border border-sky-200/50 backdrop-blur-sm">
              Fully CBC Aligned
            </span>
          </div>
        </div>

        {/* Upcoming Assessments */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 border border-slate-200/80 shadow-sm relative overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-2xl group-hover:bg-rose-500/10 transition-colors"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Active Exams</p>
              <h3 className="text-4xl font-black text-slate-800 tracking-tight">3</h3>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform">
              <Activity className="w-6 h-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 mt-4 relative z-10">
            <span className="text-rose-700 text-xs font-bold bg-rose-100/80 px-2.5 py-1 rounded-lg border border-rose-200/50 backdrop-blur-sm animate-pulse">
              End Term in 14 days
            </span>
          </div>
        </div>

      </div>

      {/* 2. Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Performance Trend */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                 <TrendingUp className="w-5 h-5" />
              </div>
              School Performance Trend
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="term" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} domain={[4, 10]} />
                <Tooltip 
                  cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800 }}
                  labelStyle={{ fontWeight: 800, color: '#475569', marginBottom: '4px' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="mean" 
                  name="Mean Score"
                  stroke="#4f46e5" 
                  strokeWidth={4}
                  dot={{ r: 6, fill: '#4f46e5', strokeWidth: 0 }}
                  activeDot={{ r: 8, strokeWidth: 0, fill: '#4f46e5' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Performance */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-3">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                 <BookMarked className="w-5 h-5" />
              </div>
              Top Performing Subjects
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectPerformance} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="subject" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} domain={[0, 100]} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 800 }}
                  labelStyle={{ fontWeight: 800, color: '#475569', marginBottom: '4px' }}
                />
                <Bar dataKey="score" name="Average %" radius={[6, 6, 0, 0]} barSize={40}>
                  {subjectPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.score < 80 ? '#38bdf8' : '#10b981'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
}
