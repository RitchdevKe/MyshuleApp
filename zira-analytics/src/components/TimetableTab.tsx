import React, { useState, useEffect, useRef } from 'react';
import { CalendarCheck, BookOpen, Clock, Users, User, Filter, HelpCircle, Edit3, X, Save, ArrowRightLeft, ChevronLeft, ChevronRight, CalendarDays, Calendar, Settings } from 'lucide-react';
import toast from 'react-hot-toast';

interface TimetableTabProps {
  teacherInfo: { name: string; username?: string; role?: string };
}

type SlotData = { subject: string; teacher: string; room: string };
type ScheduleData = Record<string, Record<string, Record<string, SlotData>>>;

const INITIAL_SCHEDULE: ScheduleData = {
  'Form 4': {
    'Monday': {
      'Morning Prep': { subject: 'Mathematics (Form 4)', teacher: 'Daniel Gitumu Hia', room: 'F4 East' },
      'Lesson 1': { subject: 'English Grammar', teacher: 'Mrs. Wanjau', room: 'F4 East' },
      'Lesson 2': { subject: 'Chemistry Revision', teacher: 'Mr. Ndegwa', room: 'F4 Lab' },
      'Lesson 3': { subject: 'Kiswahili Fasihi', teacher: 'Miss Mumbua', room: 'F4 East' },
      'Lesson 4': { subject: 'Mathematics Core', teacher: 'Daniel Gitumu Hia', room: 'F4 East' }
    },
    'Tuesday': {
      'Morning Prep': { subject: 'Biology Prep', teacher: 'Mr. Onyango', room: 'F4 East' },
      'Lesson 1': { subject: 'Mathematics Core', teacher: 'Daniel Gitumu Hia', room: 'F4 East' },
      'Lesson 2': { subject: 'History and Govt', teacher: 'Mr. Kilonzo', room: 'F4 East' },
      'Lesson 3': { subject: 'Physics Theory', teacher: 'Mr. Kamau', room: 'F4 Lab' },
      'Lesson 4': { subject: 'Agriculture Practical', teacher: 'Mrs. Chege', room: 'School Farm' }
    },
    'Wednesday': {
      'Morning Prep': { subject: 'Mathematics Prep', teacher: 'Daniel Gitumu Hia', room: 'F4 East' },
      'Lesson 1': { subject: 'Chemistry Practical', teacher: 'Mr. Ndegwa', room: 'F4 Lab' },
      'Lesson 2': { subject: 'English literature', teacher: 'Mrs. Wanjau', room: 'F4 East' },
      'Lesson 3': { subject: 'Christian Religious Ed', teacher: 'Madam Grace', room: 'F4 East' },
      'Lesson 4': { subject: 'Business Studies', teacher: 'Mr. Gikonyo', room: 'F4 East' }
    },
    'Thursday': {
      'Morning Prep': { subject: 'Kiswahili Insha', teacher: 'Miss Mumbua', room: 'F4 East' },
      'Lesson 1': { subject: 'Biology Core', teacher: 'Mr. Onyango', room: 'F4 East' },
      'Lesson 2': { subject: 'Mathematics Core', teacher: 'Daniel Gitumu Hia', room: 'F4 East' },
      'Lesson 3': { subject: 'Geography Cartography', teacher: 'Mr. Muteti', room: 'F4 West' },
      'Lesson 4': { subject: 'English Essay Writing', teacher: 'Mrs. Wanjau', room: 'F4 East' }
    },
    'Friday': {
      'Morning Prep': { subject: 'Mathematics Core', teacher: 'Daniel Gitumu Hia', room: 'F4 East' },
      'Lesson 1': { subject: 'Chemistry Core', teacher: 'Mr. Ndegwa', room: 'F4 East' },
      'Lesson 2': { subject: 'Christian Religious Ed', teacher: 'Madam Grace', room: 'F4 East' },
      'Lesson 3': { subject: 'Kiswahili sarufi', teacher: 'Miss Mumbua', room: 'F4 East' },
      'Lesson 4': { subject: 'Weekly General Assembly', teacher: 'Karega Staff', room: 'Assembly Ground' }
    }
  },
  'Form 3': {
    'Monday': {
      'Morning Prep': { subject: 'Kiswahili Prep', teacher: 'Miss Mumbua', room: 'F3 East' },
      'Lesson 1': { subject: 'Mathematics Core', teacher: 'Daniel Gitumu Hia', room: 'F3 East' },
      'Lesson 2': { subject: 'English literature', teacher: 'Mrs. Wanjau', room: 'F3 East' },
      'Lesson 3': { subject: 'Biology core', teacher: 'Mr. Onyango', room: 'F3 East' },
      'Lesson 4': { subject: 'History and Govt', teacher: 'Mr. Kilonzo', room: 'F3 East' }
    },
    'Tuesday': {
      'Morning Prep': { subject: 'Mathematics Core', teacher: 'Daniel Gitumu Hia', room: 'F3 East' },
      'Lesson 1': { subject: 'Kiswahili Fasihi', teacher: 'Miss Mumbua', room: 'F3 East' },
      'Lesson 2': { subject: 'Chemistry Theory', teacher: 'Mr. Ndegwa', room: 'F3 Lab' },
      'Lesson 3': { subject: 'Business Studies', teacher: 'Mr. Gikonyo', room: 'F3 East' },
      'Lesson 4': { subject: 'Christian Religious Ed', teacher: 'Madam Grace', room: 'F3 East' }
    },
    'Wednesday': {
      'Morning Prep': { subject: 'History Prep', teacher: 'Mr. Kilonzo', room: 'F3 East' },
      'Lesson 1': { subject: 'Physics Revision', teacher: 'Mr. Kamau', room: 'F3 Lab' },
      'Lesson 2': { subject: 'Mathematics Core', teacher: 'Daniel Gitumu Hia', room: 'F3 East' },
      'Lesson 3': { subject: 'English Grammar', teacher: 'Mrs. Wanjau', room: 'F3 East' },
      'Lesson 4': { subject: 'Geography Practical', teacher: 'Mr. Muteti', room: 'F3 West' }
    },
    'Thursday': {
      'Morning Prep': { subject: 'English Prep', teacher: 'Mrs. Wanjau', room: 'F3 East' },
      'Lesson 1': { subject: 'Kiswahili sarufi', teacher: 'Miss Mumbua', room: 'F3 East' },
      'Lesson 2': { subject: 'Mathematics Core', teacher: 'Daniel Gitumu Hia', room: 'F3 East' },
      'Lesson 3': { subject: 'Biology lab', teacher: 'Mr. Onyango', room: 'F3 Lab' },
      'Lesson 4': { subject: 'History Govt', teacher: 'Mr. Kilonzo', room: 'F3 East' }
    },
    'Friday': {
      'Morning Prep': { subject: 'Science Prep', teacher: 'Mr. Ndegwa', room: 'F3 Lab' },
      'Lesson 1': { subject: 'Agriculture Practical', teacher: 'Mrs. Chege', room: 'School Farm' },
      'Lesson 2': { subject: 'Business Core', teacher: 'Mr. Gikonyo', room: 'F3 East' },
      'Lesson 3': { subject: 'Mathematics Core', teacher: 'Daniel Gitumu Hia', room: 'F3 East' },
      'Lesson 4': { subject: 'Weekly Assembly', teacher: 'Karega Staff', room: 'Assembly Ground' }
    }
  }
};

