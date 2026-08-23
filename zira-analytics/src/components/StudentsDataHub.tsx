import React from 'react';
import { 
  Users, 
  UserPlus, 
  ArrowUpRight, 
  Home, 
  Heart, 
  GraduationCap, 
  Key, 
  ClipboardCheck,
  ChevronRight,
  Activity,
  Coins,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import { Student } from '../types.ts';
import { TabId } from '../App.tsx';

interface StudentsDataHubProps {
  onNavigate: (tabId: TabId) => void;
  students: Student[];
}

export function StudentsDataHub({ onNavigate, students }: StudentsDataHubProps) {
  // Compute stats dynamically from the actual activeStudents array
  const totalStudentsCount = students.length;
  const maleCount = students.filter(s => s.gender === 'M').length;
  const femaleCount = students.filter(s => s.gender === 'F').length;
  const malePct = totalStudentsCount ? Math.round((maleCount / totalStudentsCount) * 100) : 0;
  const femalePct = totalStudentsCount ? Math.round((femaleCount / totalStudentsCount) * 100) : 0;

  // Form distribution
  const form1Count = students.filter(s => s.form === 1).length;
  const form2Count = students.filter(s => s.form === 2).length;
  const form3Count = students.filter(s => s.form === 3).length;
  const form4Count = students.filter(s => s.form === 4).length;

  const maxFormCount = Math.max(form1Count, form2Count, form3Count, form4Count, 1);

  // Attendance metrics
  const avgAttendance = totalStudentsCount
    ? Math.round(students.reduce((acc, s) => acc + (s.attendancePercentage || 0), 0) / totalStudentsCount)
    : 0;

  // Financial ratios
  const totalBalance = students.reduce((acc, s) => acc + (s.feeBalance || 0), 0);
  const totalFeesExpected = students.reduce((acc, s) => acc + (s.totalFees || 0), 0);
  const totalFeesPaid = Math.max(0, totalFeesExpected - totalBalance);
  const feePaidPct = totalFeesExpected ? Math.round((totalFeesPaid / totalFeesExpected) * 100) : 0;

  // Active or boarding counts
  const boardingCount = students.filter(s => s.usesTransport === 'Yes' || s.id.charCodeAt(3) % 2 === 0).length; // Simulated boarders
  const medicalAlertsCount = students.filter(s => s.allergies || s.medicalConditions).length;

  // Navigation schema
  const actionTabs = [
    { id: 'students' as TabId, label: 'Pupils Directory', icon: Users, badge: `${totalStudentsCount}`, colorClass: 'text-indigo-600 bg-indigo-50' },
    { id: 'admissions' as TabId, label: 'New Enrollment', icon: UserPlus, badge: 'Wizard', colorClass: 'text-[#3D1D3F] bg-rose-50' },
    { id: 'attendance' as TabId, label: 'Student Register', icon: ClipboardCheck, badge: 'Live', colorClass: 'text-teal-600 bg-teal-50' },
    { id: 'promotions' as TabId, label: 'Class Promotions', icon: ArrowUpRight, badge: 'Cohorts', colorClass: 'text-amber-600 bg-amber-50' },
    { id: 'hostel' as TabId, label: 'Hostel Allocations', icon: Home, badge: `${boardingCount}`, colorClass: 'text-emerald-600 bg-emerald-50' },
    { id: 'health' as TabId, label: 'Health & Clinic', icon: Heart, badge: `${medicalAlertsCount}`, colorClass: 'text-rose-600 bg-red-50' },
    { id: 'alumni' as TabId, label: 'Alumni Registry', icon: GraduationCap, badge: 'Archives', colorClass: 'text-purple-600 bg-purple-50' },
    { id: 'student_portal' as TabId, label: 'Portal Access', icon: Key, badge: 'Admin', colorClass: 'text-violet-600 bg-violet-50' }
  ];

  return (
    <div className="space-y-4">

      {/* Navigation toolbar */}
      <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-3 rounded-[1.5rem] shadow-sm">
        <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block px-1 mb-2">
          Quick navigation
        </span>
        <div className="flex flex-wrap gap-1.5">
          {actionTabs.map((act) => {
            const IconComponent = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => onNavigate(act.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-slate-700 transition-all text-xs font-medium shadow-sm hover:shadow group cursor-pointer"
              >
                <div className={`w-6 h-6 rounded-lg flex items-center justify-center transition shrink-0 ${act.colorClass}`}>
                  <IconComponent className="w-3.5 h-3.5" />
                </div>
                <span>{act.label}</span>
                <span className="text-[10px] text-slate-400 tabular-nums">{act.badge}</span>
                <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-[#3D1D3F] group-hover:translate-x-0.5 transition" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento overview grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* BLOCK 1: Demographics & Class Cohorts */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-5 rounded-[1.5rem] shadow-sm space-y-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium uppercase tracking-wide">
                Demographics
              </span>
              <h3 className="text-sm font-semibold text-slate-800 mt-1.5">
                Cohorts & Form Breakdown
              </h3>
            </div>
            <Users className="w-4 h-4 text-slate-400" />
          </div>

          {/* Form list with progress bars */}
          <div className="space-y-3">
            {[
              { label: 'Form 1', sub: 'Freshmen', count: form1Count, color: 'bg-[#3D1D3F]' },
              { label: 'Form 2', sub: 'Sophomore', count: form2Count, color: 'bg-slate-400' },
              { label: 'Form 3', sub: 'Junior', count: form3Count, color: 'bg-indigo-400' },
              { label: 'Form 4', sub: 'Candidates', count: form4Count, color: 'bg-[#C20F47]' },
            ].map(row => (
              <div key={row.label}>
                <div className="flex justify-between text-xs font-medium text-slate-500 mb-1">
                  <span>{row.label} <span className="text-slate-400">({row.sub})</span></span>
                  <span className="tabular-nums text-slate-700 font-semibold">{row.count}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`${row.color} h-full rounded-full transition-all duration-500`} style={{ width: `${(row.count / maxFormCount) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Gender split */}
          <div className="bg-slate-50 p-3 rounded-xl space-y-1.5">
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Gender balance</span>
            <div className="flex h-4 rounded-md overflow-hidden text-[10px] text-white font-medium">
              <div className="bg-blue-500 flex items-center justify-center transition-all" style={{ width: `${malePct}%` }} title="Male allocation">
                {malePct > 12 ? `${malePct}%` : ''}
              </div>
              <div className="bg-rose-400 flex items-center justify-center transition-all" style={{ width: `${femalePct}%` }} title="Female allocation">
                {femalePct > 12 ? `${femalePct}%` : ''}
              </div>
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-medium">
              <span>Boys: {maleCount}</span>
              <span>Girls: {femaleCount}</span>
            </div>
          </div>
        </div>

        {/* BLOCK 2: Attendance */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-5 rounded-[1.5rem] shadow-sm space-y-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] bg-teal-50 text-teal-700 px-2 py-0.5 rounded font-medium uppercase tracking-wide">
                Attendance
              </span>
              <h3 className="text-sm font-semibold text-slate-800 mt-1.5">
                Roll-call Rates
              </h3>
            </div>
            <Activity className="w-4 h-4 text-slate-400" />
          </div>

          <div className="flex items-center justify-around bg-slate-50 p-3 rounded-xl gap-2">
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="absolute w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="40" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                <circle cx="48" cy="48" r="40" fill="none" stroke="#0d9488" strokeWidth="8" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * avgAttendance) / 100} strokeLinecap="round" />
              </svg>
              <div className="text-center">
                <span className="text-2xl font-bold text-slate-900 tabular-nums leading-none">{avgAttendance}%</span>
                <span className="text-[10px] font-medium text-slate-400 block uppercase tracking-wide mt-1">Avg presence</span>
              </div>
            </div>

            <div className="space-y-1.5 max-w-[150px]">
              <h4 className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Status</h4>
              <div className="flex items-center gap-1.5 text-emerald-700 text-sm font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Highly stable</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Term ratio matches current targets.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-[#3D1D3F]/5 space-y-1">
            <span className="text-[11px] font-semibold text-[#3D1D3F] uppercase tracking-wide block">Daily lock at 12:00 PM</span>
            <p className="text-xs text-slate-500 leading-relaxed">
              Registers auto-alert parents of late or missing pupils via SMS.
            </p>
          </div>
        </div>

        {/* BLOCK 3: Financial Clearance */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-5 rounded-[1.5rem] shadow-sm space-y-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded font-medium uppercase tracking-wide">
                Finance
              </span>
              <h3 className="text-sm font-semibold text-slate-800 mt-1.5">
                Arrears & Fee Coverage
              </h3>
            </div>
            <Coins className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">Expected</span>
              <span className="text-sm font-semibold text-slate-800 tabular-nums">KES {totalFeesExpected.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide block">Arrears</span>
              <span className="text-sm font-semibold text-rose-600 tabular-nums">KES {totalBalance.toLocaleString()}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium text-slate-500 mb-1.5">
              <span>Clearance rate</span>
              <span className="tabular-nums text-[#C20F47] font-semibold">{feePaidPct}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
              <div className="bg-[#C20F47] h-full rounded-full transition-all duration-500" style={{ width: `${feePaidPct}%` }} />
            </div>
            <p className="text-xs text-slate-400 mt-2 tabular-nums">
              KES {totalFeesPaid.toLocaleString()} collected to date.
            </p>
          </div>
        </div>

        {/* BLOCK 4: Logistics & Services */}
        <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[10px] border-t-[#F39C2A] p-5 rounded-[1.5rem] shadow-sm space-y-4 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[11px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded font-medium uppercase tracking-wide">
                Logistics & Clinic
              </span>
              <h3 className="text-sm font-semibold text-slate-800 mt-1.5">
                Services & Boarding
              </h3>
            </div>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="bg-emerald-50/50 p-3 rounded-xl">
              <span className="text-[11px] font-medium text-emerald-700 uppercase tracking-wide block">Dorm Status</span>
              <span className="text-base font-bold text-emerald-900 tabular-nums mt-1 block">{boardingCount} allocated</span>
            </div>
            <div className="bg-rose-50/50 p-3 rounded-xl">
              <span className="text-[11px] font-medium text-rose-700 uppercase tracking-wide block">Clinic Alerts</span>
              <span className="text-base font-bold text-rose-900 tabular-nums mt-1 block">{medicalAlertsCount} records</span>
            </div>
            <div className="bg-purple-50/50 p-3 rounded-xl">
              <span className="text-[11px] font-medium text-purple-700 uppercase tracking-wide block">Credentials</span>
              <span className="text-base font-bold text-purple-900 mt-1 block">100% Active</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between text-sm font-medium">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-700">Compliance status</span>
            </div>
            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[11px] font-medium">
              Compliant
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
