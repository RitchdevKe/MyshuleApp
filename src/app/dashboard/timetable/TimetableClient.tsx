"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  ChevronLeft, ChevronRight, Download, Users, Clock,
  CalendarDays, Zap, BookOpen, AlertTriangle, RefreshCw,
  GraduationCap, User, MapPin, UserCheck
} from "lucide-react";

// â”€â”€â”€ EAT helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function nowEAT(): Date {
  const utc = new Date();
  return new Date(utc.getTime() + 3 * 60 * 60 * 1000);
}

function fmtDateEAT(d: Date): string {
  const dd   = String(d.getUTCDate()).padStart(2, "0");
  const mm   = String(d.getUTCMonth() + 1).padStart(2, "0");
  const yy   = String(d.getUTCFullYear()).slice(2);
  return `${dd}/${mm}/${yy}`;
}

function fmtTimeEAT(d: Date): string {
  const h = d.getUTCHours();
  const m = String(d.getUTCMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  const h12  = ((h % 12) || 12);
  return `${h12}:${m} ${ampm} EAT`;
}

// â”€â”€â”€ Data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

const DAYS      = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const DAY_SHORT = ["Mon",    "Tue",     "Wed",       "Thu",      "Fri"];

const PERIODS = [
  { id: "p1",   label: "P1",          time: "08:00 â€“ 08:40", startMin: 480,  endMin: 520,  isBreak: false, isActivity: false },
  { id: "p2",   label: "P2",          time: "08:40 â€“ 09:20", startMin: 520,  endMin: 560,  isBreak: false, isActivity: false },
  { id: "p3",   label: "P3",          time: "09:20 â€“ 10:00", startMin: 560,  endMin: 600,  isBreak: false, isActivity: false },
  { id: "brk1", label: "Break",       time: "10:00 â€“ 10:30", startMin: 600,  endMin: 630,  isBreak: true,  isActivity: false },
  { id: "p4",   label: "P4",          time: "10:30 â€“ 11:10", startMin: 630,  endMin: 670,  isBreak: false, isActivity: false },
  { id: "p5",   label: "P5",          time: "11:10 â€“ 11:50", startMin: 670,  endMin: 710,  isBreak: false, isActivity: false },
  { id: "p6",   label: "P6",          time: "11:50 â€“ 12:30", startMin: 710,  endMin: 750,  isBreak: false, isActivity: false },
  { id: "lnch", label: "Lunch",       time: "12:30 â€“ 14:00", startMin: 750,  endMin: 840,  isBreak: true,  isActivity: false },
  { id: "p7",   label: "P7",          time: "14:00 â€“ 14:40", startMin: 840,  endMin: 880,  isBreak: false, isActivity: false },
  { id: "p8",   label: "P8",          time: "14:40 â€“ 15:20", startMin: 880,  endMin: 920,  isBreak: false, isActivity: false },
  { id: "act",  label: "Clubs/Games", time: "15:20 â€“ 16:30", startMin: 920,  endMin: 990,  isBreak: false, isActivity: true  },
];

const LESSON_PERIODS = PERIODS.filter(p => !p.isBreak && !p.isActivity);

const LESSON_TOPICS: Record<string, string[]> = {
  Mathematics:  ["Quadratic Equations", "Trigonometry Basics", "Logarithms", "Matrices & Determinants", "Probability"],
  English:      ["Essay Writing", "Grammar & Tenses", "Comprehension Skills", "Oral Literature", "Punctuation & Syntax"],
  Science:      ["Cell Structure", "Photosynthesis", "Digestive System", "Genetics", "Ecosystems"],
  History:      ["Pre-Colonial Kenya", "Colonialism in Africa", "Independence Movements", "Cold War Era", "African Nationalism"],
  Geography:    ["Plate Tectonics", "Climate Patterns", "Population Distribution", "Map Work & GIS", "Natural Resources"],
  Art:          ["Colour Theory", "Perspective Drawing", "Pottery Techniques", "Printmaking", "Design Principles"],
  CRE:          ["Sermon on the Mount", "Prophets in the OT", "Christian Ethics", "Acts of the Apostles", "Prayer & Worship"],
  Kiswahili:    ["Fasihi Simulizi", "Sarufi ya Kiswahili", "Uandishi wa Insha", "Mashairi", "Ufahamu"],
  Physics:      ["Newton's Laws", "Electromagnetism", "Wave Motion", "Optics", "Thermodynamics"],
  Chemistry:    ["Periodic Table", "Chemical Bonding", "Acid-Base Reactions", "Organic Chemistry", "Electrochemistry"],
  Business:     ["Supply & Demand", "Marketing Strategies", "Business Plans", "Entrepreneurship", "Financial Literacy"],
  Agriculture:  ["Soil Conservation", "Crop Diseases", "Irrigation Methods", "Livestock Management", "Agroforestry"],
};

let SUBJECTS: any[] = [];
let TEACHERS: any[] = [];
let CLASSES: any[] = [];
let ROOMS: any[] = [];
let SCHEDULE: any[][][] = [];

// â”€â”€â”€ Live time helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function getTodayIndex(): number {
  const eat = nowEAT();
  const d   = eat.getUTCDay();
  if (d === 0 || d === 6) return 0;
  return d - 1;
}

