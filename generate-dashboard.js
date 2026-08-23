const fs = require('fs');
const path = require('path');

const DASH_DIR = path.join(__dirname, 'src', 'app', 'dashboard');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// 1. Analytics
const analyticsDir = path.join(DASH_DIR, 'analytics');
ensureDir(analyticsDir);
const analyticsContent = `
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
                    <Cell key={\`cell-\${index}\`} fill={entry.color} />
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
                  backgroundColor: \`rgba(239, 68, 68, \${Math.random() * 0.8})\`
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
`;
fs.writeFileSync(path.join(analyticsDir, 'page.tsx'), analyticsContent);

// 2. Activities
const activitiesDir = path.join(DASH_DIR, 'activities');
ensureDir(activitiesDir);
const activitiesContent = `
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
              <button key={filter} className={\`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors \${i === 0 ? 'bg-primary-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}\`}>
                {filter}
              </button>
            ))}
          </div>

          <div className="relative border-l-2 border-slate-100 ml-4 space-y-8 pb-4">
            {timeline.map((item, index) => (
              <div key={index} className="relative pl-8">
                {/* Timeline Dot */}
                <div className={\`absolute -left-4 top-0 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center \${item.bg} \${item.color}\`}>
                  <item.icon className="w-4 h-4" />
                </div>
                
                {/* Content */}
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-bold text-slate-800 group-hover:text-primary-900 transition-colors">{item.title}</h4>
                    <span className="text-xs font-semibold text-slate-400">{item.time}</span>
                  </div>
                  <span className={\`inline-block px-2 py-0.5 rounded text-[10px] font-bold mt-2 \${item.bg} \${item.color}\`}>
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
`;
fs.writeFileSync(path.join(activitiesDir, 'page.tsx'), activitiesContent);

// 3. Calendar
const calendarDir = path.join(DASH_DIR, 'calendar');
ensureDir(calendarDir);
const calendarContent = `
"use client";

import React from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Users, MapPin } from 'lucide-react';

export default function CalendarPage() {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  // Generating a quick mock grid
  const renderDays = () => {
    let cells = [];
    for(let i=1; i<=31; i++) {
      let isToday = i === 6; // Mock today
      let hasEvent = i === 12 || i === 18 || i === 25;
      
      cells.push(
        <div key={i} className={\`min-h-[100px] border border-slate-100 p-2 \${isToday ? 'bg-primary-50/50' : 'bg-white'} hover:bg-slate-50 transition-colors\`}>
          <span className={\`text-sm font-bold \${isToday ? 'bg-primary-900 text-white w-7 h-7 rounded-full flex items-center justify-center' : 'text-slate-600'}\`}>
            {i}
          </span>
          {hasEvent && (
            <div className="mt-2 space-y-1">
              {i === 12 && <div className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold truncate">Mid-Term Exams</div>}
              {i === 18 && <div className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-semibold truncate">Fee Deadline</div>}
              {i === 25 && <div className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-semibold truncate">Sports Day</div>}
            </div>
          )}
        </div>
      );
    }
    return cells;
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-md border-t-4 border-t-primary-900 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">School Planner</h1>
          <p className="text-slate-500 text-sm">Manage academic and operational schedules.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button className="px-4 py-1.5 bg-white shadow-sm rounded-md text-sm font-bold text-slate-800">Month</button>
            <button className="px-4 py-1.5 rounded-md text-sm font-bold text-slate-500 hover:text-slate-800">Week</button>
            <button className="px-4 py-1.5 rounded-md text-sm font-bold text-slate-500 hover:text-slate-800">Day</button>
          </div>
          <button className="bg-primary-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-secondary-500 shadow-sm">+ Add Event</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Main Calendar Grid */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-md border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-800">August 2026</h2>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-slate-100 rounded"><ChevronLeft className="w-5 h-5 text-slate-600"/></button>
              <button className="p-1 hover:bg-slate-100 rounded"><ChevronRight className="w-5 h-5 text-slate-600"/></button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100">
            {days.map(d => (
              <div key={d} className="py-2 text-center text-xs font-bold text-slate-500 uppercase">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 bg-white border-l border-slate-100">
            {renderDays()}
          </div>
        </div>

        {/* Right Side Widgets */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-900" /> Today's Schedule
            </h3>
            <div className="space-y-4">
              <div className="relative pl-4 border-l-2 border-orange-500">
                <p className="text-xs text-orange-500 font-bold mb-0.5">08:00 AM</p>
                <p className="text-sm font-bold text-slate-800">Morning Assembly</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><MapPin className="w-3 h-3"/> Main Hall</p>
              </div>
              <div className="relative pl-4 border-l-2 border-blue-500">
                <p className="text-xs text-blue-500 font-bold mb-0.5">09:00 AM</p>
                <p className="text-sm font-bold text-slate-800">Grade 6 CAT Exam</p>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Users className="w-3 h-3"/> Grade 6 Block</p>
              </div>
              <div className="relative pl-4 border-l-2 border-purple-500">
                <p className="text-xs text-purple-500 font-bold mb-0.5">10:30 AM</p>
                <p className="text-sm font-bold text-slate-800">Staff Meeting</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md border border-slate-100 p-5">
            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-amber-500" /> Upcoming Events
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-primary-900">Tomorrow</span>
                </div>
                <p className="text-sm font-bold text-slate-800 mt-1">Parents Meeting</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-primary-900">Friday</span>
                </div>
                <p className="text-sm font-bold text-slate-800 mt-1">Science Congress</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
`;
fs.writeFileSync(path.join(calendarDir, 'page.tsx'), calendarContent);


