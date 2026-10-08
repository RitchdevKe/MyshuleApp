"use client";

import React, { useState, useMemo } from "react";
import { addCalendarEvent } from './actions';
import {
  ChevronLeft, ChevronRight, Plus, Clock, MapPin,
  Users, X, CalendarDays, Zap, BookOpen, DollarSign,
  Trophy, Megaphone, GraduationCap, Briefcase, Star,
  Check, AlertCircle
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventCategory = "exam" | "fee" | "sports" | "holiday" | "meeting" | "academic" | "other";

interface CalEvent {
  id: string;
  title: string;
  date: string;          // "YYYY-MM-DD"
  time?: string;
  endTime?: string;
  location?: string;
  attendees?: string;
  category: EventCategory;
  description?: string;
}

// ─── Category Config ──────────────────────────────────────────────────────────

const CAT: Record<EventCategory, { label: string; icon: React.ElementType; pill: string; dot: string; border: string; bg: string }> = {
  exam:     { label: "Exam",      icon: BookOpen,      pill: "bg-blue-100 text-blue-700",    dot: "bg-blue-500",    border: "border-blue-300",   bg: "bg-blue-50" },
  fee:      { label: "Finance",   icon: DollarSign,    pill: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", border: "border-emerald-300", bg: "bg-emerald-50" },
  sports:   { label: "Sports",    icon: Trophy,        pill: "bg-orange-100 text-orange-700", dot: "bg-orange-500",  border: "border-orange-300",  bg: "bg-orange-50" },
  holiday:  { label: "Holiday",   icon: Star,          pill: "bg-pink-100 text-pink-700",    dot: "bg-pink-500",    border: "border-pink-300",    bg: "bg-pink-50" },
  meeting:  { label: "Meeting",   icon: Briefcase,     pill: "bg-violet-100 text-violet-700",dot: "bg-violet-500",  border: "border-violet-300",  bg: "bg-violet-50" },
  academic: { label: "Academic",  icon: GraduationCap, pill: "bg-sky-100 text-sky-700",      dot: "bg-sky-500",     border: "border-sky-300",     bg: "bg-sky-50" },
  other:    { label: "Other",     icon: Megaphone,     pill: "bg-slate-100 text-slate-700",  dot: "bg-slate-400",   border: "border-slate-300",   bg: "bg-slate-50" },
};

// ─── Mock Events ──────────────────────────────────────────────────────────────

const NOW = new Date();
const Y = NOW.getFullYear();
const M = NOW.getMonth(); // 0-indexed

function d(day: number, mo = M) {
  return `${Y}-${String(mo + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

let EVENTS: CalEvent[] = [];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_SHORT = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const DAYS_FULL  = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

function daysInMonth(year: number, month: number) { return new Date(year, month + 1, 0).getDate(); }
function firstDayOfMonth(year: number, month: number) { return new Date(year, month, 1).getDay(); }
function toDateStr(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
}
function todayStr() {
  const t = new Date();
  return toDateStr(t.getFullYear(), t.getMonth(), t.getDate());
}

// ─── Components ───────────────────────────────────────────────────────────────

function EventPill({ event, compact = false }: { event: CalEvent; compact?: boolean }) {
  const cat = CAT[event.category];
  const Icon = cat.icon;
  return (
    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] font-bold cursor-pointer hover:-translate-y-0.5 transition-transform ${cat.pill} border ${cat.border} truncate`}>
      {!compact && <Icon className="w-2.5 h-2.5 flex-shrink-0" />}
      <span className="truncate">{event.title}</span>
    </div>
  );
}

