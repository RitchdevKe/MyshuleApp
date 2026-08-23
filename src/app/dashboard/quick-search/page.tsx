"use client";

import React, { useState, useRef } from "react";
import {
  Search, Eye, MessageSquare, CreditCard, Star,
  Clock, UserCheck, Users, BookOpen, FileText,
  ChevronRight, X, TrendingUp, AlertCircle, CheckCircle2, Zap
} from "lucide-react";

const allStudents = [
  { id: "2041", name: "Kevin Kiprop", initials: "KK", grade: "Form 4 East", status: "Cleared", balance: 0, type: "student", phone: "0712 345 678" },
  { id: "2042", name: "Faith Wanjiku", initials: "FW", grade: "Form 4 East", status: "Arrears", balance: 10000, type: "student", phone: "0723 456 789" },
  { id: "2043", name: "Amos Kibet", initials: "AK", grade: "Form 4 East", status: "Arrears", balance: 5000, type: "student", phone: "0734 567 890" },
  { id: "2044", name: "Mercy Chepwogen", initials: "MC", grade: "Form 4 East", status: "Cleared", balance: 0, type: "student", phone: "0745 678 901" },
  { id: "2045", name: "Brian Omondi", initials: "BO", grade: "Form 3 West", status: "Arrears", balance: 22000, type: "student", phone: "0756 789 012" },
  { id: "2046", name: "Lilian Njeri", initials: "LN", grade: "Form 2 North", status: "Cleared", balance: 0, type: "student", phone: "0767 890 123" },
  { id: "2047", name: "Samuel Ochieng", initials: "SO", grade: "Form 1 South", status: "Arrears", balance: 8500, type: "student", phone: "0778 901 234" },
  { id: "2048", name: "Grace Akinyi", initials: "GA", grade: "Form 3 East", status: "Cleared", balance: 0, type: "student", phone: "0789 012 345" },
];

const quickActions = [
  { icon: Users, label: "Enroll New Student" },
  { icon: CreditCard, label: "Record Fee Payment" },
  { icon: MessageSquare, label: "Send SMS Blast" },
  { icon: FileText, label: "Generate Report" },
  { icon: BookOpen, label: "Create Exam" },
  { icon: UserCheck, label: "Mark Attendance" },
];

const recentSearches = ["Kevin Kiprop", "Form 4 East", "Faith Wanjiku", "ADM-2041", "0712345678"];

const filterTabs = [
  { id: "all", label: "All Students", count: 20 },
  { id: "cleared", label: "Fully Paid", count: 9 },
  { id: "arrears", label: "Unpaid Fees", count: 11 },
  { id: "critical", label: "Critical Arrears", count: 5 },
  { id: "boarders", label: "Boarders", count: 20 },
  { id: "day", label: "Day Scholars", count: 0 },
];

const statusConfig = {
  Cleared: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    border: "border-l-emerald-500",
    icon: CheckCircle2,
  },
  Arrears: {
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    border: "border-l-rose-500",
    icon: AlertCircle,
  },
};