// 4. AI Insights
const aiInsightsDir = path.join(DASH_DIR, 'ai-insights');
ensureDir(aiInsightsDir);
const aiInsightsContent = `
"use client";

import React, { useState } from 'react';
import { 
  Sparkles, AlertCircle, CheckCircle, TrendingUp, TrendingDown,
  ArrowRight, Send, MessageSquare
} from 'lucide-react';

export default function AIInsightsPage() {
  const [chat, setChat] = useState("");
  
  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      
      {/* Main Insights Panel */}
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin space-y-6">
        
        <div className="bg-gradient-to-r from-primary-900 to-primary-800 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
          <Sparkles className="absolute -right-4 -top-4 w-32 h-32 text-white/10" />
          <h1 className="text-3xl font-black mb-2">Good Morning, Principal.</h1>
          <p className="text-primary-100 text-lg">Here's what needs your attention today, August 6, 2026.</p>
        </div>

        {/* Priority Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
            <div className="flex items-start gap-3">
              <TrendingDown className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-900">Fee Drop</h4>
                <p className="text-sm text-red-700 mt-1">Fee collection has dropped by 18% compared to last term.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-xl shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-orange-900">Attendance Risk</h4>
                <p className="text-sm text-orange-700 mt-1">24 students have attendance below 80% this month.</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border-l-4 border-emerald-500 p-4 rounded-r-xl shadow-sm">
            <div className="flex items-start gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-emerald-900">Academic Gain</h4>
                <p className="text-sm text-emerald-700 mt-1">Grade 9 overall mean score improved by 6%.</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl shadow-sm">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-blue-900">Compliance</h4>
                <p className="text-sm text-blue-700 mt-1">Three teachers haven't submitted lesson plans for Week 4.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Intelligence Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-primary-900">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Academic Intelligence</h3>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-2 text-sm text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5"></div> Predicted KCSE Performance shows a 1.2 point deviation downward in Sciences.</li>
              <li className="flex items-start gap-2 text-sm text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5"></div> Grade 8 East is the weakest performing class currently.</li>
            </ul>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Suggested Action</p>
              <button className="w-full flex items-center justify-between px-4 py-2 bg-primary-900 text-white font-bold text-sm rounded-lg hover:bg-secondary-500 transition-colors">
                Follow up with Grade 8 East Teachers <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-emerald-500">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Finance Intelligence</h3>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-2 text-sm text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div> 145 parents are likely to default based on historic payment behavior.</li>
              <li className="flex items-start gap-2 text-sm text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5"></div> Transport expenses are 12% over budget this month.</li>
            </ul>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Suggested Action</p>
              <button className="w-full flex items-center justify-between px-4 py-2 bg-emerald-600 text-white font-bold text-sm rounded-lg hover:bg-emerald-700 transition-colors">
                Generate reminder SMS to Defaulters <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-purple-500">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">HR Intelligence</h3>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-2 text-sm text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5"></div> 4 teachers have contracts expiring in the next 30 days.</li>
              <li className="flex items-start gap-2 text-sm text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-purple-500 mt-1.5"></div> Payroll for August is pending final approval.</li>
            </ul>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Suggested Action</p>
              <button className="w-full flex items-center justify-between px-4 py-2 bg-purple-600 text-white font-bold text-sm rounded-lg hover:bg-purple-700 transition-colors">
                Approve August Payroll <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-t-amber-500">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Operations Intelligence</h3>
            <ul className="space-y-3 mb-4">
              <li className="flex items-start gap-2 text-sm text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div> Bus #2 requires scheduled maintenance (5,000km reached).</li>
              <li className="flex items-start gap-2 text-sm text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></div> Chemistry lab inventory is critically low for Form 4 Practicals.</li>
            </ul>
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Suggested Action</p>
              <button className="w-full flex items-center justify-between px-4 py-2 bg-amber-600 text-white font-bold text-sm rounded-lg hover:bg-amber-700 transition-colors">
                Order Chemistry Books / Reagents <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* AI Chat Panel */}
      <div className="w-full lg:w-80 bg-white rounded-2xl shadow-xl flex flex-col border border-slate-200 overflow-hidden shrink-0 h-[600px] lg:h-auto">
        <div className="bg-primary-900 p-4 text-white flex items-center gap-3">
          <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-secondary-400" />
          </div>
          <div>
            <h3 className="font-bold">MyShule AI</h3>
            <p className="text-xs text-primary-200">School Consultant</p>
          </div>
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-4">
           {/* Bot Message */}
           <div className="flex gap-2">
             <div className="w-8 h-8 rounded-full bg-primary-900 flex items-center justify-center shrink-0">
               <Sparkles className="w-4 h-4 text-white" />
             </div>
             <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-200 shadow-sm text-sm text-slate-700">
               Hello! I'm your AI consultant. You can ask me to analyze data, find defaulters, or summarize activities.
             </div>
           </div>
           
           {/* Prompts */}
           <div className="space-y-2 mt-4 pl-10">
             {["Show fee defaulters.", "Who missed class today?", "Which class needs intervention?"].map(prompt => (
               <button key={prompt} className="block w-full text-left p-2 text-xs font-semibold text-primary-700 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors border border-primary-100">
                 "{prompt}"
               </button>
             ))}
           </div>
        </div>
        
        <div className="p-3 border-t border-slate-200 bg-white">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Ask MyShule AI..." 
              className="w-full bg-slate-100 border border-slate-200 rounded-full py-2.5 pl-4 pr-10 text-sm focus:outline-none focus:border-primary-500"
              value={chat}
              onChange={(e) => setChat(e.target.value)}
            />
            <button className="absolute right-1 top-1 w-8 h-8 bg-primary-900 rounded-full flex items-center justify-center text-white hover:bg-secondary-500 transition-colors shadow-sm">
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
`;
fs.writeFileSync(path.join(aiInsightsDir, 'page.tsx'), aiInsightsContent);

console.log("All Dashboard pages generated successfully.");
