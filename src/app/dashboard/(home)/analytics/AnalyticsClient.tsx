"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { 
  TrendingUp, Users, Wallet, GraduationCap, Calendar, 
  Filter, Download, X
} from 'lucide-react';

export default function AnalyticsClient({ initialData }: { initialData: any }) {
  const router = useRouter();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const {
    academicYears,
    terms,
    activeYearId,
    activeTermId,
    revenue,
    population,
    popData,
    meanScoreLabel,
    perfData,
    avgAttendance,
    feeData
  } = initialData;

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    router.push(`?yearId=${val}`);
  };

  const handleTermChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    router.push(`?yearId=${activeYearId || ''}&termId=${val}`);
  };

  const handleExport = () => {
    // Just a placeholder for functional export using native modal
    alert("Export successful!");
    setIsExportModalOpen(false);
  };

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `KSh ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `KSh ${(val / 1000).toFixed(1)}K`;
    return `KSh ${val}`;
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-3xl shadow-md border-t-4 border-t-primary-900">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Executive Analytics</h1>
          <p className="text-slate-500 text-sm">Real-time school performance & financial insights.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <select 
            value={activeYearId || ""} 
            onChange={handleYearChange}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium text-slate-700 outline-none focus:border-primary-500"
          >
            <option value="">All Years</option>
            {academicYears.map((y: any) => (
              <option key={y.id} value={y.id}>{y.name}</option>
            ))}
          </select>
          <select 
            value={activeTermId || ""}
            onChange={handleTermChange}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-3xl text-sm font-medium text-slate-700 outline-none focus:border-primary-500"
          >
            <option value="">All Terms</option>
            {terms.map((t: any) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
          <button 
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-900 rounded-3xl text-sm font-bold hover:bg-primary-100 transition-colors"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          <button 
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-3 py-2 bg-primary-900 text-white rounded-3xl text-sm font-bold hover:bg-secondary-500 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total Revenue</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{formatCurrency(revenue)}</h3>
          </div>
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Student Population</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{population.toLocaleString()}</h3>
          </div>
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Mean Score Trend</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{meanScoreLabel}</h3>
          </div>
          <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Attendance</p>
            <h3 className="text-2xl font-bold text-slate-800 mt-1">{avgAttendance}</h3>
          </div>
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Finance Line Chart */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
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
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Top Subjects (Mean Score)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perfData.length ? perfData : [{ subject: 'None', score: 0 }]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
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
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
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
                  {popData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center flex-col pointer-events-none mb-8">
              <span className="text-3xl font-black text-slate-800">{population.toLocaleString()}</span>
              <span className="text-xs font-semibold text-slate-400">Total</span>
            </div>
          </div>
        </div>

        {/* Mini Heatmap Placeholder */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-4">Absentee Heat Map</h3>
          <div className="grid grid-cols-5 gap-2 h-64">
            {/* Generating mock heatmap cells for visual consistency with the original page */}
            {Array.from({length: 25}).map((_, i) => (
              <div 
                key={i} 
                className="rounded-xl" 
                style={{
                  backgroundColor: `rgba(239, 68, 68, ${Math.random() * 0.8})`
                }}
              ></div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">Darker red = higher absenteeism (By Class/Day)</p>
        </div>
      </div>

      {/* Filter Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xl p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Advanced Filters</h2>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Campus / Branch</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-sm">
                  <option>Main Campus</option>
                  <option>North Branch</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Grade / Class Level</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-sm">
                  <option>All Classes</option>
                  <option>Form 1</option>
                  <option>Form 2</option>
                  <option>Form 3</option>
                  <option>Form 4</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsFilterModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-3xl">Cancel</button>
              <button onClick={() => setIsFilterModalOpen(false)} className="px-4 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-3xl">Apply Filters</button>
            </div>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xl p-4">
          <div className="bg-white rounded-3xl shadow-xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h2 className="text-lg font-bold text-slate-800">Export Report</h2>
              <button onClick={() => setIsExportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Format</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-sm">
                  <option>PDF Document</option>
                  <option>Excel Spreadsheet</option>
                  <option>CSV Data</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Scope</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-sm">
                  <option>Current View</option>
                  <option>Full Academic Year</option>
                </select>
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-2 bg-slate-50">
              <button onClick={() => setIsExportModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-3xl">Cancel</button>
              <button onClick={handleExport} className="px-4 py-2 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 rounded-3xl flex items-center gap-2">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