function getCurrentPeriodIndex(): number {
  const eat  = nowEAT();
  const mins = eat.getUTCHours() * 60 + eat.getUTCMinutes();
  for (let i = 0; i < LESSON_PERIODS.length; i++) {
    const lp = LESSON_PERIODS[i];
    const full = PERIODS.find(p => p.id === lp.id)!;
    if (mins >= full.startMin && mins < full.endMin) return i;
  }
  return -1;
}

function getPeriodProgress(): number {
  const eat  = nowEAT();
  const mins = eat.getUTCHours() * 60 + eat.getUTCMinutes();
  const idx  = getCurrentPeriodIndex();
  if (idx < 0) return 0;
  const lp   = LESSON_PERIODS[idx];
  const full = PERIODS.find(p => p.id === lp.id)!;
  return Math.min(100, Math.round(((mins - full.startMin) / (full.endMin - full.startMin)) * 100));
}

// â”€â”€â”€ Live Beacon â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function LiveBeacon({ small = false }: { small?: boolean }) {
  return (
    <span className={`relative flex-shrink-0 ${small ? "w-2 h-2" : "w-2.5 h-2.5"}`}>
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
      <span className={`relative inline-flex rounded-full bg-red-500 ${small ? "w-2 h-2" : "w-2.5 h-2.5"}`} />
    </span>
  );
}

// â”€â”€â”€ Lesson Tooltip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface TooltipLesson {
  subject: typeof SUBJECTS[0];
  teacher: typeof TEACHERS[0];
  room: string;
  topic: string;
}

