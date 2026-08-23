import React, { useState } from 'react';
import { 
  Users, 
  Wallet, 
  TrendingUp, 
  Layers,
  BookOpen,
  MapPin,
  Clock,
  PlusCircle,
  MessageSquare,
  ClipboardList,
  AlertTriangle,
  Stethoscope,
  Bus,
  ShieldCheck,
  X,
  ChevronRight,
  UserCheck,
  BookMarked,
  Smartphone
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
  LineChart,
  Line,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'react-hot-toast';
import { Student, Exam, FeeTransaction, SmsLog } from '../types.ts';
import { useCurrency } from '../contexts/CurrencyContext.tsx';

interface OverviewTabProps {
  students: Student[];
  exams: Exam[];
  transactions: FeeTransaction[];
  smsLogs: SmsLog[];
  teacherName?: string;
  teacherRole?: string;
  onNavigateTab?: (tab: any) => void;
}

interface AlertItem {
  id: string;
  type: 'fees' | 'health' | 'logistics' | 'security';
  title: string;
  message: string;
  score: string;
  severity: 'high' | 'medium' | 'low';
}

export function OverviewTab({ 
  students, 
  exams, 
  transactions, 
  smsLogs, 
  teacherName,
  teacherRole = 'School Admin',
  onNavigateTab 
}: OverviewTabProps) {
  const { currency } = useCurrency();

  // 1. Core States for interactivity
  const [activeChartType, setActiveChartType] = useState<'trajectory' | 'forecasting' | 'cumulative'>('trajectory');
  const [selectedAcademicYear, setSelectedAcademicYear] = useState<'2026' | '2025' | '2024'>('2026');
  const [activeDrawer, setActiveDrawer] = useState<'students' | 'staff' | 'collections' | 'arrears' | 'sections' | null>(null);
  const [selectedSectionType, setSelectedSectionType] = useState<'streams' | 'library' | 'transport' | 'income' | null>(null);
  const [quickSmsDraft, setQuickSmsDraft] = useState('');
  const [showQuickSmsModal, setShowQuickSmsModal] = useState(false);
  const [selectedStudentForSms, setSelectedStudentForSms] = useState<Student | null>(null);

  // Editable live systems alert states (Dismissible and Remedied live)
  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 'alert-1',
      type: 'fees',
      title: 'Tuition Arrears Threshold Alert',
      message: `14 candidates have outstanding Term 1 tuition balances exceeding ${currency} 30,000 threshold requirement.`,
      score: 'High Risk',
      severity: 'high'
    },
    {
      id: 'alert-2',
      type: 'health',
      title: 'Health Clinic Emergency rest note',
      message: 'Dennis Kiprop (ADM-2041) logged sick-bay symptom rest under nurse observation. Form 4 stream alerted.',
      score: 'Active Nurse Care',
      severity: 'medium'
    },
    {
      id: 'alert-3',
      type: 'logistics',
      title: 'Scheduled Courier Fleet loop',
      message: 'Fleet Vehicle bus Route B completed school loop transit cleared safety audit by driver Douglas Omari.',
      score: 'Cleared Safety',
      severity: 'low'
    },
    {
      id: 'alert-4',
      type: 'security',
      title: 'Cryptographic Snapshot Backup',
      message: 'Automatic systems database snapshots successfully compiled and locked onto decentralised cloud nodes.',
      score: 'Stable',
      severity: 'low'
    }
  ]);

  // Dynamic calculations based on live student rosters
  const totalStudents = students.length;
  const boysCount = students.filter(s => s.gender === 'M').length;
  const girlsCount = students.filter(s => s.gender === 'F').length;
  
  const activeExam = exams.find(e => e.status === 'active')?.name || '2026 Term 1 Exams';
  
  const totalFeesRequired = students.reduce((sum, s) => sum + s.totalFees, 0);
  const totalFeesPaid = students.reduce((sum, s) => sum + (s.totalFees - s.feeBalance), 0);
  const totalOutstandingBalance = totalFeesRequired - totalFeesPaid;
  const feeCollectionRate = totalFeesRequired > 0 ? Number(((totalFeesPaid / totalFeesRequired) * 100).toFixed(1)) : 0;

  // Format current live date
  const formattedToday = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Multivariable Trend calculations based on Academic Year context
  const getCollectionsTrendData = () => {
    switch (selectedAcademicYear) {
      case '2025':
        return [
          { name: 'Sep 25', collections: 420000, dues: 210000 },
          { name: 'Oct 25', collections: 490000, dues: 180000 },
          { name: 'Nov 25', collections: 530000, dues: 140005 },
          { name: 'Dec 25', collections: 210000, dues: 400000 },
          { name: 'Jan 26', collections: 610000, dues: 95000 },
          { name: 'Feb 26', collections: 680000, dues: 50000 }
        ];
      case '2024':
        return [
          { name: 'Sep 24', collections: 310000, dues: 150000 },
          { name: 'Oct 24', collections: 380000, dues: 120000 },
          { name: 'Nov 24', collections: 410000, dues: 90000 },
          { name: 'Dec 24', collections: 150000, dues: 300000 },
          { name: 'Jan 25', collections: 490000, dues: 70000 },
          { name: 'Feb 25', collections: 510000, dues: 45000 }
        ];
      case '2026':
      default:
        return [
          { name: 'Sep 25', collections: 110000, dues: 240000 },
          { name: 'Oct 25', collections: 180000, dues: 200000 },
          { name: 'Nov 25', collections: 230000, dues: 180000 },
          { name: 'Dec 25', collections: 80000, dues: 450000 },
          { name: 'Jan 26', collections: 520000, dues: 120000 },
          { name: 'Feb 26', collections: totalFeesPaid || 320000, dues: totalOutstandingBalance || 180000 }
        ];
    }
  };

  const handleShortcutClick = (tab: any) => {
    if (onNavigateTab) {
      onNavigateTab(tab);
    }
  };

  // Activity Log callback simulation
  const registerLogEventLocally = (action: string, category: string) => {
    const existingLogsStr = localStorage.getItem('zira_audit_logs');
    const existingLogs = existingLogsStr ? JSON.parse(existingLogsStr) : [];
    const newLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString().slice(0, 19).replace('T', ' '),
      user: teacherName || 'Principal Moenga',
      role: 'School Admin',
      action,
      module: category,
      ipAddress: '127.0.0.1 (LocalHost)'
    };
    localStorage.setItem('zira_audit_logs', JSON.stringify([newLog, ...existingLogs]));
  };

  // Actions on alerts
  const handleDismissAlert = (id: string, name: string) => {
    setAlerts(prev => prev.filter(item => item.id !== id));
    toast.success(`Acknowledged alert reference: "${name}"`, { icon: '🤝' });
    registerLogEventLocally(`Dismissed live dashboard alert card: "${name}"`, 'Security');
  };

  const handleRemedyAlert = (item: AlertItem) => {
    if (item.type === 'fees') {
      // Find top matching candidate for quick fees SMS reminder
      const topArrearsStudent = [...students]
        .sort((a, b) => b.feeBalance - a.feeBalance)[0];
      
      if (topArrearsStudent) {
        setSelectedStudentForSms(topArrearsStudent);
        setQuickSmsDraft(`Dear Guardian, this is an official ledger check from Karega Secondary for ADM ${topArrearsStudent.id}. Please clear the outstanding Term 1 balance of ${currency} ${topArrearsStudent.feeBalance.toLocaleString()} to avoid student ledger blockades. Respectfully, Karega Admin.`);
        setShowQuickSmsModal(true);
      } else {
        toast.error('Could not determine active candidates with outstanding balances.');
      }
    } else if (item.type === 'health') {
      toast(`Directing nurse to release updated clinical docket to student's parent portfolio...`, { icon: '🩺' });
      // update state
      setAlerts(prev => prev.map(a => a.id === item.id ? { ...a, message: 'Dennis Kiprop released back to dormitory stream. Active medication logged and synchronised in parental logbooks.', score: 'Dormitory Discharge' } : a));
      registerLogEventLocally(`Instructed clinical docket release for Dennis Kiprop (ADM-2041)`, 'HR');
    } else if (item.type === 'logistics') {
      toast.success('Dispatched real-time status GPS beacon directly to parents SMS registry.', { icon: '🚌' });
      registerLogEventLocally('Dispatched live logistics GPS carrier loop verification', 'HR');
    } else if (item.type === 'security') {
      toast.success('Full system health diagnostics passed! Database indices match the current Firestore registers.', { icon: '🛡️' });
    }
  };

  const handleSendQuickSms = () => {
    if (!quickSmsDraft.trim()) {
      toast.error('SMS broadcast draft cannot be empty.');
      return;
    }
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1200)),
      {
        loading: 'Interfacing carrier gateway and broadcasting custom SMS...',
        success: 'SMS dispatched successfully! Parents notified.',
        error: 'Network timeout.'
      }
    );
    setShowQuickSmsModal(false);
    registerLogEventLocally(`Dispatched prompt security SMS reminder to guardian of ${selectedStudentForSms?.name}`, 'Finance');
  };

  // Modern simulated staff roster representation
  const staffRosterList = [
    { name: 'Julius Moenga', role: 'Principal / Administrator', specialty: 'Mathematics & Chemistry' },
    { name: 'Gitumu Delson', role: 'Director of Studies / Academic Head', specialty: 'Physics & Geography' },
    { name: 'Nyaloti Esther', role: 'Bursar / Accounts Lead', specialty: 'Administration & Finance' },
    { name: 'Muguro K', role: 'Senior Master / Head Discipline', specialty: 'Christian Religious Education' },
    { name: 'Wambua J', role: 'Language Dept Head / Master', specialty: 'English Literature & Kiswahili' },
  ];

  return (
    <div className="space-y-5">

      {/* ── ROW 1: 4 KPI headline tiles ──────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Students */}
        <div
          id="overview-card-students"
          className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-violet-50 flex items-center justify-center border border-violet-100 shrink-0">
              <Users className="w-4 h-4 text-violet-600" />
            </div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Enrolled</span>
          </div>
          <p className="text-[28px] font-bold text-slate-900 mt-2 leading-none tabular-nums">{totalStudents}</p>
          <p className="text-xs text-slate-400 mt-1.5 font-normal">{boysCount} boys · {girlsCount} girls</p>
        </div>

        {/* Fee clearance rate */}
        <div
          id="overview-card-clearance"
          className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="relative w-8 h-8 shrink-0">
              <svg className="w-8 h-8 -rotate-90">
                <circle cx="16" cy="16" r="12" stroke="#f1f5f9" strokeWidth="3.5" fill="transparent" />
                <circle cx="16" cy="16" r="12" stroke="#10b981" strokeWidth="3.5" fill="transparent"
                  strokeDasharray={2 * Math.PI * 12}
                  strokeDashoffset={2 * Math.PI * 12 * (1 - Math.min(feeCollectionRate, 100) / 100)}
                  strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-emerald-700 tabular-nums">{feeCollectionRate}%</span>
            </div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Clearance</span>
          </div>
          <p className="text-[28px] font-bold text-slate-900 mt-2 leading-none tabular-nums">{feeCollectionRate}%</p>
          <p className="text-xs text-emerald-600 mt-1.5 font-medium">Term target pace</p>
        </div>

        {/* Net fees collected */}
        <div
          id="overview-card-revenue"
          className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100 shrink-0">
              <Wallet className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Collected</span>
          </div>
          <p className="text-[22px] font-bold text-slate-900 mt-2 leading-none tabular-nums truncate">{currency} {totalFeesPaid.toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1.5 font-normal tabular-nums">Due: {currency} {totalOutstandingBalance.toLocaleString()}</p>
        </div>

        {/* Syllabus */}
        <div
          id="overview-card-syllabus"
          className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] px-5 py-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 shrink-0">
              <BookOpen className="w-4 h-4 text-indigo-500" />
            </div>
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Syllabus</span>
          </div>
          <p className="text-[28px] font-bold text-slate-900 mt-2 leading-none tabular-nums">73.5%</p>
          <p className="text-xs text-slate-400 mt-1.5 font-normal">Math 82% · Eng 79%</p>
        </div>

      </div>

      {/* ── ROW 2: Bento — Attendance + Radar + Fees meter ─────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Attendance card */}
        <div
          onClick={() => {
            setActiveDrawer(activeDrawer === 'students' ? null : 'students');
            registerLogEventLocally('Opened detailed student attendance register logbook', 'Attendance');
          }}
          className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute inset-x-0 bottom-0 h-28 opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Mon', attendance: 92 }, { name: 'Tue', attendance: 95 },
                { name: 'Wed', attendance: 91 }, { name: 'Thu', attendance: 96 },
                { name: 'Fri', attendance: 94 }, { name: 'Sat', attendance: 97 },
                { name: 'Sun', attendance: 95 }
              ]} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="attGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="attendance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#attGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">Attendance</span>
              <div className="w-7 h-7 bg-emerald-50 rounded-lg flex items-center justify-center border border-emerald-100">
                <Users className="w-3.5 h-3.5 text-emerald-600" />
              </div>
            </div>
            <p className="text-[30px] font-bold text-slate-900 leading-none">94.2%</p>
            <p className="text-xs text-emerald-600 font-medium mt-1">Daily average · benchmark cleared</p>

            <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide">Present</p>
                <p className="text-lg font-bold text-slate-800 tabular-nums mt-0.5">182</p>
              </div>
              <div>
                <p className="text-[11px] text-slate-400 uppercase tracking-wide">Absent</p>
                <p className="text-lg font-bold text-rose-600 tabular-nums mt-0.5">14</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-3 group-hover:text-emerald-600 transition-colors flex items-center gap-1">
              Open register <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </div>

        {/* Academic radar */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Subject performance</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">Strength Radar</p>
            </div>
            <span className="px-2 py-0.5 bg-indigo-50 border border-indigo-100 text-indigo-700 rounded-md text-[11px] font-medium">Avg: B−</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="72%"
                data={[
                  { subject: 'Math', A: 84, fullMark: 100 },
                  { subject: 'English', A: 78, fullMark: 100 },
                  { subject: 'Kiswahili', A: 68, fullMark: 100 },
                  { subject: 'Science', A: 89, fullMark: 100 },
                  { subject: 'History', A: 74, fullMark: 100 }
                ]}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 10, fontWeight: '500' }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 8 }} />
                <Radar name="Cohort" dataKey="A" stroke="#4f46e5" fill="#818cf8" fillOpacity={0.5} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #e2e8f0' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="pt-3 border-t border-slate-100 flex justify-between items-center">
            <p className="text-xs text-slate-400">Science leads · Kiswahili developing</p>
            <button onClick={() => handleShortcutClick('academic')} className="text-xs font-medium text-indigo-600 hover:underline cursor-pointer bg-transparent border-none p-0">Analysis →</button>
          </div>
        </div>

        {/* Fee coverage meter */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm">
          <div className="mb-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Fee coverage</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">Collections vs Arrears</p>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-xs font-medium text-slate-500">Collected</span>
                <span className="text-xs font-semibold text-emerald-700 tabular-nums">{currency} {totalFeesPaid.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${Math.min(feeCollectionRate, 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-xs font-medium text-slate-500">Target</span>
                <span className="text-xs font-semibold text-slate-600 tabular-nums">{currency} {totalFeesRequired.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full">
                <div className="bg-slate-300 h-full rounded-full w-full" />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <span className="text-xs font-medium text-slate-500">Arrears</span>
                <span className="text-xs font-semibold text-rose-700 tabular-nums">{currency} {totalOutstandingBalance.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-rose-400 h-full rounded-full transition-all" style={{ width: `${Math.min(100 - feeCollectionRate, 100)}%` }} />
              </div>
            </div>
          </div>
          <div className="pt-4 border-t border-slate-100 mt-4 flex justify-between items-center">
            <p className="text-xs text-slate-400">Recovery stable</p>
            <button onClick={() => handleShortcutClick('finance')} className="text-xs font-medium text-[#C20F47] hover:underline cursor-pointer bg-transparent border-none p-0">Invoicing →</button>
          </div>
        </div>

      </div>

      {/* ── ROW 3: 4 interactive KPI tiles (click-to-expand drawers) ─ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Students tile */}
        <motion.div
          onClick={() => { setActiveDrawer(activeDrawer === 'students' ? null : 'students'); registerLogEventLocally('Opened Core Candidates tray', 'Student Info'); }}
          whileHover={{ scale: 1.01 }}
          className={`border-x-2 border-b-2 rounded-[1.5rem] px-5 py-4 shadow-sm cursor-pointer relative overflow-hidden group transition-all ${
            activeDrawer === 'students'
              ? 'border-[#C20F47] border-t-[14px] border-t-[#C20F47] bg-violet-50/30'
              : 'border-[#C20F47] border-t-[10px] border-t-[#F39C2A] bg-white hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <Users className="w-3.5 h-3.5 text-indigo-600" />
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 ${activeDrawer === 'students' ? 'rotate-90 text-[#C20F47]' : ''}`} />
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Students</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 leading-none tabular-nums">{totalStudents}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded font-medium tabular-nums">{boysCount}B</span>
            <span className="text-[10px] bg-pink-50 text-pink-700 px-1.5 py-0.5 rounded font-medium tabular-nums">{girlsCount}G</span>
          </div>
        </motion.div>

        {/* Staff tile */}
        <motion.div
          onClick={() => { setActiveDrawer(activeDrawer === 'staff' ? null : 'staff'); registerLogEventLocally('Opened Staff Roster tray', 'HR'); }}
          whileHover={{ scale: 1.01 }}
          className={`border-x-2 border-b-2 rounded-[1.5rem] px-5 py-4 shadow-sm cursor-pointer relative overflow-hidden group transition-all ${
            activeDrawer === 'staff'
              ? 'border-[#C20F47] border-t-[14px] border-t-[#C20F47] bg-emerald-50/30'
              : 'border-[#C20F47] border-t-[10px] border-t-[#F39C2A] bg-white hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 ${activeDrawer === 'staff' ? 'rotate-90 text-[#C20F47]' : ''}`} />
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Faculty</p>
          <p className="text-2xl font-bold text-slate-900 mt-1 leading-none">5</p>
          <p className="text-xs text-emerald-600 font-medium mt-2">Senior officers</p>
        </motion.div>

        {/* Collections tile */}
        <motion.div
          onClick={() => { setActiveDrawer(activeDrawer === 'collections' ? null : 'collections'); registerLogEventLocally('Opened Fee collections tray', 'Finance'); }}
          whileHover={{ scale: 1.01 }}
          className={`border-x-2 border-b-2 rounded-[1.5rem] px-5 py-4 shadow-sm cursor-pointer relative overflow-hidden group transition-all ${
            activeDrawer === 'collections'
              ? 'border-[#C20F47] border-t-[14px] border-t-[#C20F47] bg-teal-50/30'
              : 'border-[#C20F47] border-t-[10px] border-t-[#F39C2A] bg-white hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-100 flex items-center justify-center">
              <Wallet className="w-3.5 h-3.5 text-teal-600" />
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 ${activeDrawer === 'collections' ? 'rotate-90 text-[#C20F47]' : ''}`} />
          </div>
          <p className="text-xs text-slate-400 uppercase tracking-wide font-medium">Fees Paid</p>
          <p className="text-lg font-bold text-slate-900 mt-1 leading-none tabular-nums truncate">{currency} {totalFeesPaid.toLocaleString()}</p>
          <p className="text-xs text-emerald-600 font-medium mt-2 tabular-nums">{feeCollectionRate}% collected</p>
        </motion.div>

        {/* Arrears tile */}
        <motion.div
          onClick={() => { setActiveDrawer(activeDrawer === 'arrears' ? null : 'arrears'); registerLogEventLocally('Opened Arrears tray', 'Finance'); }}
          whileHover={{ scale: 1.01 }}
          className={`border-x-2 border-b-2 rounded-[1.5rem] px-5 py-4 shadow-sm cursor-pointer relative overflow-hidden group transition-all ${
            activeDrawer === 'arrears'
              ? 'border-[#C20F47] border-t-[14px] border-t-[#C20F47] bg-rose-50/30'
              : 'border-[#C20F47] border-t-[10px] border-t-[#F39C2A] bg-white hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="w-7 h-7 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
            </div>
            <ChevronRight className={`w-3.5 h-3.5 text-slate-300 transition-transform group-hover:translate-x-0.5 ${activeDrawer === 'arrears' ? 'rotate-90 text-[#C20F47]' : ''}`} />
          </div>
          <p className="text-xs text-[#C20F47] uppercase tracking-wide font-medium">Arrears</p>
          <p className="text-lg font-bold text-rose-800 mt-1 leading-none tabular-nums truncate">{currency} {totalOutstandingBalance.toLocaleString()}</p>
          <p className="text-xs text-rose-500 font-medium mt-2">High-risk review</p>
        </motion.div>

      </div>

      {/* ── DRAWERS ────────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {activeDrawer && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-slate-50 border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl p-4 shadow-inner"
          >
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C20F47] animate-pulse" />
                <p className="text-sm font-semibold text-slate-800">
                  {activeDrawer === 'students' && 'Student Roster'}
                  {activeDrawer === 'staff' && 'Faculty Registry'}
                  {activeDrawer === 'collections' && 'Fee Transactions'}
                  {activeDrawer === 'arrears' && 'Arrears Recovery'}
                </p>
              </div>
              <button onClick={() => setActiveDrawer(null)} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition cursor-pointer border-none bg-transparent">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {activeDrawer === 'students' && (
              <div>
                <p className="text-xs text-slate-500 mb-3">Click any student to send a parent SMS.</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-56 overflow-y-auto pr-1">
                  {students.map(std => (
                    <div
                      key={std.id}
                      onClick={() => {
                        setSelectedStudentForSms(std);
                        setQuickSmsDraft(`Hi parent of ${std.name}. Attendance update for ADM ${std.id}: Term 1 attendance is ${std.attendancePercentage}%.`);
                        setShowQuickSmsModal(true);
                      }}
                      className="bg-white p-3 rounded-xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] hover:bg-indigo-50/20 cursor-pointer transition"
                    >
                      <p className="text-[10px] text-slate-400 tabular-nums font-medium">{std.id}</p>
                      <p className="text-sm font-semibold text-slate-900 mt-0.5 line-clamp-1">{std.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Form {std.form} {std.stream}</p>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                        <span className="text-[11px] font-medium text-indigo-600 tabular-nums">{std.attendancePercentage}%</span>
                        <MessageSquare className="w-3 h-3 text-slate-300" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeDrawer === 'staff' && (
              <div>
                <p className="text-xs text-slate-500 mb-3">Primary administrators on active credentials.</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {staffRosterList.map((st, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-[#C20F47] font-semibold text-sm shrink-0">
                        {st.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 leading-none truncate">{st.name}</p>
                        <p className="text-xs text-emerald-700 font-medium mt-0.5 truncate">{st.role}</p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">{st.specialty}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeDrawer === 'collections' && (
              <div>
                <p className="text-xs text-slate-500 mb-3">Recent fee transactions from the ledger.</p>
                <div className="bg-white rounded-xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
                        <th className="px-4 py-2.5">Reference</th>
                        <th className="px-4 py-2.5">Student</th>
                        <th className="px-4 py-2.5">Method</th>
                        <th className="px-4 py-2.5">Date</th>
                        <th className="px-4 py-2.5 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {transactions.slice(0, 5).map((tx, idx) => (
                        <tr key={tx.id || idx} className="hover:bg-slate-50/50">
                          <td className="px-4 py-2.5 text-purple-700 tabular-nums font-medium">{tx.reference || 'MP-202611A'}</td>
                          <td className="px-4 py-2.5 font-semibold text-slate-900 whitespace-nowrap">{tx.studentName}</td>
                          <td className="px-4 py-2.5"><span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 border border-sky-100 rounded text-[10px] font-medium">{tx.type}</span></td>
                          <td className="px-4 py-2.5 text-slate-400 tabular-nums">{tx.date}</td>
                          <td className="px-4 py-2.5 text-right text-emerald-600 tabular-nums font-semibold">{currency} {tx.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                      {transactions.length === 0 && (
                        <tr><td colSpan={5} className="py-6 text-center text-slate-400">No transactions in this session.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeDrawer === 'arrears' && (
              <div>
                <p className="text-xs text-slate-500 mb-3">Students with the highest outstanding balances.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {[...students].filter(s => s.feeBalance > 0).sort((a, b) => b.feeBalance - a.feeBalance).slice(0, 6).map(std => {
                    const pct = std.totalFees > 0 ? Math.round((std.feeBalance / std.totalFees) * 100) : 0;
                    return (
                      <div key={std.id} className="bg-white p-3 rounded-xl border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] bg-red-50 text-red-700 border border-red-100 rounded px-1.5 py-0.5 font-medium tabular-nums">{pct}% due</span>
                          <span className="text-[10px] text-slate-400 tabular-nums">{std.id}</span>
                        </div>
                        <p className="text-sm font-semibold text-slate-900 leading-none">{std.name}</p>
                        <p className="text-xs text-slate-400">Form {std.form} {std.stream}</p>
                        <div className="bg-red-50 p-2 rounded-lg flex justify-between items-center">
                          <span className="text-xs text-slate-500">Balance</span>
                          <span className="text-xs font-semibold text-red-700 tabular-nums">{currency} {std.feeBalance.toLocaleString()}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedStudentForSms(std);
                            setQuickSmsDraft(`Dear Guardian, this is an official reminder from Karega Secondary for ADM ${std.id}. Please clear the outstanding balance of ${currency} ${std.feeBalance.toLocaleString()}. — Karega Admin.`);
                            setShowQuickSmsModal(true);
                          }}
                          className="w-full py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg transition cursor-pointer"
                        >
                          SMS Guardian
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── ROW 4: Quick Actions + Alerts side-by-side ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Quick actions */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Quick actions</p>
          <div className="grid grid-cols-2 gap-2.5">
            {[
              { tab: 'admissions', icon: PlusCircle, label: 'Admit Student', sub: 'Enrolment desk', color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
              { tab: 'finance', icon: Wallet, label: 'Record Payment', sub: 'Finance ledger', color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
              { tab: 'sms', icon: MessageSquare, label: 'Send SMS', sub: 'Parent dispatch', color: 'text-purple-600 bg-purple-50 border-purple-100' },
              { tab: 'attendance', icon: ClipboardList, label: 'Attendance', sub: 'Pupil register', color: 'text-amber-600 bg-amber-50 border-amber-100' },
            ].map(({ tab, icon: Icon, label, sub, color }) => (
              <button
                key={tab}
                onClick={() => handleShortcutClick(tab)}
                className="flex items-center gap-3 p-3 bg-white hover:bg-slate-50 border border-slate-100 rounded-xl text-left cursor-pointer transition hover:shadow-sm hover:-translate-y-px"
              >
                <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800 leading-tight truncate">{label}</p>
                  <p className="text-xs text-slate-400 font-normal mt-0.5 truncate">{sub}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* System alerts */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#C20F47]" />
              <p className="text-xs font-medium text-slate-800 uppercase tracking-wide">System Alerts</p>
            </div>
            <button
              onClick={() => {
                toast.success('All warning indices checked. Baseline healthy!');
                registerLogEventLocally('Executed diagnostic scan', 'Security');
              }}
              className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg transition cursor-pointer"
            >
              Run Scan
            </button>
          </div>
          <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
            <AnimatePresence>
              {alerts.map(item => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className={`flex items-start gap-2.5 p-3 rounded-xl border ${
                    item.severity === 'high' ? 'bg-rose-50 border-rose-100' :
                    item.severity === 'medium' ? 'bg-amber-50 border-amber-100' :
                    'bg-emerald-50/50 border-emerald-100'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {item.type === 'fees' && <Wallet className="w-3.5 h-3.5 text-rose-500" />}
                    {item.type === 'health' && <Stethoscope className="w-3.5 h-3.5 text-amber-500" />}
                    {item.type === 'logistics' && <Bus className="w-3.5 h-3.5 text-emerald-600" />}
                    {item.type === 'security' && <ShieldCheck className="w-3.5 h-3.5 text-indigo-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs font-semibold text-slate-800 leading-none">{item.title}</p>
                      <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        item.severity === 'high' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'
                      }`}>{item.score}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{item.message}</p>
                    <div className="flex gap-1.5 mt-1.5">
                      <button onClick={() => handleRemedyAlert(item)} className="text-[10px] font-medium text-slate-600 hover:text-slate-900 underline cursor-pointer bg-transparent border-none p-0">Remedy</button>
                      <span className="text-slate-200">·</span>
                      <button onClick={() => handleDismissAlert(item.id, item.title)} className="text-[10px] font-medium text-slate-400 hover:text-slate-600 underline cursor-pointer bg-transparent border-none p-0">Dismiss</button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {alerts.length === 0 && (
                <div className="py-8 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-xl">
                  No active alerts — workspace clean
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>

      {/* ── ROW 5: Fee collection chart ────────────────────────────── */}
      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-3">
          <div>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Fee collections</p>
            <p className="text-sm font-semibold text-slate-800 mt-0.5">Collections vs Pending Arrears</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              {(['trajectory', 'forecasting', 'cumulative'] as const).map((type, i) => (
                <button
                  key={type}
                  onClick={() => setActiveChartType(type)}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition cursor-pointer border-none ${
                    activeChartType === type ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700 bg-transparent'
                  }`}
                >
                  {['Bar', 'Area', 'Line'][i]}
                </button>
              ))}
            </div>
            <select
              value={selectedAcademicYear}
              onChange={e => {
                setSelectedAcademicYear(e.target.value as any);
                toast.success(`Showing ${e.target.value} data`);
                registerLogEventLocally(`Switched chart to Year ${e.target.value}`, 'Finance');
              }}
              className="text-xs font-medium text-slate-600 border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-none cursor-pointer"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
          </div>
        </div>
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            {activeChartType === 'trajectory' ? (
              <BarChart data={getCollectionsTrendData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #e2e8f0' }} cursor={{ fill: '#f8fafc' }} />
                <Legend verticalAlign="top" height={32} iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="collections" fill="#C20F47" name="Collected" radius={[4, 4, 0, 0]} />
                <Bar dataKey="dues" fill="#6366f1" name="Pending" radius={[4, 4, 0, 0]} />
              </BarChart>
            ) : activeChartType === 'forecasting' ? (
              <AreaChart data={getCollectionsTrendData()}>
                <defs>
                  <linearGradient id="gColl" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C20F47" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#C20F47" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gDues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #e2e8f0' }} />
                <Legend verticalAlign="top" height={32} iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="collections" stroke="#C20F47" fillOpacity={1} fill="url(#gColl)" name="Collected" />
                <Area type="monotone" dataKey="dues" stroke="#6366f1" fillOpacity={1} fill="url(#gDues)" name="Pending" />
              </AreaChart>
            ) : (
              <LineChart data={getCollectionsTrendData()}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={10} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ fontSize: 11, borderRadius: 10, border: '1px solid #e2e8f0' }} />
                <Legend verticalAlign="top" height={32} iconType="circle" iconSize={7} wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="collections" stroke="#C20F47" strokeWidth={2} dot={false} name="Collected" />
                <Line type="monotone" dataKey="dues" stroke="#6366f1" strokeWidth={2} dot={false} strokeDasharray="4 2" name="Pending" />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── ROW 6: Inventory bar + expandable panel ─────────────────── */}
      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-3">Academic streams & inventory</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {[
            { type: 'streams' as const, icon: Layers, label: '4 Streams', sub: 'Classes', color: 'bg-indigo-50 border-indigo-100 text-indigo-600' },
            { type: 'library' as const, icon: BookMarked, label: '5 Books', sub: 'Library', color: 'bg-emerald-50 border-emerald-100 text-emerald-600' },
            { type: 'transport' as const, icon: MapPin, label: '1 Route', sub: 'Transport', color: 'bg-sky-50 border-sky-100 text-sky-600' },
            { type: 'income' as const, icon: Wallet, label: '95%', sub: 'Collection rate', color: 'bg-amber-50 border-amber-100 text-amber-600' },
          ].map(({ type, icon: Icon, label, sub, color }) => (
            <button
              key={type}
              onClick={() => {
                setSelectedSectionType(selectedSectionType === type ? null : type);
                registerLogEventLocally(`Viewed ${type} shortcuts`, 'Academics');
              }}
              className={`flex items-center gap-2.5 p-3 rounded-xl border cursor-pointer transition text-left ${
                selectedSectionType === type
                  ? 'bg-amber-50 border-amber-300 shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 ${color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800 leading-none truncate">{label}</p>
                <p className="text-xs text-slate-400 mt-0.5 truncate">{sub}</p>
              </div>
            </button>
          ))}
          <button
            onClick={() => toast('0 books issued today.', { icon: 'ℹ️' })}
            className="flex items-center gap-2.5 p-3 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 cursor-pointer transition text-left col-span-2 sm:col-span-1"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-800 leading-none">0 Issued</p>
              <p className="text-xs text-slate-400 mt-0.5">Books lent today</p>
            </div>
          </button>
        </div>

        {/* Expandable section panel */}
        <AnimatePresence mode="wait">
          {selectedSectionType && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-3 pt-3 border-t border-slate-100"
            >
              <div className="flex justify-between items-center mb-2.5">
                <p className="text-xs font-semibold text-slate-700">
                  {selectedSectionType === 'streams' && 'Form Classes & Streams'}
                  {selectedSectionType === 'library' && 'Curriculum Textbooks'}
                  {selectedSectionType === 'transport' && 'Fleet Transit'}
                  {selectedSectionType === 'income' && 'Payment Channels'}
                </p>
                <button onClick={() => setSelectedSectionType(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer border-none bg-transparent p-0">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {selectedSectionType === 'streams' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['Form 1', 'Form 2', 'Form 3', 'Form 4'].map(f => (
                    <div key={f} className="p-2.5 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-lg">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">{f}</p>
                      <p className="text-xs font-semibold text-slate-800 mt-0.5">{f} East · {f} West</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedSectionType === 'library' && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {[
                    { title: 'Secondary Biology', pub: 'K.L.B Ed. 4' },
                    { title: 'Adventures of Lwanda Magere', pub: 'Literature' },
                    { title: 'Calculus Foundations', pub: 'Oxford 2024' },
                    { title: 'Comprehensive Agriculture', pub: 'Form 4' },
                    { title: 'Golden Bells Hymnal', pub: 'Inter-denom.' },
                  ].map(b => (
                    <div key={b.title} className="p-2.5 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-lg">
                      <p className="text-xs font-semibold text-slate-800 leading-snug">{b.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{b.pub}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedSectionType === 'transport' && (
                <div className="p-3 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#C20F47]">Nairobi GPO Route Loop B</p>
                    <p className="text-xs text-slate-400 mt-0.5">Nairobi Central → Rongai → Karega High Campus</p>
                  </div>
                  <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-md">Driver IN</span>
                </div>
              )}

              {selectedSectionType === 'income' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { label: 'M-Pesa Till', val: '65%' },
                    { label: 'Co-op Bank', val: '30%' },
                    { label: 'Cash Registry', val: '5%' },
                    { label: 'Arrears', val: `${currency} ${totalOutstandingBalance.toLocaleString()}`, red: true },
                  ].map(item => (
                    <div key={item.label} className="p-2.5 bg-white border-x-2 border-b-2 border-[#C20F47] border-t-4 border-t-[#F39C2A] rounded-lg">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide">{item.label}</p>
                      <p className={`text-sm font-semibold mt-0.5 tabular-nums ${item.red ? 'text-red-700' : 'text-slate-800'}`}>{item.val}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── ROW 7: Bottom 3-col widgets ────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Roadmap gauge */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium bg-amber-50 text-amber-700 border border-amber-100 px-2 py-0.5 rounded-md uppercase tracking-wide">Term 2 Goals</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 mt-1.5">Syllabus Milestones</p>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">Academic calendar velocity</p>

          <div className="flex flex-col items-center">
            <svg className="w-40 h-20" viewBox="0 0 100 50">
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="#f1f5f9" strokeWidth="10" strokeLinecap="round" />
              <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="url(#roadmapGrad)" strokeWidth="10" strokeLinecap="round" strokeDasharray="125.6" strokeDashoffset="31.4" />
              <defs>
                <linearGradient id="roadmapGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3D1D3F" />
                  <stop offset="100%" stopColor="#C20F47" />
                </linearGradient>
              </defs>
              <circle cx="10" cy="50" r="2.5" fill="#3D1D3F" />
              <circle cx="50" cy="10" r="3" fill="#C20F47" className="animate-ping opacity-60" />
              <circle cx="50" cy="10" r="2.5" fill="#C20F47" />
              <circle cx="90" cy="50" r="2.5" fill="#cbd5e1" />
            </svg>
            <div className="text-center -mt-4">
              <p className="text-2xl font-bold text-slate-900 tabular-nums">75.2%</p>
              <p className="text-xs text-emerald-600 font-medium">On schedule</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs border-t border-slate-100 pt-3 mt-4">
            {[{ l: 'Done', v: '12 Ch.', c: 'text-slate-700' }, { l: 'Review', v: '3 Topics', c: 'text-[#3D1D3F]' }, { l: 'Target', v: 'Oct 15', c: 'text-amber-600' }].map(({ l, v, c }) => (
              <div key={l}>
                <p className="text-slate-400 uppercase tracking-wide text-[10px]">{l}</p>
                <p className={`font-semibold mt-0.5 ${c}`}>{v}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Admissions funnel */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 rounded-md uppercase tracking-wide">2026 Intake</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 mt-1.5">Admissions Pipeline</p>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">Prospects → enrolled</p>

          <div className="space-y-2">
            {[
              { label: 'Inquiries', count: 520, pct: 100, color: '#3D1D3F' },
              { label: 'CAT Entrance', count: 384, pct: 73, color: '#C20F47' },
              { label: 'Form 1 Enrolled', count: 218, pct: 41, color: '#d97706' },
              { label: 'Fees Cleared', count: 132, pct: 25, color: '#f1f5f9', text: '#d97706' },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>{row.label}</span>
                  <span className="tabular-nums">{row.count} ({row.pct}%)</span>
                </div>
                <div className="h-5 rounded-md overflow-hidden" style={{ width: `${row.pct}%`, backgroundColor: row.color }}>
                  <div className="h-full flex items-center justify-center">
                    <span className="text-[10px] font-medium tabular-nums" style={{ color: row.text || '#fff' }}>{row.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-slate-400 mt-3 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            High conversion from CAT registrations
          </p>
        </div>

        {/* Academic leaderboard */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] rounded-[1.5rem] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-medium bg-emerald-50 text-emerald-800 border border-emerald-100 px-2 py-0.5 rounded-md uppercase tracking-wide">Honor Roll</span>
          </div>
          <p className="text-sm font-semibold text-slate-800 mt-1.5">Academic Leaderboard</p>
          <p className="text-xs text-slate-400 mt-0.5 mb-4">Term cumulative ranking</p>

          <div className="space-y-3">
            {[
              { init: 'EM', name: 'Emmanuel Mutua', score: 89.4, stream: 'Form 4W', bar: '#3D1D3F' },
              { init: 'LW', name: 'Lydia Wanjiku', score: 86.2, stream: 'Form 3E', bar: '#f59e0b' },
              { init: 'PK', name: 'Pius Kiprop', score: 84.7, stream: 'Form 4E', bar: '#10b981' },
              { init: 'AM', name: 'Alex Mwabili', score: 82.1, stream: 'Form 2W', bar: '#94a3b8' },
            ].map((s, i) => (
              <div key={s.name} className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 text-white" style={{ backgroundColor: s.bar }}>
                  {s.init}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <p className="text-xs font-semibold text-slate-900 leading-none truncate">{s.name}</p>
                    <p className="text-xs font-bold text-slate-800 tabular-nums ml-2 shrink-0">{s.score}%</p>
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="flex-1 bg-slate-100 h-1 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${s.score}%`, backgroundColor: s.bar }} />
                    </div>
                    <span className="text-[10px] font-medium shrink-0" style={{ color: s.bar }}>{s.stream}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => toast('Honor roll reporting is being configured.', { icon: '🏆' })}
            className="w-full text-center text-[11px] font-medium text-slate-400 hover:text-[#3D1D3F] transition cursor-pointer mt-4 pt-3 border-t border-slate-100 bg-transparent border-none block"
          >
            View full honor roll →
          </button>
        </div>

      </div>

      {/* ── SMS MODAL ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {showQuickSmsModal && selectedStudentForSms && (
          <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl p-5 max-w-md w-full shadow-2xl relative"
            >
              <button
                onClick={() => setShowQuickSmsModal(false)}
                className="text-slate-400 hover:text-slate-600 absolute right-4 top-4 hover:bg-slate-100 p-1.5 rounded-lg cursor-pointer border-none bg-transparent"
              >
                <X className="w-4 h-4" />
              </button>

              <span className="text-[10px] font-medium bg-purple-50 text-purple-700 border border-purple-100 rounded-full px-2.5 py-0.5 uppercase tracking-wide">Safaricom Gateway</span>
              <h3 className="text-base font-semibold text-slate-900 mt-2">Send Parent SMS</h3>
              <p className="text-xs text-slate-400 mt-0.5 mb-4">Direct message to student's guardian</p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mb-4">
                <p className="text-[10px] text-slate-400 uppercase tracking-wide">Recipient</p>
                <p className="text-sm font-semibold text-slate-800 mt-0.5">
                  {selectedStudentForSms.guardianName || 'Parent of ' + selectedStudentForSms.name}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{selectedStudentForSms.guardianPhone || '+254712345678'} · {selectedStudentForSms.name} (ADM {selectedStudentForSms.id})</p>
              </div>

              <div className="space-y-1.5 mb-4">
                <label className="block text-xs font-medium text-slate-500">Message</label>
                <textarea
                  rows={4}
                  value={quickSmsDraft}
                  onChange={e => setQuickSmsDraft(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-normal focus:outline-none focus:bg-white focus:border-[#C20F47] text-slate-800 leading-relaxed resize-none"
                  placeholder="Enter message..."
                />
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>{quickSmsDraft.length} chars</span>
                  <span>1 SMS segment</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowQuickSmsModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-600 cursor-pointer border-none"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendQuickSms}
                  className="px-4 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white rounded-lg text-sm font-medium transition flex items-center gap-1.5 cursor-pointer border-none shadow-sm shadow-[#C20F47]/20"
                >
                  <Smartphone className="w-3.5 h-3.5" /> Send SMS
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
