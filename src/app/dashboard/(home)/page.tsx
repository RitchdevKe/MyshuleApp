"use client";

import React, { useMemo } from "react";
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
  AreaChart, Area, ComposedChart, Line
} from "recharts";
import { useSchoolLevel } from "@/contexts/SchoolLevelContext";

// --- Mock Data by Level ---

const rawRevenueData = {
  "Pre-Primary": [
    { name: "Jan", expected: 200000, collected: 180000 },
    { name: "Feb", expected: 200000, collected: 190000 },
    { name: "Mar", expected: 200000, collected: 195000 },
  ],
  "Primary": [
    { name: "Jan", expected: 500000, collected: 400000 },
    { name: "Feb", expected: 500000, collected: 450000 },
    { name: "Mar", expected: 500000, collected: 480000 },
  ],
  "Junior": [
    { name: "Jan", expected: 300000, collected: 250000 },
    { name: "Feb", expected: 300000, collected: 280000 },
    { name: "Mar", expected: 300000, collected: 290000 },
  ],
  "Senior": [
    { name: "Jan", expected: 400000, collected: 300000 },
    { name: "Feb", expected: 400000, collected: 350000 },
    { name: "Mar", expected: 400000, collected: 390000 },
  ],
};

const rawEnrollmentData = {
  "Pre-Primary": [
    { name: "PP1", value: 60 },
    { name: "PP2", value: 60 },
  ],
  "Primary": [
    { name: "Lower Primary", value: 340 },
    { name: "Upper Primary", value: 290 },
  ],
  "Junior": [
    { name: "Grade 7", value: 100 },
    { name: "Grade 8", value: 95 },
    { name: "Grade 9", value: 90 },
  ],
  "Senior": [
    { name: "Grade 10", value: 80 },
    { name: "Grade 11", value: 85 },
    { name: "Grade 12", value: 75 },
  ],
};

const rawPerformanceData = {
  "Pre-Primary": [
    { grade: "PP1", cat: 80, exam: 75, average: 77.5 },
    { grade: "PP2", cat: 85, exam: 82, average: 83.5 },
  ],
  "Primary": [
    { grade: "Grade 1", cat: 85, exam: 78, average: 81.5 },
    { grade: "Grade 2", cat: 80, exam: 82, average: 81.0 },
    { grade: "Grade 3", cat: 75, exam: 88, average: 81.5 },
    { grade: "Grade 4", cat: 90, exam: 85, average: 87.5 },
    { grade: "Grade 5", cat: 82, exam: 80, average: 81.0 },
    { grade: "Grade 6", cat: 88, exam: 90, average: 89.0 },
  ],
  "Junior": [
    { grade: "Grade 7", cat: 75, exam: 80, average: 77.5 },
    { grade: "Grade 8", cat: 78, exam: 82, average: 80.0 },
    { grade: "Grade 9", cat: 85, exam: 85, average: 85.0 },
  ],
  "Senior": [
    { grade: "Grade 10", cat: 70, exam: 75, average: 72.5 },
    { grade: "Grade 11", cat: 80, exam: 78, average: 79.0 },
    { grade: "Grade 12", cat: 85, exam: 88, average: 86.5 },
  ],
};

const statsBase = {
  "Pre-Primary": { students: 120, boys: 60, girls: 60, staff: 10, maleStaff: 2, femaleStaff: 8, attendance: 98.5, absent: 2 },
  "Primary": { students: 630, boys: 310, girls: 320, staff: 40, maleStaff: 15, femaleStaff: 25, attendance: 96.2, absent: 24 },
  "Junior": { students: 285, boys: 140, girls: 145, staff: 25, maleStaff: 10, femaleStaff: 15, attendance: 95.0, absent: 14 },
  "Senior": { students: 240, boys: 120, girls: 120, staff: 30, maleStaff: 15, femaleStaff: 15, attendance: 94.5, absent: 13 },
};

const COLORS = ["#3a1127", "#895876", "#e11d48", "#f59e0b", "#10b981", "#3b82f6"];

