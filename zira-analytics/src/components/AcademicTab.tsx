import { toast } from "react-hot-toast";
import React, { useState } from 'react';
import { 
  GraduationCap, 
  Users, 
  Award, 
  BookOpen, 
  Clock, 
  ArrowRight, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Calendar, 
  ChevronRight, 
  Plus, 
  Search, 
  Sparkles,
  Building2,
  Bookmark,
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { Student, Exam } from '../types.ts';

interface AcademicTabProps {
  students: Student[];
  exams: Exam[];
  onNavigateTab: (tab: any) => void;
}

export function AcademicTab({ students = [], exams = [], onNavigateTab }: AcademicTabProps) {
  const activeStudents = students || [];
  
  // 1. Calculations & Metrics
  const totalStudents = activeStudents.length;
  
  const formCounts: Record<string, number> = {};
  activeStudents.forEach(s => {
    const f = s.form || 'Unknown';
    formCounts[f] = (formCounts[f] || 0) + 1;
  });

  // Calculate KCSE candidates (Form 4)
  const candidateCount = activeStudents.filter(s => String(s.form).includes('4')).length;

  const chartData = Object.entries(formCounts).map(([name, count]) => ({
    name,
    Students: count,
  })).sort((a, b) => a.name.localeCompare(b.name));

  // If no dynamic chart data, populate standard fallback
  const finalChartData = chartData.length > 0 ? chartData : [
    { name: 'Form 1', Students: 42 },
    { name: 'Form 2', Students: 38 },
    { name: 'Form 3', Students: 45 },
    { name: 'Form 4', Students: 35 },
  ];

  // Mean Score indicator representation
  const meanScore = "B- (KCSE Project)";
  const systemSyllabusProgress = 88; // %

  const [selectedClassAction, setSelectedClassAction] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<Record<string, string>>({
    'Form 1 East': 'Mrs. Grace Kamau',
    'Form 1 West': 'Mr. Joseph Njuguna',
    'Form 2 East': 'Miss Hellen Kerubo',
    'Form 2 West': 'Mr. Peter Mwangi',
    'Form 3 East': 'Mrs. Mary Atieno',
    'Form 3 West': 'Mr. Gitumu Delson',
    'Form 4 East': 'Mr. Douglas Omari',
    'Form 4 West': 'Miss Jane Mwangi',
  });

  const [tempTeacherName, setTempTeacherName] = useState('');

  const [activeAdvisory, setActiveAdvisory] = useState<boolean>(true);

  const handleUpdateTeacher = (classKey: string) => {
    if (!tempTeacherName.trim()) {
      toast.error('Please enter a valid teacher name');
      return;
    }
    setTeachers(prev => ({
      ...prev,
      [classKey]: tempTeacherName.trim()
    }));
    toast.success(`Class teacher updated for ${classKey}!`);
    setSelectedClassAction(null);
  };

  return (
    <div className="space-y-4">
      
      {/* Alert Banner for Term Ending */}
      {activeAdvisory && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 text-amber-900 justify-between shadow-xs"
        >
          <div className="flex gap-2.5 items-start">
            <div className="bg-amber-100 text-amber-800 rounded-lg p-1.5 shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-sm font-semibold block">End of Term Exam Period Scheduled</span>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                Term 1 final assessment sheets lock in 6 days. Compile CA marks and verify syllabus coverage.
              </p>
            </div>
          </div>
          <button 
            onClick={() => setActiveAdvisory(false)}
            className="text-amber-500 hover:text-amber-800 p-1 rounded-lg hover:bg-amber-100 transition cursor-pointer border-none bg-transparent"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}

      {/* Main Core Scorecard Metrics Ring */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] px-4 py-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">Enrollment</span>
            <span className="text-2xl font-bold text-slate-900 tabular-nums leading-tight block">{totalStudents || "160"}</span>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-0.5">
              <TrendingUp className="w-3 h-3" />
              <span>+3 transferred this term</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] px-4 py-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
            <Award className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">Target Mean</span>
            <span className="text-2xl font-bold text-slate-900 leading-tight block">{meanScore}</span>
            <div className="flex items-center gap-1 text-[11px] text-amber-600 font-medium mt-0.5">
              <Sparkles className="w-3 h-3" />
              <span>Projected +1.2 shift</span>
            </div>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] px-4 py-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">Syllabus Coverage</span>
            <span className="text-2xl font-bold text-slate-900 tabular-nums leading-tight block">{systemSyllabusProgress}%</span>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div 
                className="bg-teal-500 h-full rounded-full" 
                style={{ width: `${systemSyllabusProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] px-4 py-3.5 shadow-sm flex items-center gap-3 hover:shadow-md transition-all">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">Exam Calendar</span>
            <span className="text-2xl font-bold text-slate-900 leading-tight block">Term 1</span>
            <span className="text-[11px] text-slate-400 font-normal mt-0.5 block tabular-nums">
              Jan 05 – Apr 10, 2026
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* BENTO CHART: Student Distribution */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Enrolment Distribution</h3>
              <p className="text-xs text-slate-400 mt-0.5">Active candidates by form</p>
            </div>
            <div className="text-[11px] font-medium text-slate-400 border border-slate-100 px-2 py-1 rounded-md bg-slate-50 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
            </div>
          </div>

          <div className="h-64 mt-4 select-none">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={finalChartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} fontWeight={500} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} fontWeight={500} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0F172A', 
                    borderRadius: '10px', 
                    border: 'none', 
                    color: '#fff',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '12px'
                  }}
                  cursor={{ fill: '#F1F5F9', radius: 4 }}
                />
                <Bar dataKey="Students" fill="var(--color-secondary)" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-3 border-t border-slate-100 text-center">
            {finalChartData.map((d, i) => (
              <div key={i}>
                <span className="text-[11px] text-slate-400 font-medium block">{d.name}</span>
                <span className="text-sm font-semibold text-slate-700 tabular-nums">{d.Students}</span>
              </div>
            ))}
          </div>
        </div>

        {/* SIDE COLUMN: Quick Modules Routing & Term Progress */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-semibold text-slate-800">Fast-Track</h3>
              <p className="text-xs text-slate-400 mt-0.5">Quick shortcuts</p>
            </div>

            <div className="space-y-1.5">
              <button 
                onClick={() => onNavigateTab('classes')}
                className="w-full p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">Roster & Classes</span>
                    <span className="text-[11px] text-slate-400 block">Class teachers & streams</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => onNavigateTab('subjects')}
                className="w-full p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <Bookmark className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">Subject Directory</span>
                    <span className="text-[11px] text-slate-400 block">Parameters & coefficients</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button 
                onClick={() => onNavigateTab('timetable')}
                className="w-full p-2.5 border border-slate-100 rounded-xl hover:bg-slate-50 transition text-left flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <Clock className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-slate-800 block">Timetables & Scheduler</span>
                    <span className="text-[11px] text-slate-400 block">Active room schedules</span>
                  </div>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <div className="flex justify-between items-center text-xs font-medium">
              <span className="text-slate-500">Term Progress</span>
              <span className="font-semibold text-slate-800 tabular-nums">82%</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#C20F47] h-full rounded-full" style={{ width: '82%' }} />
            </div>
            <div className="flex justify-between items-center text-[10px] text-slate-400 tabular-nums">
              <span>Jan 5</span>
              <span>Apr 10</span>
            </div>
          </div>
        </div>

      </div>

      {/* LOWER BENTO ROW: Class Teachers Allocation Stream Dashboard */}
      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Class Teacher Allocation</h3>
            <p className="text-xs text-slate-400 mt-0.5">Official class representatives per stream</p>
          </div>
          <button 
            onClick={() => {
              toast.success("To allocate a new level entirely, please use School Setting Hierarchy Builder.");
            }}
            className="self-start text-xs font-medium text-[#C20F47] bg-rose-50 hover:bg-rose-100 px-3 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer border-none"
          >
            <Plus className="w-3.5 h-3.5" /> Allocate Section
          </button>
        </div>

        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50/60 border-b border-slate-100">
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Level</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Stream</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Class Teacher</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Strength</th>
                <th className="px-4 py-2.5 font-medium text-slate-500 text-xs text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {Object.entries(teachers).map(([classKey, teacherName]) => {
                const [formName, streamName] = classKey.split(' ');
                return (
                  <tr key={classKey} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-4 py-2.5 font-semibold text-slate-800 text-sm">{formName}</td>
                    <td className="px-4 py-2.5">
                      <span className="text-[11px] font-medium bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded">
                        {streamName} Stream
                      </span>
                    </td>
                    <td className="px-4 py-2.5 font-medium text-slate-700 text-sm flex items-center gap-1.5">
                      <UserCheck className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      {teacherName}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs tabular-nums font-normal text-slate-400">Auto balanced</span>
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button 
                        onClick={() => {
                          setSelectedClassAction(classKey);
                          setTempTeacherName(teacherName);
                        }}
                        className="text-xs font-medium text-[#C20F47] bg-rose-50 hover:bg-rose-100 px-2.5 py-1.5 rounded-lg cursor-pointer transition border-none"
                      >
                        Reassign
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* REASSIGN TEACHER DIALOG OVERLAY */}
      <AnimatePresence>
        {selectedClassAction && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden"
            >
              <div className="px-5 py-3.5 bg-[#3D1D3F] text-white flex justify-between items-center">
                <div>
                  <h4 className="font-semibold text-sm">Reassign Class Teacher</h4>
                  <p className="text-[11px] text-white/50 mt-0.5">{selectedClassAction}</p>
                </div>
                <button 
                  onClick={() => setSelectedClassAction(null)}
                  className="text-white/60 hover:text-white p-1.5 rounded-lg transition-all hover:bg-white/10 cursor-pointer border-none bg-transparent"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 space-y-3.5">
                <div>
                  <label className="text-xs font-medium text-slate-500 mb-1.5 block">Teacher Full Name</label>
                  <input 
                    type="text" 
                    value={tempTeacherName}
                    onChange={(e) => setTempTeacherName(e.target.value)}
                    placeholder="e.g. Mr. Julius Moenga"
                    className="w-full text-sm font-medium p-2.5 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition"
                  />
                </div>

                <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                  <button 
                    onClick={() => setSelectedClassAction(null)}
                    className="flex-1 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100 rounded-lg cursor-pointer transition border-none bg-transparent"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => handleUpdateTeacher(selectedClassAction)}
                    className="flex-1 py-2 text-sm font-medium text-white bg-[#C20F47] hover:bg-[#3D1D3F] rounded-lg cursor-pointer shadow-sm transition border-none"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