export function TimetableTab({ teacherInfo }: TimetableTabProps) {
  const [selectedForm, setSelectedForm] = useState<string>('Form 4');
  const [filterTeacher, setFilterTeacher] = useState<boolean>(false);
  const [searchTeacherQuery, setSearchTeacherQuery] = useState<string>('');
  const [editMode, setEditMode] = useState<boolean>(false);
  
  const [schedule, setSchedule] = useState<ScheduleData>(() => {
    const saved = localStorage.getItem("zira_timetable_schedule");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return INITIAL_SCHEDULE;
  });

  const [editingCell, setEditingCell] = useState<{ day: string; slotName: string; current: SlotData | undefined; form: string } | null>(null);
  
  const [editForm, setEditForm] = useState<SlotData>({ subject: "", teacher: "", room: "" });
  const isCellMySlot = (cell: { current: SlotData | undefined }) => {
    if (!cell.current?.teacher || !teacherInfo?.name) return false;
    return cell.current.teacher.toLowerCase().includes(teacherInfo.name.toLowerCase()) || 
           teacherInfo.name.toLowerCase().includes(cell.current.teacher.toLowerCase());
  };

  const isAdmin = teacherInfo.role === "School Admin" || teacherInfo.role === "Head Teacher" || teacherInfo.role === "Super Admin" || (teacherInfo.role || "").toLowerCase().includes("admin");

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  
  const parseToMins = (tStr: string) => {
    const [time, period] = tStr.trim().split(' ');
    let [h, m] = time.split(':').map(Number);
    if (period === 'PM' && h !== 12) h += 12;
    if (period === 'AM' && h === 12) h = 0;
    return h * 60 + m;
  };

  const SLOTS = [
    { name: "Morning Prep", time: "06:45 AM - 07:45 AM", type: "remedial" },
    { name: "Lesson 1", time: "08:00 AM - 09:20 AM", type: "academic" },
    { name: "Lesson 2", time: "09:20 AM - 10:40 AM", type: "academic" },
    { name: "Tea Break Hour", time: "10:40 AM - 11:10 AM", type: "offset" },
    { name: "Lesson 3", time: "11:10 AM - 12:30 PM", type: "academic" },
    { name: "Githeri Lunch Break", time: "12:30 PM - 02:00 PM", type: "offset" },
    { name: "Lesson 4", time: "02:00 PM - 03:20 PM", type: "academic" },
    { name: "Clubs & Games", time: "03:20 PM - 04:30 PM", type: "games" }
  ].map(s => {
     const [st, en] = s.time.split(' - ');
     return { ...s, start: parseToMins(st), end: parseToMins(en) };
  });

  const [viewMode, setViewMode] = useState<'weekly' | 'daily'>('weekly');
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [lessonLimits, setLessonLimits] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("zira_lesson_limits");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      'Mathematics Core': 5,
      'English Grammar': 4,
      'English literature': 4,
      'Kiswahili sarufi': 4,
      'Kiswahili Fasihi': 3,
      'Biology Core': 3,
      'Chemistry Core': 3,
      'Physics Theory': 3
    };
  });

  useEffect(() => {
    localStorage.setItem("zira_lesson_limits", JSON.stringify(lessonLimits));
  }, [lessonLimits]);

  const [browseDate, setBrowseDate] = useState(new Date());
  const [now, setNow] = useState(new Date());

  const notifiedStarts = useRef<Set<string>>(new Set());
  const notifiedEnds = useRef<Set<string>>(new Set());

  useEffect(() => {
     const t = setInterval(() => setNow(new Date()), 30000);
     return () => clearInterval(t);
  }, []);

  const changeBrowseDate = (days: number) => {
     const next = new Date(browseDate);
     next.setDate(next.getDate() + days);
     setBrowseDate(next);
  };

  const realDayName = now.toLocaleDateString("en-US", { weekday: "long" });
  const realMins = now.getHours() * 60 + now.getMinutes();
  const browseDayName = browseDate.toLocaleDateString("en-US", { weekday: "long" });

  const isWeekend = browseDayName === 'Saturday' || browseDayName === 'Sunday';

  const CLASS_HIERARCHY = ["Preparatory", "Primary 1", "Primary 2", "Primary 3", "Primary 4", "Primary 5", "Primary 6", "Junior Sec 1", "Junior Sec 2", "Junior Sec 3", "Form 1", "Form 2", "Form 3", "Form 4"];

  const rowDefinitions = viewMode === "daily" 
    ? (isWeekend ? [] : CLASS_HIERARCHY.map(f => ({ key: f, label: f, day: browseDayName, form: f })))
    : DAYS.map(d => ({ key: d, label: d, day: d, form: selectedForm }));

  const weekStart = new Date(browseDate);
  const dayOffset = weekStart.getDay(); 
  weekStart.setDate(weekStart.getDate() - (dayOffset === 0 ? 6 : dayOffset - 1));

  const getWeekStartStr = () => {
      return weekStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  }

  useEffect(() => {
    if (!teacherInfo?.name || !DAYS.includes(realDayName)) return;

    for (const formKey of Object.keys(schedule)) {
        const dSched = schedule[formKey]?.[realDayName] || {};
        for (const slotCfg of SLOTS) {
             const cell = dSched[slotCfg.name];
             if (cell && (cell.teacher.toLowerCase().includes(teacherInfo.name.toLowerCase()) || teacherInfo.name.toLowerCase().includes(cell.teacher.toLowerCase()))) {
                 const slotId = `${now.toDateString()}-${realDayName}-${slotCfg.name}-${formKey}`;

                 let diffStart = slotCfg.start - realMins;
                 if (diffStart > 0 && diffStart <= 5) {
                     if (!notifiedStarts.current.has(slotId)) {
                         toast(`Your ${cell.subject} class in ${cell.room} starts in ${diffStart} mins!`, {
                             icon: '🔔', duration: 5000 
                         });
                         notifiedStarts.current.add(slotId);
                     }
                 }

                 if (realMins >= slotCfg.start && realMins < slotCfg.end) {
                     let diffEnd = slotCfg.end - realMins;
                     if (diffEnd > 0 && diffEnd <= 3) {
                         if (!notifiedEnds.current.has(slotId)) {
                             toast(`Your ${cell.subject} class ends in ${diffEnd} mins. Wrap up!`, {
                                 icon: '⏳', duration: 5000 
                             });
                             notifiedEnds.current.add(slotId);
                         }
                     }
                 }
             }
        }
    }
  }, [now, schedule, teacherInfo.name, realDayName, realMins]);

  useEffect(() => {
    localStorage.setItem("zira_timetable_schedule", JSON.stringify(schedule));
  }, [schedule]);

  const handleCellClick = (day: string, slotName: string, targetForm: string) => {
    if (!editMode) return;
    const current = schedule[targetForm]?.[day]?.[slotName];
    
    setEditForm(current || { subject: "", teacher: teacherInfo.name, room: "" });
    setEditingCell({ day, slotName, current, form: targetForm });
  };

  const handleSaveEdit = () => {
    if (!editingCell) return;
    
    // Check permissions
    if (!isAdmin && editingCell.current && !isCellMySlot(editingCell)) {
      // It's a switch request
      toast.success("Shift switch request sent to " + editingCell.current.teacher);
      setEditingCell(null);
      return;
    }

    setSchedule(prev => {
      const newSched = JSON.parse(JSON.stringify(prev));
      const f = editingCell.form;
      if (!newSched[f]) newSched[f] = {};
      if (!newSched[f][editingCell.day]) newSched[f][editingCell.day] = {};
      
      if (!editForm.subject) {
         delete newSched[f][editingCell.day][editingCell.slotName];
      } else {
         newSched[f][editingCell.day][editingCell.slotName] = editForm;
      }
      return newSched;
    });

    toast.success("Timetable updated successfully");
    setEditingCell(null);
  };

  return (
    <div className="space-y-4 relative h-full">
      {/* 1. Header controls */}
      <div className="bg-white p-3 rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] shadow-sm flex flex-col gap-3">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
             <div className={"flex bg-slate-100 border border-slate-200 p-1 rounded-lg transition " + (viewMode === 'daily' ? 'opacity-50 pointer-events-none grayscale' : '')}>
              <select 
                value={selectedForm}
                onChange={(e) => setSelectedForm(e.target.value)}
                className="px-3 py-2 text-xs font-medium bg-white text-slate-700 border items-center border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C20F47]/20 transition shadow-sm w-full sm:w-auto min-w-[170px] cursor-pointer"
              >
                {CLASS_HIERARCHY.map((f) => (
                  <option key={f} value={f}>{f} Timetable</option>
                ))}
              </select>
             </div>

             <div className="flex bg-slate-100 border border-slate-200 p-1 rounded-lg">
               <button
                 onClick={() => setViewMode('weekly')}
                 className={"px-2.5 py-1.5 text-xs font-medium rounded-md transition flex items-center gap-1.5 cursor-pointer " + (
                   viewMode === 'weekly' ? "bg-white text-slate-800 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"
                 )}
               >
                 <CalendarDays className="w-3.5 h-3.5" /> Weekly
               </button>
               <button
                 onClick={() => setViewMode('daily')}
                 className={"px-2.5 py-1.5 text-xs font-medium rounded-md transition flex items-center gap-1.5 cursor-pointer " + (
                   viewMode === 'daily' ? "bg-white text-slate-800 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-900"
                 )}
               >
                 <Calendar className="w-3.5 h-3.5" /> Daily
               </button>
             </div>

             <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-lg">
               <button onClick={() => changeBrowseDate(viewMode === 'weekly' ? -7 : -1)} className="p-1.5 hover:bg-white rounded transition text-slate-500 hover:text-slate-800"><ChevronLeft className="w-3.5 h-3.5"/></button>
               <div className="text-xs font-medium text-slate-700 px-2 min-w-[110px] text-center">
                 {viewMode === 'weekly' ? `Week of ${getWeekStartStr()}` : browseDate.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric'})}
               </div>
               <button onClick={() => changeBrowseDate(viewMode === 'weekly' ? 7 : 1)} className="p-1.5 hover:bg-white rounded transition text-slate-500 hover:text-slate-800"><ChevronRight className="w-3.5 h-3.5"/></button>
               <button onClick={() => setBrowseDate(new Date())} className="text-[11px] font-medium px-2 py-1 text-[#C20F47] hover:bg-rose-50 rounded transition ml-1 cursor-pointer">Today</button>
             </div>
          </div>

          <div className="flex items-center flex-wrap gap-2 sm:gap-3 justify-end">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search teacher..." 
                value={searchTeacherQuery}
                onChange={(e) => setSearchTeacherQuery(e.target.value)}
                className="pl-8 pr-3 py-2 text-xs font-normal bg-white border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-[#C20F47]/20 transition w-full sm:w-40 text-slate-700"
              />
              <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              onClick={() => {
                  if (editMode) {
                      setEditMode(false);
                  } else {
                      setEditMode(true);
                  }
              }}
              className={"px-3 py-2 text-xs font-medium rounded-lg border transition cursor-pointer flex items-center gap-1.5 outline-none " + (
                editMode 
                  ? "bg-[#C20F47] text-white border-[#C20F47] shadow-sm" 
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
              )}
            >
              {editMode ? (
                <><X className="w-3.5 h-3.5" /> Exit Edit</>
              ) : (
                <><Edit3 className="w-3.5 h-3.5" /> {isAdmin ? "Edit Timetable" : "My Slots"}</>
              )}
            </button>

            <button
              id="teacher-only-toggle"
              onClick={() => setFilterTeacher(!filterTeacher)}
              className={"px-3 py-2 text-xs font-medium rounded-lg border transition cursor-pointer outline-none flex items-center gap-1.5 " + (
                filterTeacher 
                  ? "bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm" 
                  : "bg-white hover:bg-slate-50 border-slate-200 text-slate-600"
              )}
            >
              <Filter className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{filterTeacher ? "My Slots Only" : "All Schedules"}</span>
              <span className="sm:hidden">Filter</span>
            </button>

            {isAdmin && (
              <button
                onClick={() => setIsSetupMode(!isSetupMode)}
                className={"px-3 py-2 text-xs font-medium rounded-lg border transition cursor-pointer outline-none flex items-center gap-1.5 " + (
                  isSetupMode 
                    ? "bg-slate-800 text-white border-slate-900 shadow-sm" 
                    : "bg-white hover:bg-slate-50 border-slate-200 text-slate-700"
                )}
              >
                <Settings className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Setup & Config</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. Content */}
      {isSetupMode ? (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
          <div className="flex justify-between items-end mb-5">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Timetable Configuration</h3>
              <p className="text-slate-400 text-xs mt-0.5">Lesson frequency rules per subject</p>
            </div>
            <button 
              onClick={() => setIsSetupMode(false)}
              className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 font-medium text-xs hover:bg-slate-50 transition cursor-pointer"
            >
              Back to Timetables
            </button>
          </div>

          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Lesson Limits per Subject</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(lessonLimits).map(([subject, limit]) => (
                  <div key={subject} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col">
                    <span className="text-sm font-semibold text-slate-800 mb-2">{subject}</span>
                    <div className="flex items-center gap-2 mt-auto">
                      <input 
                        type="number"
                        value={limit}
                        onChange={(e) => setLessonLimits({...lessonLimits, [subject]: parseInt(e.target.value) || 0})}
                        className="w-16 px-2 py-1.5 border border-slate-200 rounded-lg text-center tabular-nums font-semibold text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20"
                        min="0"
                      />
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wide">Lessons / wk</span>
                    </div>
                  </div>
                ))}
                
                {/* Add new subject limit */}
                <div className="bg-rose-50/40 p-3 rounded-xl border border-rose-100 border-dashed flex flex-col justify-center items-center text-[#C20F47] hover:bg-rose-50 cursor-pointer transition min-h-[64px]">
                  <span className="text-xs font-medium">+ Add Subject Rule</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-800 mb-2 border-b border-slate-100 pb-2">Lesson Count Audit</h4>
              <p className="text-xs text-slate-400 mb-3">Scheduled vs configured for {selectedForm}.</p>
              
              <div className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-2.5 font-medium text-slate-500 text-xs">Subject</th>
                      <th className="px-4 py-2.5 font-medium text-slate-500 text-xs text-center">Scheduled</th>
                      <th className="px-4 py-2.5 font-medium text-slate-500 text-xs text-center">Limit</th>
                      <th className="px-4 py-2.5 font-medium text-slate-500 text-xs text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {Object.entries(lessonLimits).map(([subject, limitVal]) => {
                      const limit = limitVal as number;
                      // Count scheduled lessons for this form
                      let count = 0;
                      DAYS.forEach(d => {
                        const s = schedule[selectedForm]?.[d];
                        if (s) {
                          Object.values(s).forEach((slot: any) => {
                            if (slot?.subject && slot.subject.toLowerCase() === subject.toLowerCase()) count++;
                          });
                        }
                      });
                      
                      const isOver = count > limit;
                      const isUnder = count < limit;

                      return (
                        <tr key={subject} className="bg-white">
                          <td className="px-4 py-2.5 font-semibold text-slate-800 text-sm">{subject}</td>
                          <td className="px-4 py-2.5 tabular-nums font-medium text-slate-600 text-center text-sm">{count}</td>
                          <td className="px-4 py-2.5 tabular-nums font-medium text-slate-400 text-center text-sm">{limit}</td>
                          <td className="px-4 py-3 text-center">
                            {isOver ? (
                              <span className="px-2 py-0.5 bg-rose-50 text-rose-600 font-medium text-[11px] rounded">Over Limit</span>
                            ) : isUnder ? (
                              <span className="px-2 py-0.5 bg-amber-50 text-amber-600 font-medium text-[11px] rounded">Under Limit</span>
                            ) : (
                              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 font-medium text-[11px] rounded">Optimal</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
      <div className="bg-white rounded-2xl border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] shadow-sm overflow-hidden relative">
        <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">Timetable Matrix</h3>
            <p className="text-slate-400 text-xs mt-0.5">{viewMode === 'weekly' ? selectedForm : 'All classes'}</p>
          </div>
          {editMode && (
            <div className="text-[11px] font-medium text-[#C20F47] bg-[#C20F47]/10 px-2.5 py-1 rounded-full animate-pulse border border-[#C20F47]/20 hidden sm:block">
                Edit mode — click a cell to modify
            </div>
          )}
        </div>

        <div className="overflow-x-auto pb-3">
          <table className="w-full text-left border-collapse min-w-[820px] select-none">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500 shadow-sm">
                <th className="py-2.5 px-3 border-r border-slate-200 w-20 sticky left-0 z-20 bg-slate-50">{viewMode === 'weekly' ? 'Day' : 'Class'}</th>
                {SLOTS.map((slot) => (
                  <th key={slot.name} className="py-2.5 px-2 text-center border-r border-slate-200 leading-snug last:border-0 relative w-32">
                    <span className="block text-slate-700 font-medium">{slot.name}</span>
                    <span className="text-[10px] text-indigo-600 font-medium mt-0.5 inline-block bg-indigo-50 px-1.5 py-0.5 rounded tabular-nums">{slot.time}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm bg-white">
              {rowDefinitions.length === 0 ? (
                <tr>
                  <td colSpan={SLOTS.length + 1} className="py-12 text-center text-slate-400 bg-slate-50/50">
                    <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-600 font-semibold text-sm">No academic classes scheduled.</p>
                    <p className="text-slate-400 text-xs mt-1">Enjoy the weekend.</p>
                  </td>
                </tr>
              ) : rowDefinitions.map((rowDef) => (
                <tr key={rowDef.key} className="transition group">
                  <td className="py-4 px-3 border-r border-slate-200 font-semibold text-slate-700 text-center text-xs bg-slate-50 sticky left-0 z-10 shadow-[1px_0_2px_rgba(0,0,0,0.05)]">
                    {rowDef.label}
                  </td>
                  {SLOTS.map((slot) => {
                    const day = rowDef.day;
                    const isOngoing = day === realDayName && 
                        browseDate.toDateString() === now.toDateString() && 
                        realMins >= slot.start && realMins < slot.end;

                    if (slot.type === "offset") {
                      return (
                        <td key={slot.name} className={"py-4 px-2 text-center border-r border-slate-200 last:border-0 relative overflow-hidden " + (isOngoing ? "bg-amber-100/50" : "bg-slate-100/50")}>
                          <div className="absolute inset-0 flex items-center justify-center opacity-30 transform -rotate-45 pointer-events-none">
                               <span className="text-[11px] font-medium uppercase text-slate-400 tracking-[0.15em]">{slot.name}</span>
                          </div>
                          <span className={"relative z-10 text-xs font-semibold uppercase tracking-wide italic drop-shadow-sm pointer-events-none " + (isOngoing ? "text-amber-600" : "text-slate-500")}>
                            {slot.name.includes("Tea") ? "☕ BREAK" : "🍲 LUNCH"}
                          </span>
                          {isOngoing && <div className="absolute bottom-1 right-2 text-[10px] font-medium text-amber-600 animate-pulse tabular-nums">{slot.end - realMins}m left</div>}
                        </td>
                      );
                    }
                    if (slot.type === "games") {
                      return (
                        <td key={slot.name} className={"py-4 px-2 text-center border-r border-slate-200 last:border-0 relative overflow-hidden " + (isOngoing ? "bg-emerald-100" : "bg-emerald-50")}>
                          <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.4)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px] pointer-events-none"></div>
                          <span className="relative z-10 text-xs font-semibold text-emerald-700 uppercase italic pointer-events-none">
                            ⚽ Clubs / Games
                          </span>
                          {isOngoing && <div className="absolute bottom-1 right-2 text-[10px] font-medium text-emerald-700 animate-pulse tabular-nums">{slot.end - realMins}m left</div>}
                        </td>
                      );
                    }

                    const targetClass = schedule[rowDef.form]?.[rowDef.day]?.[slot.name];
                    const slotTeacher = targetClass?.teacher || "";
                    const isMySlot = !!(teacherInfo?.name) && !!slotTeacher && (
                      slotTeacher.toLowerCase().includes(teacherInfo.name.toLowerCase()) || 
                      teacherInfo.name.toLowerCase().includes(slotTeacher.toLowerCase())
                    );

                    const matchesSearch = searchTeacherQuery 
                        ? slotTeacher.toLowerCase().includes(searchTeacherQuery.toLowerCase())
                        : true;

                    // If teacher filter is on and it is NOT my slot, or if search doesn't match, render empty
                    if ((filterTeacher && !isMySlot) || (searchTeacherQuery && !matchesSearch)) {
                      return (
                        <td key={slot.name} className={"p-1 border-r border-slate-200 last:border-0 " + (isOngoing ? "bg-indigo-50/30" : "bg-slate-50/30")}>
                          {editMode && (
                            <div 
                              className="w-full h-full cursor-pointer min-h-[90px]"
                              onClick={() => handleCellClick(rowDef.day, slot.name, rowDef.form)} 
                            />
                          )}
                        </td>
                      );
                    }

                    // aSc style distinctive colored blocks
                    let blockColor = "bg-white text-slate-500";
                    let innerBorder = "border border-slate-200/50 rounded-lg";
                    if (targetClass) {
                        // Deterministic color generation based on subject length + room
                        const hash = (targetClass.subject.length * 13 + targetClass.room.length * 7) % 5;
                        const colors = [
                            "bg-blue-50 border-blue-200/60 shadow-[0_2px_4px_rgba(59,130,246,0.05)]", 
                            "bg-rose-50 border-rose-200/60 shadow-[0_2px_4px_rgba(244,63,94,0.05)]", 
                            "bg-amber-50 border-amber-200/60 shadow-[0_2px_4px_rgba(245,158,11,0.05)]", 
                            "bg-emerald-50 border-emerald-200/60 shadow-[0_2px_4px_rgba(16,185,129,0.05)]", 
                            "bg-purple-50 border-purple-200/60 shadow-[0_2px_4px_rgba(168,85,247,0.05)]"
                        ];
                        blockColor = colors[hash];
                        innerBorder = "border rounded-xl";
                        if (isMySlot) blockColor = "bg-indigo-100 border-indigo-300 ring-2 ring-indigo-500/30 shadow-[0_2px_8px_rgba(99,102,241,0.15)]"; // highlight mine
                        if (isOngoing) blockColor = "bg-[#C20F47]/5 border-[#C20F47]/30 ring-2 ring-[#C20F47]/40 shadow-[0_4px_12px_rgba(194,15,71,0.15)] overflow-hidden scale-100 z-10";
                    }

                    return (
                      <td 
                        key={slot.name} 
                        onClick={() => handleCellClick(rowDef.day, slot.name, rowDef.form)}
                        className={"p-2 border-r border-slate-200 last:border-0 transition text-center relative h-full align-top " + 
                          (editMode ? "cursor-pointer hover:bg-slate-100/50 group/cell" : "")
                        }
                      >
                         {isOngoing && targetClass && (
                             <div className="absolute top-0 right-1 z-20 pointer-events-none mt-1 mr-1">
                                 <span className="flex items-center gap-1 text-[10px] font-medium tabular-nums text-[#C20F47] bg-white border border-[#C20F47]/20 px-1.5 py-0.5 rounded-full shadow-sm">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#C20F47] animate-pulse"></span>
                                    {slot.end - realMins}m
                                 </span>
                             </div>
                         )}
                         <div className={"w-full h-full min-h-[68px] p-1.5 flex flex-col justify-center items-center transition-all duration-200 relative " + blockColor + " " + innerBorder + (editMode ? " group-hover/cell:scale-[1.03] group-hover/cell:shadow-md" : (targetClass && !isOngoing ? " hover:bg-slate-50" : ""))}>
                            {targetClass ? (
                            <>
                                <span className="block font-semibold text-slate-800 text-xs leading-tight mb-0.5 text-center" style={{ textShadow: "0 1px 0 rgba(255,255,255,0.7)"}}>
                                {targetClass.subject}
                                </span>
                                <span className="block text-[11px] font-medium text-slate-500 mb-1 opacity-90 truncate px-1 text-center max-w-full">
                                {targetClass.teacher}
                                </span>
                                <div className="mt-auto flex justify-center w-full">
                                    <span className="inline-flex items-center justify-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-white shadow-sm text-slate-600 font-medium border border-slate-200 max-w-full truncate">
                                    {targetClass.room}
                                    </span>
                                </div>
                            </>
                            ) : (
                            <span className="text-slate-300 font-medium text-[11px] opacity-50 select-none">— free —</span>
                            )}
                         </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Edit Slot Modal */}
      {editingCell && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border-x-2 border-b-2 border-[#C20F47] border-t-[8px] border-t-[#F39C2A] rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-slide-up">
            <div className="px-5 py-3.5 bg-[#3D1D3F] text-white flex items-center justify-between">
              <h3 className="font-semibold text-sm">
                {!isAdmin && editingCell.current && !isCellMySlot(editingCell) 
                  ? "Request Shift Switch" 
                  : "Edit Timetable Cell"}
              </h3>
              <button 
                onClick={() => setEditingCell(null)}
                className="p-1.5 hover:bg-white/10 rounded-lg transition cursor-pointer border-none bg-transparent"
              >
                <X className="w-3.5 h-3.5 text-white/80" />
              </button>
            </div>
            
            <div className="p-5 space-y-3.5">
              <div className="flex items-center gap-2 mb-3 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                <div className="bg-white px-2 py-1 rounded-md shadow-sm border border-slate-200 font-semibold text-slate-600 text-[11px] uppercase tracking-wide">{editingCell.day.substring(0,3)}</div>
                <div className="font-semibold text-sm text-slate-800">{editingCell.slotName}</div>
                <div className="ml-auto text-[11px] font-medium text-indigo-600 uppercase tracking-wide">FORM {editingCell.form}</div>
              </div>

              {!isAdmin && editingCell.current && !isCellMySlot(editingCell) ? (
                // Switch request narrative
                <div className="space-y-3 text-center py-2">
                    <ArrowRightLeft className="w-8 h-8 mx-auto text-indigo-500 mb-1 opacity-50" />
                    <p className="text-sm text-slate-600">You're requesting to cover or swap this slot, currently assigned to <strong className="text-slate-900 font-semibold">{editingCell.current.teacher}</strong>.</p>
                    <p className="text-xs text-slate-400">A request will be sent to the academic master and assigned teacher.</p>
                </div>
              ) : (
                // Direct edit fields
                <>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500">Subject <span className="text-slate-400">(empty to clear)</span></label>
                    <input 
                    type="text" 
                    value={editForm.subject}
                    onChange={e => setEditForm({...editForm, subject: e.target.value})}
                    placeholder="e.g. Mathematics"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition-all"
                    />
                </div>
                
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500">Teacher</label>
                    <input 
                    type="text" 
                    value={editForm.teacher}
                    onChange={e => setEditForm({...editForm, teacher: e.target.value})}
                    placeholder="e.g. Mr. Smith"
                    disabled={!isAdmin && isCellMySlot({ current: editForm })} 
                    className={"w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:bg-white transition-all " + (!isAdmin && isCellMySlot({ current: editForm }) ? "opacity-60 cursor-not-allowed" : "focus:ring-2 focus:ring-[#C20F47]/20")}
                    />
                    {!isAdmin && isCellMySlot({ current: editForm }) && (
                        <p className="text-[11px] text-slate-400 mt-1 leading-tight">Teachers can't reassign their own slots — request a swap or contact admin.</p>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-500">Room / Lab</label>
                    <input 
                    type="text" 
                    value={editForm.room}
                    onChange={e => setEditForm({...editForm, room: e.target.value})}
                    placeholder="e.g. F4 East"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#C20F47]/20 focus:bg-white transition-all"
                    />
                </div>
                </>
              )}
            </div>

            <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button 
                onClick={() => setEditingCell(null)}
                className="px-3.5 py-2 font-medium text-sm text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition rounded-lg outline-none cursor-pointer border-none bg-transparent"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-[#C20F47] hover:bg-[#3D1D3F] text-white text-sm font-medium rounded-lg shadow-sm transition-all active:scale-95 flex items-center gap-1.5 outline-none cursor-pointer border-none"
              >
                {!isAdmin && editingCell.current && !isCellMySlot(editingCell) ? (
                     <><ArrowRightLeft className="w-4 h-4" /> Send Request</>
                ) : (
                     <><Save className="w-4 h-4" /> Save Slot</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