export default function DashboardPage() {
  const { schoolLevel } = useSchoolLevel();

  // Aggregate or Filter Data
  const data = useMemo(() => {
    if (schoolLevel === "All") {
      // Aggregate stats
      const aggregatedStats = Object.values(statsBase).reduce((acc, curr) => ({
        students: acc.students + curr.students,
        boys: acc.boys + curr.boys,
        girls: acc.girls + curr.girls,
        staff: acc.staff + curr.staff,
        maleStaff: acc.maleStaff + curr.maleStaff,
        femaleStaff: acc.femaleStaff + curr.femaleStaff,
        absent: acc.absent + curr.absent,
      }), { students: 0, boys: 0, girls: 0, staff: 0, maleStaff: 0, femaleStaff: 0, absent: 0 });
      
      const overallAttendance = ((aggregatedStats.students - aggregatedStats.absent) / aggregatedStats.students) * 100;

      // Aggregate revenue
      const aggRev = [
        { name: "Jan", expected: 0, collected: 0 },
        { name: "Feb", expected: 0, collected: 0 },
        { name: "Mar", expected: 0, collected: 0 },
      ];
      Object.values(rawRevenueData).forEach(schoolRev => {
        schoolRev.forEach((month, i) => {
          aggRev[i].expected += month.expected;
          aggRev[i].collected += month.collected;
        });
      });

      // Enrollment grouped by level
      const aggEnrollment = [
        { name: "Pre-Primary", value: statsBase["Pre-Primary"].students },
        { name: "Primary", value: statsBase["Primary"].students },
        { name: "Junior", value: statsBase["Junior"].students },
        { name: "Senior", value: statsBase["Senior"].students },
      ];

      // Performance: combine all or just show a summary
      // For "All Schools", we can show a combined chart of all grades, or just average per level
      const aggPerf = [
        { grade: "Pre-Primary", cat: 82, exam: 78, average: 80.0 },
        { grade: "Primary", cat: 83, exam: 83, average: 83.0 },
        { grade: "Junior", cat: 79, exam: 82, average: 80.5 },
        { grade: "Senior", cat: 78, exam: 80, average: 79.0 },
      ];

      return {
        stats: { ...aggregatedStats, attendance: overallAttendance.toFixed(1) },
        revenue: aggRev,
        enrollment: aggEnrollment,
        performance: aggPerf,
        levelLabel: "All Schools"
      };
    } else {
      // Filter for specific level
      const rev = rawRevenueData[schoolLevel as keyof typeof rawRevenueData] || [];
      const enr = rawEnrollmentData[schoolLevel as keyof typeof rawEnrollmentData] || [];
      const perf = rawPerformanceData[schoolLevel as keyof typeof rawPerformanceData] || [];
      const st = statsBase[schoolLevel as keyof typeof statsBase];
      
      return {
        stats: { ...st, attendance: st.attendance.toFixed(1) },
        revenue: rev,
        enrollment: enr,
        performance: perf,
        levelLabel: schoolLevel
      };
    }
  }, [schoolLevel]);

  const totalCollected = data.revenue.reduce((acc, curr) => acc + curr.collected, 0);
  const totalExpected = data.revenue.reduce((acc, curr) => acc + curr.expected, 0);
  const collectionPercentage = totalExpected > 0 ? (totalCollected / totalExpected) * 100 : 0;

  return (
    <div className="max-w-7xl mx-auto space-y-4 pb-12 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-black text-slate-800 tracking-tight">
          Dashboard Overview <span className="text-sm font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg ml-2">{data.levelLabel}</span>
        </h2>
      </div>

      {/* 1. Top Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white rounded-2xl p-5 border-t-8 border-b-4 border-x-2 border-slate-200 border-t-primary-900 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Students</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{data.stats.students.toLocaleString()}</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-900 group-hover:bg-primary-900 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">Boys: {data.stats.boys.toLocaleString()}</span>
            <span className="text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-md">Girls: {data.stats.girls.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-t-8 border-b-4 border-x-2 border-slate-200 border-t-secondary-500 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Staff</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{data.stats.staff.toLocaleString()}</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-secondary-50 flex items-center justify-center text-secondary-500 group-hover:bg-secondary-500 group-hover:text-white transition-colors">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded-md">Male: {data.stats.maleStaff}</span>
            <span className="text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-md">Female: {data.stats.femaleStaff}</span>
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
              <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${collectionPercentage}%` }}></div>
            </div>
            <span className="text-slate-500 font-medium">{collectionPercentage.toFixed(0)}% of Target</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border-t-8 border-b-4 border-x-2 border-slate-200 border-t-blue-500 shadow-sm relative overflow-hidden group">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Today's Attendance</p>
              <h3 className="text-3xl font-extrabold text-slate-800">{data.stats.attendance}%</h3>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <CalendarCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-rose-500 font-bold bg-rose-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {data.stats.absent} Absent
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
              <BarChart data={data.revenue} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `${value / 1000}k`} />
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
                  data={data.enrollment}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {data.enrollment.map((entry, index) => (
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
            {data.enrollment.map((entry, index) => (
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
            <ComposedChart data={data.performance} margin={{ top: 20, right: 20, bottom: 20, left: -20 }}>
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
    </div>
  );
}