function LessonTooltip({ lesson, isCurrent, periodLabel, periodTime }: {
  lesson: TooltipLesson;
  isCurrent: boolean;
  periodLabel: string;
  periodTime: string;
}) {
  const { subject, teacher, room, topic } = lesson;
  const progress = isCurrent ? getPeriodProgress() : 0;

  return (
    <div
      className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 pointer-events-none"
      style={{ filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.2))" }}
    >
      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-white" />

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xl">
        <div className={`${subject.bg} border-b ${subject.border} px-4 py-3 flex items-center gap-3`}>
          <span className="text-2xl">{subject.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className={`font-black text-sm ${subject.text} truncate`}>{subject.name}</p>
              {isCurrent && <LiveBeacon small />}
            </div>
            <p className="text-[10px] font-bold text-slate-500 truncate">{periodLabel} Â· {periodTime}</p>
          </div>
        </div>

        <div className="px-4 py-3 space-y-3">
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Lesson Topic</p>
              <p className="text-xs font-bold text-slate-800 leading-snug mt-0.5">{topic}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Teacher</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-xs font-bold text-slate-800">{teacher.name}</p>
                {isCurrent && <span className="text-[9px] font-black text-red-600 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block animate-pulse" />LIVE
                </span>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Location</p>
              <p className="text-xs font-bold text-slate-800 mt-0.5">{room}</p>
            </div>
          </div>

          {isCurrent && (
            <div className="pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Progress</p>
                <p className="text-[10px] font-black text-red-600">{progress}%</p>
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// â”€â”€â”€ Lesson Cell â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

interface LessonCellProps {
  lesson: TooltipLesson | null;
  isCurrent: boolean;
  compact?: boolean;
  periodLabel: string;
  periodTime: string;
}

function LessonCell({ lesson, isCurrent, compact = false, periodLabel, periodTime }: LessonCellProps) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  if (!lesson) {
    return (
      <div className={`h-full bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-300 text-xs font-bold ${compact ? "min-h-[58px]" : "min-h-[72px]"}`}>
        Free
      </div>
    );
  }

  const { subject, teacher } = lesson;

  return (
    <div
      ref={ref}
      className="relative h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className={`
        relative rounded-xl border ${subject.border} ${subject.bg}
        flex flex-col justify-between h-full cursor-pointer
        transition-all duration-200 group
        hover:-translate-y-0.5 hover:shadow-lg
        ${isCurrent
          ? `ring-2 ring-red-400 ring-offset-2 shadow-md shadow-red-200/50 z-10`
          : "shadow-sm z-0"}
        ${compact ? "p-1.5 min-h-[58px]" : "p-2.5 min-h-[72px]"}
      `}>
        {isCurrent && (
          <div className="absolute -top-2.5 -right-2 z-20 flex items-center gap-1 bg-red-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            LIVE
          </div>
        )}

        <div className={`font-black ${subject.text} flex items-center gap-1 ${compact ? "text-[10px]" : "text-xs"}`}>
          <span>{subject.icon}</span>
          <span className="truncate">{subject.name}</span>
        </div>

        <div className={`font-semibold text-slate-500 truncate ${compact ? "text-[9px]" : "text-[10px]"}`}>
          {teacher.short}
        </div>

        <div className={`font-bold text-slate-400 ${compact ? "text-[9px]" : "text-[10px]"}`}>
          {lesson.room}
        </div>

        {isCurrent && (
          <div className="absolute bottom-0 left-0 right-0 h-1 rounded-b-xl overflow-hidden bg-black/5">
            <div
              className="h-full bg-red-500 transition-all duration-1000"
              style={{ width: `${getPeriodProgress()}%` }}
            />
          </div>
        )}
      </div>

      {hovered && (
        <LessonTooltip
          lesson={lesson}
          isCurrent={isCurrent}
          periodLabel={periodLabel}
          periodTime={periodTime}
        />
      )}
    </div>
  );
}

// â”€â”€â”€ Main Component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function TimetableClient({ initialData }: { initialData: any }) {
  if (SUBJECTS.length === 0) {
    SUBJECTS = initialData.SUBJECTS;
    TEACHERS = initialData.TEACHERS;
    CLASSES = initialData.CLASSES;
    ROOMS = initialData.ROOMS;
    SCHEDULE = initialData.SCHEDULE;
  }
  const [view, setView]                   = useState<"daily" | "weekly" | "teacher">("weekly");
  const [selectedClassIdx, setSelectedClassIdx]   = useState(6); // Form 4A default
  const [selectedTeacherIdx, setSelectedTeacherIdx] = useState(0);
  const [dayIdx, setDayIdx]               = useState(getTodayIndex());
  const [now, setNow]                     = useState(nowEAT());

  useEffect(() => {
    const id = setInterval(() => setNow(nowEAT()), 30_000);
    return () => clearInterval(id);
  }, []);

  const currentPeriodIdx = useMemo(() => getCurrentPeriodIndex(), [now]);
  const todayIdx         = getTodayIndex();

  const todayLessons        = SCHEDULE[selectedClassIdx][dayIdx];
  const uniqueTeachersToday = useMemo(() => new Set(todayLessons.map(l => l?.teacher.id)).size, [todayLessons]);
  const freePeriods         = todayLessons.filter(l => !l).length;
  const liveNow             = currentPeriodIdx >= 0 && dayIdx === todayIdx;

  const teacherSchedule = useMemo(() => {
    const teacher = TEACHERS[selectedTeacherIdx];
    return DAYS.map((_, d) =>
      LESSON_PERIODS.map((_, p) => {
        for (let c = 0; c < CLASSES.length; c++) {
          const lesson = SCHEDULE[c][d][p];
          if (lesson?.teacher.id === teacher.id) return { ...lesson, className: CLASSES[c] };
        }
        return null;
      })
    );
  }, [selectedTeacherIdx]);

  const teacherIsLive = useMemo(() => {
    if (currentPeriodIdx < 0) return false;
    const teacher = TEACHERS[selectedTeacherIdx];
    for (let c = 0; c < CLASSES.length; c++) {
      if (SCHEDULE[c][todayIdx][currentPeriodIdx]?.teacher.id === teacher.id) return true;
    }
    return false;
  }, [selectedTeacherIdx, currentPeriodIdx, now]);

  return (
    <div className="max-w-[1400px] mx-auto space-y-6 pb-16 pt-2">

      {/* â”€â”€ Header â”€â”€ */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Master Timetable</h1>
          <div className="text-sm text-slate-500 font-medium mt-1 flex items-center gap-2">
            View and manage class schedules.
            <span className="text-xs font-black text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
              {fmtDateEAT(now)} Â· {fmtTimeEAT(now)}
            </span>
            {liveNow && (
              <span className="flex items-center gap-1.5 text-xs font-black text-white bg-red-500 px-2.5 py-1 rounded-lg shadow-md shadow-red-500/20">
                <LiveBeacon small /> Classes in session
              </span>
            )}
          </div>
        </div>
        <button onClick={() => window.print()} className="flex items-center gap-2 px-6 py-3 text-sm font-black text-white bg-primary-900 rounded-xl hover:bg-primary-800 hover:-translate-y-0.5 transition-all shadow-md shadow-primary-900/20">
          <Download className="w-4 h-4" /> Export PDF
        </button>
      </div>

      {/* â”€â”€ Stats Bar â”€â”€ */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: CalendarDays,  label: "Periods Today",    value: LESSON_PERIODS.length, color: "text-blue-600 bg-blue-50 border-blue-100" },
          { icon: Users,         label: "Teachers Active",  value: uniqueTeachersToday,   color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
          { icon: Clock,         label: "Free Periods",     value: freePeriods,            color: "text-amber-600 bg-amber-50 border-amber-100" },
          { icon: AlertTriangle, label: "Clashes Detected", value: 0,                      color: "text-rose-600 bg-rose-50 border-rose-100" },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-2xl font-black text-slate-800 leading-none">{value}</p>
              <p className="text-xs font-bold text-slate-500 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* â”€â”€ Control Bar â”€â”€ */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 flex flex-wrap items-center gap-4 shadow-sm">

        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1 border border-slate-200/50">
          {(["weekly", "daily", "teacher"] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-5 py-2 text-xs font-black rounded-lg capitalize transition-all ${
                view === v ? "bg-secondary-500 text-white shadow-md shadow-secondary-500/20" : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
              }`}
            >
              {v === "daily" ? "Daily" : v === "weekly" ? "Weekly" : "By Teacher"}
            </button>
          ))}
        </div>

        <div className="hidden sm:block w-px h-8 bg-slate-200" />

        {/* Class Selector */}
        {view !== "teacher" && (
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-primary-900 focus-within:ring-2 focus-within:ring-primary-900/10 transition-all">
            <GraduationCap className="w-5 h-5 text-primary-900" />
            <select
              value={selectedClassIdx}
              onChange={e => setSelectedClassIdx(Number(e.target.value))}
              className="text-sm font-bold text-slate-800 bg-transparent outline-none cursor-pointer w-full"
            >
              {CLASSES.map((c, i) => <option key={c} value={i}>{c}</option>)}
            </select>
          </div>
        )}

        {/* Teacher Selector */}
        {view === "teacher" && (
          <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm focus-within:border-primary-900 focus-within:ring-2 focus-within:ring-primary-900/10 transition-all">
            <User className="w-5 h-5 text-primary-900" />
            <select
              value={selectedTeacherIdx}
              onChange={e => setSelectedTeacherIdx(Number(e.target.value))}
              className="text-sm font-bold text-slate-800 bg-transparent outline-none cursor-pointer"
            >
              {TEACHERS.map((t, i) => <option key={t.id} value={i}>{t.name}</option>)}
            </select>
            {teacherIsLive && (
              <span className="flex items-center gap-1 text-[10px] font-black text-white bg-red-600 px-2 py-0.5 rounded-md ml-2 shadow-sm">
                <LiveBeacon small /> LIVE
              </span>
            )}
          </div>
        )}

        {/* Day Navigator (daily view only) */}
        {view === "daily" && (
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setDayIdx(d => Math.max(0, d - 1))}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors border border-slate-200/50"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/50">
              {DAY_SHORT.map((d, i) => (
                <button
                  key={d}
                  onClick={() => setDayIdx(i)}
                  className={`px-4 py-2 rounded-lg text-xs font-black transition-all ${
                    dayIdx === i
                      ? "bg-secondary-500 text-white shadow-md shadow-secondary-500/20"
                      : i === todayIdx
                        ? "bg-white text-secondary-600 shadow-sm border border-secondary-200"
                        : "text-slate-600 hover:text-slate-800 hover:bg-slate-200"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              onClick={() => setDayIdx(d => Math.min(4, d + 1))}
              className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors border border-slate-200/50"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
            
            {/* Today jump button */}
            {dayIdx !== todayIdx && (
              <button
                onClick={() => setDayIdx(todayIdx)}
                className="ml-2 flex items-center gap-1.5 px-4 py-2 text-xs font-black text-primary-900 bg-primary-50 border border-primary-200 rounded-xl hover:bg-primary-100 transition-colors shadow-sm"
              >
                <Zap className="w-4 h-4" /> Today
              </button>
            )}
          </div>
        )}
      </div>

      {/* â•â• WEEKLY VIEW â•â• */}
      {view === "weekly" && (
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm" style={{ minWidth: 900 }}>
              <thead>
                <tr className="bg-primary-900 text-white border-b border-primary-800">
                  <th className="px-5 py-4 text-xs font-black uppercase tracking-wider w-32 sticky left-0 bg-primary-900 z-10 border-r border-primary-800/50">Time</th>
                  {DAYS.map((day, i) => (
                    <th key={day} className={`px-4 py-4 text-center text-xs font-black uppercase tracking-wider ${i === todayIdx ? "bg-white/10 relative" : ""}`}>
                      {i === todayIdx && liveNow && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-500 shadow-[0_0_8px_rgba(var(--secondary-500),0.8)]" />
                      )}
                      <div className="flex flex-col items-center justify-center gap-1">
                        <div className="flex items-center gap-2">
                          {day}
                          {i === todayIdx && liveNow && <LiveBeacon small />}
                        </div>
                        {i === todayIdx && <span className="text-[10px] bg-secondary-500/20 text-secondary-100 px-2 py-0.5 rounded-md font-bold mt-1 inline-block">Today</span>}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {PERIODS.map((period) => {
                  const lpIdx = LESSON_PERIODS.findIndex(lp => lp.id === period.id);

                  if (period.isBreak) return (
                    <tr key={period.id} className="bg-slate-50/80">
                      <td className="px-5 py-3 sticky left-0 bg-slate-50/90 z-10 border-r border-slate-200/50">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{period.time}</div>
                        <div className="text-xs font-black text-slate-500">{period.label}</div>
                      </td>
                      <td colSpan={5} className="px-4 py-3">
                        <div className="h-10 rounded-xl bg-slate-100 border border-slate-200/60 flex items-center justify-center">
                          <span className="text-xs font-black text-slate-400 tracking-widest uppercase">{period.label}</span>
                        </div>
                      </td>
                    </tr>
                  );

                  if (period.isActivity) return (
                    <tr key={period.id} className="bg-primary-50/30">
                      <td className="px-5 py-3 sticky left-0 bg-white/90 z-10 border-r border-slate-200/50">
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">{period.time}</div>
                        <div className="text-xs font-black text-primary-900">{period.label}</div>
                      </td>
                      <td colSpan={5} className="px-4 py-3">
                        <div className="h-12 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center gap-3">
                          <span className="text-lg">âš½</span>
                          <span className="text-xs font-black text-primary-900 uppercase tracking-wider">Clubs & Games â€” All Classes</span>
                        </div>
                      </td>
                    </tr>
                  );

                  return (
                    <tr key={period.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3 sticky left-0 bg-white/90 z-10 border-r border-slate-100">
                        <div className="text-[10px] font-bold text-slate-400">{period.time}</div>
                        <div className="text-xs font-black text-slate-700">{period.label}</div>
                      </td>
                      {DAYS.map((_, dIdx) => {
                        const lesson    = lpIdx >= 0 ? SCHEDULE[selectedClassIdx][dIdx][lpIdx] : null;
                        const isCurrent = dIdx === todayIdx && lpIdx === currentPeriodIdx;
                        return (
                          <td key={dIdx} className={`px-2 py-2 ${dIdx === todayIdx ? "bg-slate-50/50" : ""}`}>
                            <LessonCell
                              lesson={lesson}
                              isCurrent={isCurrent}
                              compact
                              periodLabel={period.label}
                              periodTime={period.time}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* â•â• DAILY VIEW â•â• */}
      {view === "daily" && (
        <div className="space-y-4">
          {/* Day banner */}
          <div className={`flex items-center gap-4 px-6 py-5 rounded-3xl border ${
            dayIdx === todayIdx
              ? "bg-secondary-500 text-white border-secondary-500 shadow-lg shadow-secondary-500/30"
              : "bg-white/80 text-slate-700 border-slate-200/80 backdrop-blur-xl shadow-sm"
          }`}>
            <CalendarDays className="w-6 h-6 opacity-90" />
            <span className="font-black text-xl">{DAYS[dayIdx]}</span>
            {dayIdx === todayIdx && (
              <span className="ml-2 text-xs font-black bg-white/20 px-3 py-1 rounded-lg flex items-center gap-2 shadow-sm border border-white/10">
                {liveNow && <LiveBeacon small />} Today
              </span>
            )}
            <div className="ml-auto flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-xl">
              <GraduationCap className="w-4 h-4" />
              <span className="text-sm font-black">{CLASSES[selectedClassIdx]}</span>
            </div>
          </div>

          {/* Period cards */}
          <div className="space-y-3">
            {PERIODS.map((period) => {
              const lpIdx     = LESSON_PERIODS.findIndex(lp => lp.id === period.id);
              const isCurrent = lpIdx === currentPeriodIdx && dayIdx === todayIdx;

              if (period.isBreak) return (
                <div key={period.id} className="flex items-center gap-5 px-6 py-4 bg-slate-50 border border-slate-200/60 rounded-3xl">
                  <div className="text-xs font-bold text-slate-400 w-28 text-center">{period.time}</div>
                  <div className="flex-1 h-px bg-slate-200" />
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest bg-slate-100 px-4 py-1.5 rounded-full">{period.label}</span>
                  <div className="flex-1 h-px bg-slate-200" />
                </div>
              );

              if (period.isActivity) return (
                <div key={period.id} className="flex items-center gap-5 px-6 py-5 bg-primary-50 border border-primary-100 rounded-3xl">
                  <div className="text-xs font-bold text-slate-500 w-28 text-center">{period.time}</div>
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl shadow-sm border border-primary-100">âš½</div>
                  <div>
                    <p className="font-black text-primary-900 text-lg">Clubs & Games</p>
                    <p className="text-sm text-slate-500 font-bold mt-0.5">All students â€” outdoor activities</p>
                  </div>
                </div>
              );

              const lesson = lpIdx >= 0 ? SCHEDULE[selectedClassIdx][dayIdx][lpIdx] : null;

              return (
                <div
                  key={period.id}
                  className={`flex items-stretch gap-5 px-6 py-5 bg-white/90 backdrop-blur-xl border rounded-3xl transition-all duration-300 ${
                    isCurrent
                      ? "border-red-400 ring-4 ring-red-400/20 shadow-xl shadow-red-500/10 scale-[1.01]"
                      : "border-slate-200/80 shadow-sm hover:shadow-md"
                  }`}
                >
                  {/* Time column */}
                  <div className="flex flex-col justify-center items-center w-28 flex-shrink-0">
                    <div className="text-xs font-bold text-slate-400">{period.time}</div>
                    <div className={`text-base font-black mt-1 ${isCurrent ? "text-red-600" : "text-slate-700"}`}>{period.label}</div>
                    {isCurrent && (
                      <span className="mt-2 inline-flex items-center gap-1.5 text-[10px] font-black bg-red-600 text-white px-2.5 py-1 rounded-full shadow-md w-fit">
                        <LiveBeacon small /> LIVE
                      </span>
                    )}
                  </div>

                  {/* Divider */}
                  <div className={`w-1 rounded-full ${isCurrent ? "bg-red-400" : "bg-slate-100"}`} />

                  {/* Lesson info */}
                  {lesson ? (
                    <div className="flex-1 flex items-center justify-between gap-6 pl-2">
                      <div className="flex items-center gap-4">
                        <div className={`relative w-16 h-16 rounded-2xl ${lesson.subject.bg} border ${lesson.subject.border} flex items-center justify-center text-3xl shadow-sm`}>
                          {lesson.subject.icon}
                          {isCurrent && (
                            <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full p-0.5 shadow-sm">
                              <LiveBeacon />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className={`font-black text-xl ${lesson.subject.text} leading-none`}>{lesson.subject.name}</p>
                          </div>
                          <p className="text-sm font-bold text-slate-500 mt-2 flex items-center gap-1.5">
                            <UserCheck className="w-4 h-4" /> {lesson.teacher.name}
                          </p>
                          <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1.5">
                            <BookOpen className="w-3.5 h-3.5" /> {lesson.topic}
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex flex-col items-end gap-3 min-w-[140px]">
                        <span className="text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-xl flex items-center gap-2 border border-slate-200/50">
                          <MapPin className="w-4 h-4 text-slate-400" />{lesson.room}
                        </span>
                        {isCurrent && (
                          <div className="w-full bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                            <div className="flex justify-between text-[10px] font-black text-slate-500 mb-1.5 uppercase tracking-wider">
                              <span>Class Progress</span><span className="text-red-600">{getPeriodProgress()}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                              <div className="h-full bg-red-500 rounded-full transition-all duration-1000" style={{ width: `${getPeriodProgress()}%` }} />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center pl-4 text-slate-400">
                      <span className="text-lg font-bold">Free Period</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* â•â• TEACHER VIEW â•â• */}
      {view === "teacher" && (
        <div className="space-y-5">
          {/* Teacher banner */}
          <div className={`flex items-center gap-5 px-6 py-5 border rounded-3xl shadow-sm transition-all duration-300 ${
            teacherIsLive
              ? "bg-red-50 border-red-200 ring-4 ring-red-200/40 shadow-red-500/10"
              : "bg-white/80 backdrop-blur-xl border-slate-200/80"
          }`}>
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-primary-900 flex items-center justify-center text-white font-black text-2xl shadow-lg border-2 border-white">
                {TEACHERS[selectedTeacherIdx].name.split(" ").map(w => w[0]).join("")}
              </div>
              {teacherIsLive && (
                <div className="absolute -top-1.5 -right-1.5 bg-white rounded-full p-1 shadow-sm">
                  <LiveBeacon />
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <p className="font-black text-slate-800 text-2xl">{TEACHERS[selectedTeacherIdx].name}</p>
                {teacherIsLive && (
                  <span className="flex items-center gap-1.5 text-xs font-black text-white bg-red-600 px-3 py-1 rounded-lg shadow-sm">
                    <LiveBeacon small /> Teaching Now
                  </span>
                )}
              </div>
              <p className="text-sm font-bold text-primary-900 bg-primary-50 border border-primary-100 px-3 py-1 rounded-lg inline-block mt-2">
                {TEACHERS[selectedTeacherIdx].subject}
              </p>
            </div>
            <div className="ml-auto flex items-center gap-2.5 text-sm font-bold text-slate-600 bg-white border border-slate-200 px-5 py-3 rounded-xl shadow-sm">
              <BookOpen className="w-5 h-5 text-primary-900" />
              {teacherSchedule.reduce((acc, day) => acc + day.filter(Boolean).length, 0)} periods / week
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm" style={{ minWidth: 900 }}>
                <thead>
                  <tr className="bg-primary-900 text-white border-b border-primary-800">
                    <th className="px-5 py-4 text-xs font-black uppercase tracking-wider w-32 sticky left-0 bg-primary-900 z-10 border-r border-primary-800/50">Period</th>
                    {DAYS.map((day, i) => (
                      <th key={day} className={`px-4 py-4 text-center text-xs font-black uppercase tracking-wider ${i === todayIdx ? "bg-white/10 relative" : ""}`}>
                        {i === todayIdx && teacherIsLive && (
                          <div className="absolute top-0 left-0 right-0 h-1 bg-secondary-500 shadow-[0_0_8px_rgba(var(--secondary-500),0.8)]" />
                        )}
                        <div className="flex flex-col items-center justify-center gap-1">
                          <div className="flex items-center gap-2">
                            {day}
                            {i === todayIdx && teacherIsLive && <LiveBeacon small />}
                          </div>
                          {i === todayIdx && <span className="text-[10px] bg-secondary-500/20 text-secondary-100 px-2 py-0.5 rounded-md font-bold mt-1 inline-block">Today</span>}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {PERIODS.map((period) => {
                    const lpIdx = LESSON_PERIODS.findIndex(lp => lp.id === period.id);

                    if (period.isBreak) return (
                      <tr key={period.id} className="bg-slate-50/80">
                        <td className="px-5 py-3 sticky left-0 bg-slate-50/90 z-10 border-r border-slate-200/50 text-xs font-black text-slate-400">{period.label}</td>
                        <td colSpan={5} className="px-4 py-3">
                          <div className="h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                            <span className="text-xs font-black text-slate-400 tracking-widest uppercase">{period.label}</span>
                          </div>
                        </td>
                      </tr>
                    );

                    if (period.isActivity) return (
                      <tr key={period.id} className="bg-primary-50/30">
                        <td className="px-5 py-3 sticky left-0 bg-white/90 z-10 border-r border-slate-200/50 text-xs font-black text-primary-900">{period.label}</td>
                        <td colSpan={5} className="px-4 py-3">
                          <div className="h-10 rounded-xl bg-primary-50 border border-primary-100 flex items-center justify-center gap-2">
                            <span>âš½</span>
                            <span className="text-xs font-black text-primary-900 uppercase tracking-wider">Clubs & Games</span>
                          </div>
                        </td>
                      </tr>
                    );

                    return (
                      <tr key={period.id} className="hover:bg-slate-50/60 transition-colors">
                        <td className="px-5 py-3 sticky left-0 bg-white/90 z-10 border-r border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400">{period.time}</div>
                          <div className="text-xs font-black text-slate-700">{period.label}</div>
                        </td>
                        {DAYS.map((_, dIdx) => {
                          const lesson    = lpIdx >= 0 ? teacherSchedule[dIdx][lpIdx] : null;
                          const isCurrent = dIdx === todayIdx && lpIdx === currentPeriodIdx;
                          return (
                            <td key={dIdx} className={`px-2 py-2 ${dIdx === todayIdx ? "bg-slate-50/50" : ""}`}>
                              {lesson ? (
                                <LessonCell
                                  lesson={lesson}
                                  isCurrent={isCurrent}
                                  compact
                                  periodLabel={period.label}
                                  periodTime={period.time}
                                />
                              ) : (
                                <div className="h-full min-h-[58px] rounded-xl bg-slate-50/80 border border-slate-100/50 flex items-center justify-center">
                                  <RefreshCw className="w-3.5 h-3.5 text-slate-200" />
                                </div>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* â”€â”€ Subject Legend â”€â”€ */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl p-5 shadow-sm">
        <p className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4">Subject Legend</p>
        <div className="flex flex-wrap gap-2.5">
          {SUBJECTS.map(s => (
            <div key={s.name} className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${s.bg} ${s.border} text-xs font-bold ${s.text} shadow-sm`}>
              <span>{s.icon}</span>{s.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