interface EventModalProps { event: CalEvent; onClose: () => void; }
function EventModal({ event, onClose }: EventModalProps) {
  const cat = CAT[event.category];
  const Icon = cat.icon;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-6 z-10"
        onClick={e => e.stopPropagation()}
      >
        {/* Top colour strip */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl ${cat.dot}`} />

        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3 mb-5 mt-2">
          <div className={`w-11 h-11 rounded-2xl ${cat.bg} border ${cat.border} flex items-center justify-center flex-shrink-0`}>
            <Icon className={`w-5 h-5 ${cat.pill.split(" ")[1]}`} />
          </div>
          <div>
            <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${cat.pill}`}>{cat.label}</span>
            <h2 className="text-xl font-black text-slate-800 mt-1 leading-tight">{event.title}</h2>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2.5 text-sm text-slate-600">
            <CalendarDays className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="font-semibold">{event.date}</span>
            {event.time && <><span className="text-slate-300">·</span><span className="font-semibold">{event.time}{event.endTime ? ` – ${event.endTime}` : ""}</span></>}
          </div>
          {event.location && (
            <div className="flex items-center gap-2.5 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-semibold">{event.location}</span>
            </div>
          )}
          {event.attendees && (
            <div className="flex items-center gap-2.5 text-sm text-slate-600">
              <Users className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <span className="font-semibold">{event.attendees}</span>
            </div>
          )}
          {event.description && (
            <p className="text-sm text-slate-500 bg-slate-50 rounded-2xl p-4 border border-slate-100 font-medium leading-relaxed">
              {event.description}
            </p>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <button className="flex-1 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-black hover:bg-indigo-700 transition-colors">Edit Event</button>
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 text-sm font-black hover:bg-slate-200 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

interface AddEventModalProps { defaultDate: string; onClose: () => void; onAdd: (e: CalEvent) => void; }
function AddEventModal({ defaultDate, onClose, onAdd }: AddEventModalProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [location, setLocation] = useState("");
  const [attendees, setAttendees] = useState("");
  const [category, setCategory] = useState<EventCategory>("other");
  const [description, setDescription] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      id: `new-${Date.now()}`,
      title: title.trim(),
      date,
      time: time || undefined,
      endTime: endTime || undefined,
      location: location || undefined,
      attendees: attendees || undefined,
      category,
      description: description || undefined,
    });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 z-10 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-xl font-black text-slate-800 mb-5">New Calendar Event</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Event Title *</label>
            <input
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. End of Term Exams"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all placeholder:text-slate-400"
            />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Category</label>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(CAT) as EventCategory[]).map(cat => {
                const c = CAT[cat];
                const Icon = c.icon;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black border transition-all ${category === cat ? `${c.pill} ${c.border} scale-105 shadow-sm` : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"}`}
                  >
                    <Icon className="w-3.5 h-3.5" />{c.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-3 sm:col-span-1">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Date *</label>
              <input required type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Start Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all" />
            </div>
            <div>
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">End Time</label>
              <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all" />
            </div>
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Location</label>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Main Hall"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all placeholder:text-slate-400" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Attendees</label>
            <input value={attendees} onChange={e => setAttendees(e.target.value)} placeholder="e.g. All Students"
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all placeholder:text-slate-400" />
          </div>

          <div>
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1.5">Description</label>
            <textarea value={description} onChange={e => setDescription(e.target.value)} rows={3} placeholder="Optional details..."
              className="w-full border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all placeholder:text-slate-400 resize-none" />
          </div>

          <div className="flex gap-2 pt-2">
            <button type="submit" className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-black shadow-md shadow-indigo-300/30 hover:shadow-indigo-400/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> Save Event
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-700 text-sm font-black hover:bg-slate-200 transition-colors">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function CalendarClient({ initialEvents }: { initialEvents: any[] }) {
  if (EVENTS.length === 0 && initialEvents.length > 0) {
    EVENTS = initialEvents;
  }

  const today = new Date();
  const [year, setYear]   = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [view, setView]   = useState<"month" | "week" | "day">("month");
  const [selectedDay, setSelectedDay]       = useState<string | null>(null);
  const [viewingEvent, setViewingEvent]     = useState<CalEvent | null>(null);
  const [addingForDate, setAddingForDate]   = useState<string | null>(null);
  const [filterCat, setFilterCat]           = useState<EventCategory | "all">("all");
  const [events, setEvents]                 = useState<CalEvent[]>(EVENTS);

  const todStr = todayStr();

  function addMonth(delta: number) {
    let m = month + delta;
    let y = year;
    if (m < 0)  { m = 11; y -= 1; }
    if (m > 11) { m = 0;  y += 1; }
    setMonth(m); setYear(y);
  }

  function goToday() {
    setYear(today.getFullYear());
    setMonth(today.getMonth());
    setSelectedDay(todStr);
  }

  const filteredEvents = useMemo(() =>
    filterCat === "all" ? events : events.filter(e => e.category === filterCat),
    [events, filterCat]);

  function eventsOnDate(dateStr: string) {
    return filteredEvents.filter(e => e.date === dateStr);
  }

  // Today's events for the sidebar
  const todayEvents = events.filter(e => e.date === todStr)
    .sort((a, b) => (a.time || "").localeCompare(b.time || ""));

  // Upcoming (next 7 days, excluding today)
  const upcomingEvents = useMemo(() => {
    const start = new Date(today); start.setDate(start.getDate() + 1);
    const end   = new Date(today); end.setDate(end.getDate() + 14);
    return events
      .filter(e => { const d = new Date(e.date); return d >= start && d <= end; })
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 5);
  }, [events]);

  // Month grid
  const firstDay  = firstDayOfMonth(year, month);
  const totalDays = daysInMonth(year, month);

  // Term label (rough)
  function termLabel() {
    if (month >= 0 && month <= 3)  return "Term 1";
    if (month >= 4 && month <= 7)  return "Term 2";
    return "Term 3";
  }

  // Stats for current month
  const monthEvents = events.filter(e => {
    const [y, m] = e.date.split("-").map(Number);
    return y === year && m === month + 1;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-5 pb-16 pt-2">

      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">School Calendar</h1>
          <p className="text-sm text-slate-500 font-medium mt-0.5">Manage academic events, holidays, and operational schedules.</p>
        </div>
        <button
          onClick={() => setAddingForDate(todStr)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-black text-white bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl shadow-lg shadow-indigo-300/40 hover:shadow-indigo-400/60 hover:-translate-y-0.5 transition-all"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      </div>

      {/* ── Month Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Events This Month", value: monthEvents.length,                                          icon: CalendarDays,   color: "text-indigo-600 bg-indigo-50" },
          { label: "Exams Scheduled",   value: monthEvents.filter(e=>e.category==="exam").length,           icon: BookOpen,       color: "text-blue-600 bg-blue-50" },
          { label: "Upcoming Today",    value: todayEvents.length,                                          icon: Zap,            color: "text-emerald-600 bg-emerald-50" },
          { label: "Holidays",          value: monthEvents.filter(e=>e.category==="holiday").length,        icon: Star,           color: "text-pink-600 bg-pink-50" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}><Icon className="w-5 h-5" /></div>
            <div>
              <p className="text-2xl font-black text-slate-800">{value}</p>
              <p className="text-xs font-bold text-slate-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Controls ── */}
      <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-3.5 flex flex-wrap items-center gap-3 shadow-sm">
        {/* View toggle */}
        <div className="flex bg-slate-100 p-1 rounded-xl gap-1">
          {(["month","week","day"] as const).map(v => (
            <button key={v} onClick={() => setView(v)}
              className={`px-4 py-1.5 text-xs font-black rounded-lg capitalize transition-all ${view===v ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500 hover:text-slate-800"}`}>
              {v}
            </button>
          ))}
        </div>

        <div className="w-px h-5 bg-slate-200" />

        {/* Category filter */}
        <div className="flex flex-wrap gap-1.5">
          <button onClick={() => setFilterCat("all")}
            className={`px-3 py-1 rounded-full text-[11px] font-black transition-all ${filterCat==="all" ? "bg-slate-700 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
            All
          </button>
          {(Object.keys(CAT) as EventCategory[]).map(cat => {
            const c = CAT[cat];
            const Icon = c.icon;
            return (
              <button key={cat} onClick={() => setFilterCat(cat)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-black border transition-all ${filterCat===cat ? `${c.pill} ${c.border} scale-105 shadow-sm` : "bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200"}`}>
                <Icon className="w-3 h-3" />{c.label}
              </button>
            );
          })}
        </div>

        {/* Month navigator */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button onClick={() => addMonth(-1)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-600" />
          </button>
          <button onClick={goToday} className="px-3 py-1.5 rounded-xl text-xs font-black text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors">Today</button>
          <button onClick={() => addMonth(1)} className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-600" />
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg overflow-hidden flex flex-col">

          {/* Month Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100/80 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-t-3xl">
            <div>
              <h2 className="text-2xl font-black">{MONTHS[month]} <span className="text-indigo-200 font-medium">{year}</span></h2>
            </div>
            <span className="text-xs font-black bg-white/20 px-3 py-1 rounded-full">{termLabel()}</span>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-slate-100">
            {DAYS_SHORT.map((d, i) => (
              <div key={d} className={`py-2.5 text-center text-[11px] font-black uppercase tracking-wider ${i===0||i===6 ? "text-rose-400" : "text-slate-500"}`}>{d}</div>
            ))}
          </div>

          {/* Month view */}
          {view === "month" && (
            <div className="grid grid-cols-7 flex-1">
              {/* Leading empty cells */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`pre-${i}`} className="min-h-[100px] bg-slate-50/60 border-r border-b border-slate-100/80 p-2" />
              ))}

              {/* Day cells */}
              {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => {
                const dateStr = toDateStr(year, month, day);
                const dayEvents = eventsOnDate(dateStr);
                const isToday = dateStr === todStr;
                const isSelected = dateStr === selectedDay;
                const isWeekend = (new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6);

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDay(dateStr === selectedDay ? null : dateStr)}
                    className={`min-h-[100px] border-r border-b border-slate-100/80 p-2 cursor-pointer transition-all group relative flex flex-col
                      ${isToday ? "bg-indigo-50/60" : isWeekend ? "bg-rose-50/30" : "bg-white hover:bg-slate-50/80"}
                      ${isSelected ? "ring-2 ring-inset ring-indigo-400" : ""}
                    `}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-sm font-black w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                        isToday
                          ? "bg-indigo-600 text-white shadow-md shadow-indigo-400/40"
                          : isSelected
                            ? "bg-indigo-100 text-indigo-700"
                            : isWeekend
                              ? "text-rose-400"
                              : "text-slate-700 group-hover:text-indigo-600"
                      }`}>{day}</span>

                      <button
                        onClick={e => { e.stopPropagation(); setAddingForDate(dateStr); }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-0.5 flex-1">
                      {dayEvents.slice(0, 2).map(ev => (
                        <div key={ev.id} onClick={e => { e.stopPropagation(); setViewingEvent(ev); }}>
                          <EventPill event={ev} />
                        </div>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-[10px] font-black text-slate-400 px-1">+{dayEvents.length - 2} more</div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Trailing empty cells */}
              {(() => {
                const total = firstDay + totalDays;
                const rem = total % 7 === 0 ? 0 : 7 - (total % 7);
                return Array.from({ length: rem }).map((_, i) => (
                  <div key={`post-${i}`} className="min-h-[100px] bg-slate-50/60 border-r border-b border-slate-100/80 p-2" />
                ));
              })()}
            </div>
          )}

          {/* Week view */}
          {view === "week" && (() => {
            const td = new Date(today);
            const dow = td.getDay();
            const weekStart = new Date(td); weekStart.setDate(td.getDate() - dow);
            const weekDays = Array.from({ length: 7 }, (_, i) => {
              const d = new Date(weekStart); d.setDate(weekStart.getDate() + i);
              return { date: d, str: toDateStr(d.getFullYear(), d.getMonth(), d.getDate()) };
            });
            return (
              <div className="flex flex-1">
                {weekDays.map(({ date: wd, str }) => {
                  const dayEvs = eventsOnDate(str);
                  const isToday = str === todStr;
                  const isWknd  = wd.getDay() === 0 || wd.getDay() === 6;
                  return (
                    <div key={str} className={`flex-1 border-r border-slate-100 p-3 min-h-[300px] ${isToday ? "bg-indigo-50/50" : isWknd ? "bg-rose-50/20" : "bg-white"}`}>
                      <div className={`text-center mb-3`}>
                        <p className={`text-[11px] font-black uppercase tracking-wider ${isToday ? "text-indigo-600" : "text-slate-400"}`}>{DAYS_SHORT[wd.getDay()]}</p>
                        <span className={`text-lg font-black w-9 h-9 rounded-full flex items-center justify-center mx-auto mt-1 ${isToday ? "bg-indigo-600 text-white shadow-md" : "text-slate-700"}`}>{wd.getDate()}</span>
                      </div>
                      <div className="space-y-1">
                        {dayEvs.map(ev => (
                          <div key={ev.id} onClick={() => setViewingEvent(ev)}>
                            <EventPill event={ev} compact />
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* Day view */}
          {view === "day" && (() => {
            const dayToShow = selectedDay || todStr;
            const dayEvs = eventsOnDate(dayToShow).sort((a,b) => (a.time||"").localeCompare(b.time||""));
            const dateObj = new Date(dayToShow + "T12:00:00");
            return (
              <div className="p-6 min-h-[300px]">
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-2xl font-black text-slate-800">{DAYS_FULL[dateObj.getDay()]}</span>
                  <span className="text-xl font-bold text-slate-400">{dateObj.getDate()} {MONTHS[dateObj.getMonth()]}</span>
                  {dayToShow === todStr && <span className="text-xs font-black bg-indigo-600 text-white px-2.5 py-0.5 rounded-full ml-1">Today</span>}
                </div>
                {dayEvs.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <CalendarDays className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-bold">No events on this day</p>
                    <button onClick={() => setAddingForDate(dayToShow)} className="mt-3 text-xs font-black text-indigo-600 hover:underline">+ Add Event</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dayEvs.map(ev => {
                      const cat = CAT[ev.category];
                      const Icon = cat.icon;
                      return (
                        <div key={ev.id} onClick={() => setViewingEvent(ev)}
                          className={`flex gap-4 p-4 rounded-2xl border ${cat.border} ${cat.bg} cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all`}>
                          <div className={`w-10 h-10 rounded-xl ${cat.pill} border ${cat.border} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <p className="font-black text-slate-800">{ev.title}</p>
                            {ev.time && <p className="text-xs font-bold text-slate-500 mt-0.5 flex items-center gap-1"><Clock className="w-3 h-3" />{ev.time}{ev.endTime ? ` – ${ev.endTime}` : ""}</p>}
                            {ev.location && <p className="text-xs font-bold text-slate-500 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</p>}
                          </div>
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full self-start ${cat.pill}`}>{cat.label}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* ── Right Sidebar ── */}
        <div className="space-y-5">

          {/* Today's Schedule */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-md">
            <h3 className="font-black text-slate-800 flex items-center gap-2 mb-4">
              <div className="w-7 h-7 bg-indigo-50 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-indigo-600" />
              </div>
              Today's Schedule
            </h3>
            {todayEvents.length === 0 ? (
              <p className="text-sm text-slate-400 font-medium text-center py-4">No events today</p>
            ) : (
              <div className="space-y-4">
                {todayEvents.map(ev => {
                  const cat = CAT[ev.category];
                  return (
                    <div
                      key={ev.id}
                      onClick={() => setViewingEvent(ev)}
                      className={`relative pl-4 border-l-2 ${cat.border} cursor-pointer group hover:pl-5 transition-all`}
                    >
                      <div className={`absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white ${cat.dot}`} />
                      {ev.time && <p className={`text-[11px] font-black mb-0.5 ${cat.pill.split(" ")[1]}`}>{ev.time}{ev.endTime ? ` – ${ev.endTime}` : ""}</p>}
                      <p className="text-sm font-black text-slate-800 group-hover:text-indigo-700 transition-colors">{ev.title}</p>
                      {ev.location && <p className="text-xs font-bold text-slate-400 mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{ev.location}</p>}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Upcoming Events */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-3xl shadow-xl shadow-slate-900/30 p-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />

            <h3 className="font-black text-white flex items-center gap-2 mb-4 relative z-10">
              <div className="w-7 h-7 bg-white/10 rounded-lg flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-indigo-300" />
              </div>
              Upcoming
            </h3>

            <div className="space-y-2 relative z-10">
              {upcomingEvents.length === 0 ? (
                <p className="text-slate-400 text-sm font-medium text-center py-4">No upcoming events</p>
              ) : upcomingEvents.map(ev => {
                const cat = CAT[ev.category];
                const Icon = cat.icon;
                const evDate = new Date(ev.date + "T12:00:00");
                const diffDays = Math.round((evDate.getTime() - today.getTime()) / 86400000);
                const whenLabel = diffDays === 1 ? "Tomorrow" : diffDays <= 7 ? `In ${diffDays} days` : `${evDate.getDate()} ${MONTHS[evDate.getMonth()].slice(0,3)}`;
                return (
                  <div
                    key={ev.id}
                    onClick={() => setViewingEvent(ev)}
                    className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 hover:bg-white/15 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${cat.pill}`}>{whenLabel}</span>
                      <Icon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <p className="text-sm font-bold text-white group-hover:text-indigo-200 transition-colors truncate">{ev.title}</p>
                    {ev.time && <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{ev.time}</p>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Legend */}
          <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-4 shadow-sm">
            <p className="text-[11px] font-black text-slate-500 uppercase tracking-wider mb-3">Event Categories</p>
            <div className="space-y-2">
              {(Object.keys(CAT) as EventCategory[]).map(cat => {
                const c = CAT[cat];
                const Icon = c.icon;
                return (
                  <div key={cat} className="flex items-center gap-2">
                    <div className={`w-5 h-5 rounded-md ${c.dot} flex items-center justify-center`}>
                      <Icon className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-600">{c.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Day Events */}
          {selectedDay && view === "month" && (() => {
            const selEvs = eventsOnDate(selectedDay);
            const dateObj = new Date(selectedDay + "T12:00:00");
            if (!selEvs.length && selectedDay !== todStr) return null;
            return (
              <div className="bg-white/70 backdrop-blur-xl border border-white/80 rounded-3xl p-5 shadow-md">
                <h3 className="font-black text-slate-800 text-sm mb-3">
                  {dateObj.getDate()} {MONTHS[dateObj.getMonth()]}
                  {selectedDay === todStr && <span className="ml-2 text-[10px] font-black bg-indigo-600 text-white px-2 py-0.5 rounded-full">Today</span>}
                </h3>
                {selEvs.length === 0 ? (
                  <div className="text-center py-4">
                    <AlertCircle className="w-6 h-6 text-slate-300 mx-auto mb-1" />
                    <p className="text-xs text-slate-400 font-bold">No events</p>
                    <button onClick={() => setAddingForDate(selectedDay)} className="mt-2 text-xs font-black text-indigo-600 hover:underline">+ Add one</button>
                  </div>
                ) : selEvs.map(ev => {
                  const cat = CAT[ev.category];
                  const Icon = cat.icon;
                  return (
                    <div key={ev.id} onClick={() => setViewingEvent(ev)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl mb-2 border ${cat.border} ${cat.bg} cursor-pointer hover:shadow-sm transition-all`}>
                      <div className={`w-7 h-7 rounded-lg ${cat.pill} border ${cat.border} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-slate-800 truncate">{ev.title}</p>
                        {ev.time && <p className="text-[10px] font-bold text-slate-400">{ev.time}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </div>

      {/* ── Modals ── */}
      {viewingEvent && <EventModal event={viewingEvent} onClose={() => setViewingEvent(null)} />}
      {addingForDate && (
        <AddEventModal
          defaultDate={addingForDate}
          onClose={() => setAddingForDate(null)}
          onAdd={async ev => { await addCalendarEvent(ev); setEvents(prev => [...prev, ev]); }}
        />
      )}
    </div>
  );
}