export default function QuickSearchPage() {
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = allStudents.filter((s) => {
    const matchQuery =
      query.trim() === "" ||
      s.name.toLowerCase().includes(query.toLowerCase()) ||
      s.id.includes(query) ||
      s.phone.replace(/\s/g, "").includes(query.replace(/\s/g, ""));

    const matchFilter =
      activeFilter === "all" ||
      (activeFilter === "cleared" && s.status === "Cleared") ||
      (activeFilter === "arrears" && s.status === "Arrears" && s.balance < 15000) ||
      (activeFilter === "critical" && s.balance >= 15000);

    return matchQuery && matchFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-16 pt-2">

      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white/40 backdrop-blur-md p-5 rounded-3xl border border-white/60 shadow-sm">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Quick Search</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Find students, staff, parents and records instantly.</p>
        </div>
        <div className="flex items-center gap-2 bg-primary-900 px-4 py-2.5 rounded-2xl shadow-sm text-white">
          <TrendingUp className="w-4 h-4 text-secondary-500" />
          <span className="text-xs font-black">1,284 Records Indexed</span>
        </div>
      </div>

      {/* ── Search Container (Glassmorphism) ── */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm p-6 space-y-6">

        {/* Search Input Row */}
        <div className="flex flex-col md:flex-row items-center gap-3 w-full">
          <div className="relative flex-1 w-full">
            <div className={`absolute inset-0 rounded-2xl transition-all duration-500 pointer-events-none ${isFocused ? "bg-primary-900/5 blur-md scale-105 opacity-100" : "opacity-0"}`} />
            <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10 transition-colors duration-300 ${isFocused ? "text-primary-900" : "text-slate-400"}`} />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search by name, ADM number, or phone..."
              className="w-full pl-12 pr-10 py-4 text-sm font-bold text-slate-800 bg-white border-2 border-slate-200/80 rounded-2xl focus:outline-none focus:border-primary-900 focus:ring-4 focus:ring-primary-900/10 transition-all shadow-sm z-10 relative placeholder:text-slate-400"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-1 bg-slate-100 rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <button className="w-full md:w-auto bg-primary-900 text-white px-8 py-4 rounded-2xl font-black text-sm transition-all shadow-md shadow-primary-900/20 hover:bg-primary-800 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 group">
            <Zap className="w-4 h-4 text-secondary-500 group-hover:scale-110 transition-transform" />
            Search
          </button>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                activeFilter === f.id
                  ? "bg-secondary-500 text-white shadow-md shadow-secondary-500/20"
                  : "bg-primary-900 text-white opacity-90 hover:opacity-100"
              }`}
            >
              {f.label}
              <span className={`px-1.5 py-0.5 rounded-lg text-[10px] font-black ${activeFilter === f.id ? "bg-white/20" : "bg-white/10"}`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Empty State: Recent Searches + Quick Actions ── */}
      {query.trim() === "" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Searches */}
          <div className="lg:col-span-1 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center">
                <Clock className="w-4 h-4 text-primary-900" />
              </div>
              <h3 className="font-bold text-slate-800">Recent Searches</h3>
            </div>
            <div className="space-y-2">
              {recentSearches.map((term, i) => (
                <button
                  key={i}
                  onClick={() => setQuery(term)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-primary-50 hover:text-primary-900 transition-all group border border-transparent hover:border-primary-100"
                >
                  <div className="flex items-center gap-3">
                    <Search className="w-4 h-4 text-slate-400 group-hover:text-primary-600 transition-colors" />
                    {term}
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary-600 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm p-6">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <div className="w-8 h-8 bg-secondary-50 rounded-xl flex items-center justify-center">
                <Zap className="w-4 h-4 text-secondary-500" />
              </div>
              <h3 className="font-bold text-slate-800">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {quickActions.map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    className="flex flex-col items-center justify-center text-center gap-3 p-5 rounded-2xl border border-slate-200 bg-white hover:bg-primary-900 hover:border-primary-900 hover:text-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group"
                  >
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-primary-50 text-primary-900 group-hover:bg-white/10 group-hover:text-white transition-colors">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-slate-700 group-hover:text-white leading-tight">{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Results Section ── */}
      {query.trim() !== "" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">
              {filtered.length} Result{filtered.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
            </h3>
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl p-16 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="font-black text-slate-800 text-xl mb-2">No Results Found</h3>
              <p className="text-sm font-medium text-slate-500 max-w-sm">We couldn't find any records matching &ldquo;{query}&rdquo;.</p>
              <button onClick={() => setQuery("")} className="mt-6 text-sm font-bold text-white bg-primary-900 hover:bg-primary-800 px-6 py-3 rounded-xl transition-colors shadow-md shadow-primary-900/20">Clear Search</button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
              {filtered.map((student) => {
                const config = statusConfig[student.status as keyof typeof statusConfig];
                const StatusIcon = config.icon;
                return (
                  <div
                    key={student.id}
                    className={`bg-white rounded-3xl p-6 border border-slate-200/80 border-l-4 ${config.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group`}
                  >
                    <div className="flex justify-between items-start mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-primary-900 flex items-center justify-center text-white font-black text-lg shadow-md">
                        {student.initials}
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black text-slate-400 block mb-1">ADM-{student.id}</span>
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${config.badge}`}>
                          <StatusIcon className="w-3.5 h-3.5" />
                          {student.status}
                        </div>
                      </div>
                    </div>

                    <div className="mb-5 flex-1">
                      <h4 className="font-black text-slate-800 text-lg leading-tight mb-2">{student.name}</h4>
                      <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg">{student.grade}</span>
                      <p className="text-xs font-semibold text-slate-500 mt-3 flex items-center gap-2">
                         <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> {student.phone}
                      </p>
                    </div>

                    <div className="mb-5 bg-slate-50 rounded-xl p-3 border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Outstanding Balance</p>
                      <p className={`text-xl font-black ${student.balance === 0 ? "text-emerald-600" : "text-rose-600"}`}>
                        KSh {student.balance.toLocaleString()}
                      </p>
                    </div>

                    <div className="grid grid-cols-4 gap-2 border-t border-slate-100 pt-4 mt-auto">
                      <button className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-900 hover:bg-primary-800 transition-colors shadow-sm" title="View Profile">
                        <Eye className="w-4 h-4" />
                        Profile
                      </button>
                      <button className="col-span-1 rounded-xl text-slate-500 bg-white border border-slate-200 hover:bg-secondary-50 hover:text-secondary-600 hover:border-secondary-200 flex items-center justify-center transition-all" title="Send Message">
                        <MessageSquare className="w-4 h-4" />
                      </button>
                      <button className="col-span-1 rounded-xl text-slate-500 bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 flex items-center justify-center transition-all" title="Record Payment">
                        <CreditCard className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── Default card grid when no query ── */}
      {query.trim() === "" && (
        <div className="space-y-4 pt-4 border-t border-slate-200/50">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider">All Students — {allStudents.length} Records</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {allStudents.map((student) => {
              const config = statusConfig[student.status as keyof typeof statusConfig];
              const StatusIcon = config.icon;
              return (
                <div
                  key={student.id}
                  className={`bg-white rounded-3xl p-6 border border-slate-200/80 border-l-4 ${config.border} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group`}
                >
                  <div className="flex justify-between items-start mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary-900 flex items-center justify-center text-white font-black text-lg shadow-md">
                      {student.initials}
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-black text-slate-400 block mb-1">ADM-{student.id}</span>
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider border ${config.badge}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {student.status}
                      </div>
                    </div>
                  </div>

                  <div className="mb-5 flex-1">
                    <h4 className="font-black text-slate-800 text-lg leading-tight mb-2">{student.name}</h4>
                    <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1.5 rounded-lg">{student.grade}</span>
                    <p className="text-xs font-semibold text-slate-500 mt-3 flex items-center gap-2">
                       <span className="w-1.5 h-1.5 rounded-full bg-slate-300"></span> {student.phone}
                    </p>
                  </div>

                  <div className="mb-5 bg-slate-50 rounded-xl p-3 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Outstanding Balance</p>
                    <p className={`text-xl font-black ${student.balance === 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      KSh {student.balance.toLocaleString()}
                    </p>
                  </div>

                  <div className="grid grid-cols-4 gap-2 border-t border-slate-100 pt-4 mt-auto">
                    <button className="col-span-2 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-primary-900 hover:bg-primary-800 transition-colors shadow-sm" title="View Profile">
                      <Eye className="w-4 h-4" />
                      Profile
                    </button>
                    <button className="col-span-1 rounded-xl text-slate-500 bg-white border border-slate-200 hover:bg-secondary-50 hover:text-secondary-600 hover:border-secondary-200 flex items-center justify-center transition-all" title="Send Message">
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button className="col-span-1 rounded-xl text-slate-500 bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 flex items-center justify-center transition-all" title="Record Payment">
                      <CreditCard className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
