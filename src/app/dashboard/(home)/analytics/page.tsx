
"use client";

import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, Wallet, GraduationCap, Calendar, 
  ChevronDown, Filter, Download
} from 'lucide-react';

const feeData = [
  { month: 'Jan', collected: 4000000, expected: 5000000 },
  { month: 'Feb', collected: 3000000, expected: 3200000 },
  { month: 'Mar', collected: 2000000, expected: 2500000 },
  { month: 'Apr', collected: 2780000, expected: 3908000 },
  { month: 'May', collected: 1890000, expected: 4800000 },
  { month: 'Jun', collected: 2390000, expected: 3800000 },
];

const perfData = [
  { subject: 'Math', score: 85 },
  { subject: 'English', score: 78 },
  { subject: 'Science', score: 82 },
  { subject: 'Kiswahili', score: 70 },
  { subject: 'Social Studies', score: 88 },
];

const popData = [
  { name: 'Boys', value: 540, color: '#0ea5e9' },
  { name: 'Girls', value: 610, color: '#ec4899' },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-md border-t-4 border-t-primary-900">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Executive Analytics</h1>
          <p className="text-slate-500 text-sm">Real-time school performance & financial insights.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-primary-500">
            <option>2026-2027 Academic Year</option>
            <option>2025-2026 Academic Year</option>
          </select>
          <select className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:border-primary-500">
            <option>Term 1</option>
            <option>Term 2</option>
            <option>Term 3</option>
          </select>
          <button className="flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-900 rounded-lg text-sm font-bold hover:bg-primary-100 transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button className="flex items-center gap-2 px-3 py-2 bg-primary-900 text-white rounded-lg text-sm font-bold hover:bg-secondary-500 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">KSh 16.4M</h3>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +12.5%
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Student Population</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">1,150</h3>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +4.2%
            </span>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Mean Score Trend</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">B+ (68.4)</h3>
            <span className="text-xs font-bold text-emerald-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +1.2 pts
            </span>
          </div>
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Attendance</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">94.2%</h3>
            <span className="text-xs font-bold text-red-500 flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3 rotate-180" /> -0.5%
            </span>
          </div>
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Finance Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Fee Collection vs Expected</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={feeData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B1D14" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B1D14" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e293b" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#1e293b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#cbd5e1" fontSize={12} />
                <YAxis stroke="#cbd5e1" fontSize={12} />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="expected" stroke="#94a3b8" fillOpacity={1} fill="url(#colorExpected)" />
                <Area type="monotone" dataKey="collected" stroke="#8B1D14" fillOpacity={1} fill="url(#colorCollected)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Academic Bar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top Subjects (Mean Score)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perfData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="subject" stroke="#cbd5e1" fontSize={12} />
                <YAxis stroke="#cbd5e1" fontSize={12} />
                <Tooltip cursor={{fill: '#f8fafc'}} />
                <Bar dataKey="score" fill="#3F3D99" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Population Donut Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Gender Ratio</h3>
          <div className="h-64 flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={popData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {popData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none mb-8">
              <span className="text-3xl font-black text-slate-800">1,150</span>
              <span className="text-xs font-semibold text-slate-400">Total</span>
            </div>
          </div>
        </div>

        {/* Mini Heatmap Placeholder */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Absentee Heat Map</h3>
          <div className="grid grid-cols-5 gap-2 h-64">
            {/* Generating mock heatmap cells */}
            {Array.from({length: 25}).map((_, i) => (
              <div 
                key={i} 
                className="rounded-md" 
                style={{
                  backgroundColor: `rgba(239, 68, 68, ${Math.random() * 0.8})`
                }}
              ></div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">Darker red = higher absenteeism (By Class/Day)</p>
        </div>
      </div>
    </div>
  );
}
