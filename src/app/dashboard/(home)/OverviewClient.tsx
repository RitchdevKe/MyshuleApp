"use client";

import React, { useRef } from "react";
import { 
  Users, 
  UserCheck, 
  Wallet, 
  CalendarCheck, 
  AlertCircle
} from "lucide-react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  ComposedChart, Area, Line
} from "recharts";
import { useSchoolLevel } from "@/contexts/SchoolLevelContext";

const COLORS = ["#3a1127", "#895876", "#e11d48", "#f59e0b", "#10b981", "#3b82f6"];

export default function OverviewClient({ initialData }: { initialData: any }) {
  const { schoolLevel } = useSchoolLevel();
  const exportDialogRef = useRef<HTMLDialogElement>(null);
  const dataDialogRef = useRef<HTMLDialogElement>(null);

  const data = initialData;
  const { stats, revenue, enrollment, performance, totalExpected, totalCollected } = data;

  const collectionPercentage = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

  const handleExportPDF = () => {
    exportDialogRef.current?.close();
    window.print();
  };

  const handleExportCSV = () => {
    exportDialogRef.current?.close();
    
    // Simple CSV export logic for demonstration
    const rows = [
      ["Metric", "Value"],
      ["Total Students", stats.students],
      ["Boys", stats.boys],
      ["Girls", stats.girls],
      ["Total Staff", stats.staff],
      ["Fees Collected", totalCollected],
      ["Fees Expected", totalExpected],
      ["Attendance %", stats.attendance],
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "overview_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">
          Dashboard Overview <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg ml-2">{schoolLevel === "All" ? "All Schools" : schoolLevel}</span>
        </h2>
        <div className="flex space-x-2">
          <button 
            onClick={() => exportDialogRef.current?.showModal()}
            className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition print:hidden"
          >
            Export Report
          </button>
          <button 
            onClick={() => dataDialogRef.current?.showModal()}
            className="bg-primary-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-800 transition shadow-sm print:hidden"
          >
            View All Data
          </button>
        </div>
      </div>

      {/* 1. Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-2xl p-5 border-t-8 border-b-4 border-x-2 border-slate-200 border-t-primary-900 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Students</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{stats.students.toLocaleString()}</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-900 group-hover:bg-primary-900 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">Boys: {stats.boys.toLocaleString()}</span>
            <span className="text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-md">Girls: {stats.girls.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-t-8 border-b-4 border-x-2 border-slate-200 border-t-secondary-500 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Staff</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{stats.staff.toLocaleString()}</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-secondary-50 flex items-center justify-center text-secondary-500 group-hover:bg-secondary-500 group-hover:text-white transition-colors">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">Male: {stats.maleStaff}</span>
            <span className="text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-md">Female: {stats.femaleStaff}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-t-8 border-b-4 border-x-2 border-slate-200 border-t-emerald-500 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Fees Collected</p>
              <h3 className="text-2xl font-extrabold text-slate-800">
                {(totalCollected / 1000000).toFixed(1)}M <span className="text-sm text-slate-400 font-normal">KES</span>
              </h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Wallet className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div className="w-full bg-slate-100 rounded-full h-1.5 max-w-[100px]">
              <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, collectionPercentage)}%` }}></div>
            </div>
            <span className="text-slate-500 font-medium">{collectionPercentage.toFixed(0)}% of Target</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-t-8 border-b-4 border-x-2 border-slate-200 border-t-blue-500 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Today's Attendance</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{stats.attendance}%</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {stats.absent} Absent
            </span>
          </div>
        </div>

      </div>

      {/* 2. Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-800">Fee Collection Overview</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenue} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis width={60} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => value >= 1000000 ? `${(value / 1000000).toFixed(1)}M` : `${value / 1000}k`} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="expected" name="Expected (KES)" fill="#f1e7ec" radius={[4, 4, 0, 0]} barSize={20} />
                <Bar dataKey="collected" name="Collected (KES)" fill="#3a1127" radius={[4, 4, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-800 mb-6">Enrollment Distribution</h3>
          <div className="h-[220px] w-full flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={enrollment}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {enrollment.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                   contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {enrollment.map((entry: any, index: number) => (
              <div key={entry.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-slate-600 font-medium">{entry.name}</span>
                </div>
                <span className="font-bold text-slate-800">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Performance Overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Academic Performance</h3>
            <p className="text-xs text-slate-500 font-medium mt-1">CATs vs Final Exams average scores</p>
          </div>
        </div>
        
        <div className="h-[320px] w-full relative z-10">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={performance} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
              <defs>
                <linearGradient id="colorCat" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3a1127" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3a1127" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExam" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#e11d48" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#e11d48" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="grade" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={15} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
                cursor={{ fill: '#f8fafc', opacity: 0.5 }}
              />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
              
              <Area type="monotone" dataKey="cat" name="CATs (%)" stroke="#3a1127" strokeWidth={3} fillOpacity={1} fill="url(#colorCat)" />
              <Area type="monotone" dataKey="exam" name="Final Exams (%)" stroke="#e11d48" strokeWidth={3} fillOpacity={1} fill="url(#colorExam)" />
              <Line type="monotone" dataKey="average" name="Overall Avg" stroke="#f59e0b" strokeWidth={4} dot={{ r: 6, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Export Report Modal */}
      <dialog 
        ref={exportDialogRef} 
        className="backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm p-0 rounded-3xl shadow-xl w-full max-w-md overflow-hidden bg-white open:animate-in open:zoom-in-95 duration-200"
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-2">Export Report</h3>
          <p className="text-slate-500 text-sm mb-6">Choose the format you would like to export the current dashboard overview.</p>
          
          <div className="space-y-3">
            <button 
              onClick={handleExportPDF}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
            >
              <div>
                <p className="font-bold text-slate-800">PDF Document</p>
                <p className="text-xs text-slate-500">Best for sharing and printing</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">📄</div>
            </button>
            <button 
              onClick={handleExportCSV}
              className="w-full flex items-center justify-between p-4 rounded-2xl border border-slate-200 hover:border-primary-500 hover:bg-primary-50 transition-colors text-left"
            >
              <div>
                <p className="font-bold text-slate-800">Excel / CSV</p>
                <p className="text-xs text-slate-500">Best for further analysis</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center">📊</div>
            </button>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={() => exportDialogRef.current?.close()}
            className="px-4 py-2 text-slate-600 font-medium hover:bg-slate-200 rounded-xl transition-colors"
          >
            Cancel
          </button>
        </div>
      </dialog>

      {/* View All Data Modal */}
      <dialog 
        ref={dataDialogRef} 
        className="backdrop:bg-slate-900/50 backdrop:backdrop-blur-sm p-0 rounded-3xl shadow-xl w-full max-w-lg overflow-hidden bg-white open:animate-in open:zoom-in-95 duration-200"
      >
        <div className="p-6">
          <h3 className="text-xl font-bold text-slate-800 mb-4">Raw Data Overview</h3>
          <div className="max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            <pre className="text-xs bg-slate-900 text-slate-300 p-4 rounded-2xl overflow-x-auto">
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        </div>
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button 
            onClick={() => dataDialogRef.current?.close()}
            className="px-4 py-2 bg-slate-900 text-white font-medium hover:bg-slate-800 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </dialog>
    </div>
  );
}

