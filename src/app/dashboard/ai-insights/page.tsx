"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles, TrendingDown, TrendingUp, AlertCircle, ArrowRight,
  Send, BookOpen, DollarSign, Users, Truck, Brain,
  ChevronRight, RefreshCw, CheckCircle2, Clock, Zap,
  BarChart3, MessageSquare, Star, ShieldAlert, ThumbsUp,
  Lightbulb, Target, Activity
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

interface Alert {
  id: string;
  severity: "critical" | "warning" | "positive" | "info";
  category: "academic" | "finance" | "hr" | "operations" | "compliance";
  title: string;
  detail: string;
  action: string;
  metric?: string;
  change?: string;
  changeUp?: boolean;
}

interface ChatMessage {
  role: "ai" | "user";
  text: string;
  timestamp: string;
}

// ─── Config ─────────────────────────────────────────────────────────────────

const severityConfig = {
  critical: { bg: "from-rose-50 to-red-50",  border: "border-rose-200",   badge: "bg-rose-100 text-rose-700",   icon: ShieldAlert,  iconColor: "text-rose-500",   glow: "shadow-rose-100"   },
  warning:  { bg: "from-amber-50 to-yellow-50", border: "border-amber-200", badge: "bg-amber-100 text-amber-700", icon: AlertCircle,  iconColor: "text-amber-500",  glow: "shadow-amber-100"  },
  positive: { bg: "from-emerald-50 to-green-50", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700", icon: ThumbsUp, iconColor: "text-emerald-500", glow: "shadow-emerald-100" },
  info:     { bg: "from-sky-50 to-blue-50",  border: "border-sky-200",     badge: "bg-sky-100 text-sky-700",     icon: Lightbulb,    iconColor: "text-sky-500",    glow: "shadow-sky-100"    },
};

const categoryConfig = {
  academic:    { label: "Academic",    icon: BookOpen,   color: "text-indigo-600 bg-indigo-50 border-indigo-200" },
  finance:     { label: "Finance",     icon: DollarSign, color: "text-emerald-600 bg-emerald-50 border-emerald-200" },
  hr:          { label: "HR",          icon: Users,      color: "text-violet-600 bg-violet-50 border-violet-200" },
  operations:  { label: "Operations",  icon: Truck,      color: "text-amber-600 bg-amber-50 border-amber-200" },
  compliance:  { label: "Compliance",  icon: CheckCircle2,color: "text-sky-600 bg-sky-50 border-sky-200" },
};

// ─── Data ───────────────────────────────────────────────────────────────────

const ALERTS: Alert[] = [
  { id: "a1", severity: "critical", category: "finance",    title: "Fee Collection Drop",          detail: "Fee collection has dropped 18% compared to last term. 145 parents predicted to default based on historic payment patterns.", action: "Send SMS Reminder to Defaulters", metric: "KES 2.4M", change: "–18%", changeUp: false },
  { id: "a2", severity: "warning",  category: "academic",   title: "24 Students at Attendance Risk", detail: "24 students have attendance below 80% this month. 6 of them are in Form 4 — critical exam year.", action: "Schedule Welfare Interviews", metric: "24 students", change: "↓ 6%", changeUp: false },
  { id: "a3", severity: "warning",  category: "compliance", title: "Lesson Plan Compliance",        detail: "3 teachers haven't submitted lesson plans for Week 4: Mr. Kamau, Mrs. Chebet, Ms. Njeri.", action: "Send Reminder to Teachers", metric: "3 teachers" },
  { id: "a4", severity: "positive", category: "academic",   title: "Grade 9 Score Improvement",    detail: "Form 3 overall mean score has improved by 6.2% from last term. Mathematics and English show the strongest gains.", action: "View Full Performance Report", metric: "+6.2%", change: "+6.2%", changeUp: true },
  { id: "a5", severity: "warning",  category: "hr",         title: "4 Contracts Expiring Soon",    detail: "4 teacher contracts expire within the next 30 days. Renewal letters need to be issued by end of week.", action: "View HR Records", metric: "30 days" },
  { id: "a6", severity: "critical", category: "hr",         title: "Payroll Pending Approval",     detail: "August payroll is ready and awaiting final approval from the Finance Manager. Payout date is Aug 28.", action: "Approve August Payroll", metric: "KES 3.8M" },
  { id: "a7", severity: "warning",  category: "operations", title: "Bus #2 Maintenance Due",       detail: "Bus #2 has reached 5,000km service interval. Delaying maintenance increases breakdown risk.", action: "Schedule Maintenance", metric: "5,000 km" },
  { id: "a8", severity: "critical", category: "operations", title: "Chemistry Lab Stock Critical", detail: "Chemistry lab reagents are critically low for Form 4 Practicals scheduled next week.", action: "Place Purchase Order", metric: "< 20% stock" },
];

const INTELLIGENCE_SECTIONS = [
  {
    id: "academic",
    title: "Academic Intelligence",
    icon: BookOpen,
    color: "from-indigo-600 to-violet-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    text: "text-indigo-700",
    insights: [
      { text: "Form 4 KCSE predicted mean: B+ (8.4 points). Sciences show a 1.2-point deviation downward.", risk: "medium" },
      { text: "Form 2 East is the weakest performing class with 47% mean score — intervention required.", risk: "high" },
      { text: "Attendance correlation with performance: 92% of top performers have >95% attendance.", risk: "low" },
    ],
    kpi: { label: "School Mean", value: "B+ (8.4)", sub: "Predicted KCSE" },
  },
  {
    id: "finance",
    title: "Finance Intelligence",
    icon: DollarSign,
    color: "from-emerald-600 to-teal-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    insights: [
      { text: "145 parents predicted to default based on 3-term payment history — send proactive SMS now.", risk: "high" },
      { text: "Transport expenses are 12% over budget. Consider route optimisation or fuel audit.", risk: "medium" },
      { text: "Term 2 fee collection at 71% — on pace to reach 89% by deadline if current trend holds.", risk: "low" },
    ],
    kpi: { label: "Collected", value: "KES 4.2M", sub: "71% of target" },
  },
  {
    id: "hr",
    title: "HR Intelligence",
    icon: Users,
    color: "from-violet-600 to-purple-600",
    bg: "bg-violet-50",
    border: "border-violet-200",
    text: "text-violet-700",
    insights: [
      { text: "4 teacher contracts expire in the next 30 days. Renewal letters must be issued immediately.", risk: "high" },
      { text: "Payroll for August (KES 3.8M) is awaiting Finance Manager approval. Due by Aug 28.", risk: "high" },
      { text: "Staff morale score (internal survey): 78/100 — a 5-point improvement from last quarter.", risk: "low" },
    ],
    kpi: { label: "Staff Present", value: "54 / 58", sub: "Today" },
  },
  {
    id: "operations",
    title: "Operations Intelligence",
    icon: Truck,
    color: "from-amber-600 to-orange-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    insights: [
      { text: "Bus #2 requires scheduled maintenance — 5,000km interval reached. Risk of breakdown.", risk: "high" },
      { text: "Chemistry lab reagents critically low for Form 4 practicals scheduled next week.", risk: "high" },
      { text: "Cafeteria meal uptake dropped 9% — possible menu dissatisfaction or competing tuck-shop.", risk: "medium" },
    ],
    kpi: { label: "Operations Score", value: "74%", sub: "Infrastructure health" },
  },
];

const SUGGESTED_PROMPTS = [
  "Who are the top 10 fee defaulters?",
  "Which class needs academic intervention?",
  "Show today's absent teachers.",
  "Predict Term 3 fee collection.",
  "Which students are at dropout risk?",
  "Summarise this week's activities.",
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    role: "ai",
    text: "Hello! I'm MyShule AI, your school intelligence consultant. I can analyse data, flag risks, and give you actionable recommendations. What would you like to know?",
    timestamp: "Just now",
  },
];

const AI_RESPONSES: Record<string, string> = {
  "who are the top 10 fee defaulters?": "Here are the top 10 fee defaulters this term:\n1. Faith Wanjiku (Form 4E) — KES 22,000\n2. Brian Omondi (Form 3W) — KES 18,500\n3. Amos Kibet (Form 4E) — KES 16,200\n4. Samuel Ochieng (Form 1S) — KES 14,800\n5. Grace Akinyi (Form 3E) — KES 12,600\n…and 5 more. I recommend sending an automated SMS to all 10 parents today.",
  "which class needs academic intervention?": "Based on assessment data:\n🔴 Form 2 East — Mean: 47% (critical)\n🟡 Form 1 North — Mean: 54% (needs support)\n🟡 Form 3 West — Mean: 56% (monitoring)\n\nI recommend scheduling a meeting with Form 2 East's class teacher and subject HODs immediately.",
  "show today's absent teachers.": "Today's absent teachers (4 out of 58):\n• Mr. John Kamau — Not reported (unexcused)\n• Mrs. Grace Chebet — Sick leave\n• Mr. Peter Otieno — Personal leave approved\n• Ms. Alice Njeri — No reason given\n\nI've identified 3 unallocated periods that need substitute cover.",
  "predict term 3 fee collection.": "Based on historical collection patterns:\n📊 Predicted Term 3 Collection: KES 5.8M (87% of target)\n• Early payers: 38% of parents (same as Term 2)\n• Expected defaulters: 112 parents\n• Recommend early SMS campaign 2 weeks before term opens.",
  "which students are at dropout risk?": "AI dropout risk analysis (based on attendance + fee arrears + academic performance):\n🔴 High risk: 8 students in Form 1-2\n🟡 Medium risk: 23 students across all forms\n\nTop risk student: Kevin Kiprop (Form 1A) — 68% attendance, KES 14,000 arrears, declining grades.",
  "summarise this week's activities.": "Week Summary (Aug 4–9, 2026):\n✅ Mid-term exams concluded — 98% student participation\n⚠️ 3 teachers missed lesson plan submissions\n💰 KES 420,000 collected in fees (daily average)\n📚 2 CBC assessment rubrics updated by HODs\n🚌 Bus #1 completed 4 routes without incident",
};

function getAIResponse(input: string): string {
  const key = input.toLowerCase().trim();
  for (const [prompt, response] of Object.entries(AI_RESPONSES)) {
    if (key.includes(prompt.toLowerCase().split(" ")[0]) || key === prompt.toLowerCase()) {
      return response;
    }
  }
  return `I'm analysing your query: "${input}"\n\nBased on available school data, I can see relevant patterns. For a full analysis, please refine your question or choose a suggested prompt above. I have access to academic, finance, HR, and operations data.`;
}

// ─── Alert Card ─────────────────────────────────────────────────────────────

function AlertCard({ alert }: { alert: Alert }) {
  const sev = severityConfig[alert.severity];
  const cat = categoryConfig[alert.category];
  const SevIcon = sev.icon;
  const CatIcon = cat.icon;

  return (
    <div className={`relative bg-gradient-to-br ${sev.bg} border ${sev.border} rounded-2xl p-4 shadow-sm ${sev.glow} hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-xl flex items-center justify-center bg-white/70 border ${sev.border}`}>
            <SevIcon className={`w-4 h-4 ${sev.iconColor}`} />
          </div>
          <div>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${cat.color}`}>
              {cat.label}
            </span>
          </div>
        </div>
        {alert.metric && (
          <div className="text-right flex-shrink-0">
            <p className="text-base font-black text-slate-800">{alert.metric}</p>
            {alert.change && (
              <p className={`text-[10px] font-black flex items-center justify-end gap-0.5 ${alert.changeUp ? "text-emerald-600" : "text-rose-600"}`}>
                {alert.changeUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {alert.change}
              </p>
            )}
          </div>
        )}
      </div>

      <div>
        <h4 className="font-black text-slate-800 text-sm mb-1">{alert.title}</h4>
        <p className="text-xs font-medium text-slate-600 leading-relaxed">{alert.detail}</p>
      </div>

      <button className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-black text-white transition-all hover:opacity-90 bg-gradient-to-r ${
        alert.severity === "critical" ? "from-rose-500 to-red-600 shadow-rose-200" :
        alert.severity === "warning"  ? "from-amber-500 to-orange-500 shadow-amber-200" :
        alert.severity === "positive" ? "from-emerald-500 to-teal-500 shadow-emerald-200" :
        "from-sky-500 to-blue-500 shadow-sky-200"
      } shadow-md`}>
        {alert.action}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AIInsightsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [messages, setMessages]             = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [chatInput, setChatInput]           = useState("");
  const [isTyping, setIsTyping]             = useState(false);
  const [activeSection, setActiveSection]   = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const dateStr = now.toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  function sendMessage(text?: string) {
    const input = (text || chatInput).trim();
    if (!input) return;
    const userMsg: ChatMessage = { role: "user", text: input, timestamp: "Just now" };
    setMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const aiMsg: ChatMessage = {
        role: "ai",
        text: getAIResponse(input),
        timestamp: "Just now",
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 1200 + Math.random() * 600);
  }

  const filteredAlerts = activeCategory === "all"
    ? ALERTS
    : ALERTS.filter(a => a.category === activeCategory);

  const criticalCount  = ALERTS.filter(a => a.severity === "critical").length;
  const warningCount   = ALERTS.filter(a => a.severity === "warning").length;
  const positiveCount  = ALERTS.filter(a => a.severity === "positive").length;

  return (
    <div className="flex flex-col lg:flex-row gap-5 h-[calc(100vh-120px)] max-w-[1400px] mx-auto pt-2">

      {/* ══ Left / Main Panel ══ */}
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 pb-4 hide-scrollbar">

        {/* Hero Banner */}
        <div className="relative bg-gradient-to-br from-slate-900 via-indigo-950 to-violet-950 rounded-3xl p-6 overflow-hidden shadow-xl shadow-indigo-950/30">
          {/* Floating orbs */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-6  w-36 h-36 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 right-1/4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-black text-indigo-300 uppercase tracking-widest">MyShule AI</span>
              </div>
              <h1 className="text-3xl font-black text-white leading-tight">{greeting}, Principal.</h1>
              <p className="text-indigo-200 text-sm font-medium mt-1">{dateStr} · Here's what needs your attention.</p>
            </div>

            {/* Live severity summary */}
            <div className="flex items-center gap-3">
              <div className="text-center bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
                <p className="text-2xl font-black text-rose-300">{criticalCount}</p>
                <p className="text-[10px] font-black text-rose-400 uppercase tracking-wider">Critical</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
                <p className="text-2xl font-black text-amber-300">{warningCount}</p>
                <p className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Warnings</p>
              </div>
              <div className="text-center bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-3">
                <p className="text-2xl font-black text-emerald-300">{positiveCount}</p>
                <p className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Positive</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Filter */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl p-3 flex flex-wrap items-center gap-2 shadow-sm">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${activeCategory === "all" ? "bg-slate-800 text-white shadow" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
          >
            All ({ALERTS.length})
          </button>
          {Object.entries(categoryConfig).map(([key, cfg]) => {
            const Icon = cfg.icon;
            const count = ALERTS.filter(a => a.category === key).length;
            return (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black border transition-all ${activeCategory === key ? `${cfg.color} scale-105 shadow-sm` : "bg-slate-100 border-transparent text-slate-600 hover:bg-slate-200"}`}
              >
                <Icon className="w-3.5 h-3.5" />{cfg.label} ({count})
              </button>
            );
          })}
          <button className="ml-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {/* Alerts Grid */}
        <div>
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">
            {filteredAlerts.length} Alert{filteredAlerts.length !== 1 ? "s" : ""}
            {activeCategory !== "all" ? ` · ${categoryConfig[activeCategory as keyof typeof categoryConfig]?.label}` : ""}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredAlerts.map(alert => <AlertCard key={alert.id} alert={alert} />)}
          </div>
        </div>

        {/* Intelligence Deep-Dives */}
        <div>
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Intelligence Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INTELLIGENCE_SECTIONS.map(section => {
              const Icon = section.icon;
              const isOpen = activeSection === section.id;
              return (
                <div key={section.id} className={`bg-white/70 backdrop-blur-xl border ${section.border} rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all`}>
                  {/* Section Header */}
                  <button
                    onClick={() => setActiveSection(isOpen ? null : section.id)}
                    className={`w-full flex items-center justify-between p-5 bg-gradient-to-r ${section.color} text-white`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-white/20 rounded-xl flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <p className="font-black text-base">{section.title}</p>
                        <p className="text-[11px] text-white/70">{section.insights.length} insights detected</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-black text-lg">{section.kpi.value}</p>
                        <p className="text-[10px] text-white/70">{section.kpi.sub}</p>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-transform ${isOpen ? "rotate-90" : ""}`} />
                    </div>
                  </button>

                  {/* Section Body */}
                  <div className={`transition-all duration-300 overflow-hidden ${isOpen ? "max-h-96" : "max-h-0"}`}>
                    <div className="p-5 space-y-3">
                      {section.insights.map((insight, i) => (
                        <div key={i} className={`flex items-start gap-3 p-3 rounded-xl border ${section.border} ${section.bg}`}>
                          <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${insight.risk === "high" ? "bg-rose-500" : insight.risk === "medium" ? "bg-amber-500" : "bg-emerald-500"}`} />
                          <p className={`text-xs font-medium ${section.text}`}>{insight.text}</p>
                        </div>
                      ))}
                      <button className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r ${section.color} shadow-md hover:opacity-90 transition-opacity mt-2`}>
                        View Full {section.title.split(" ")[0]} Report
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Collapsed preview */}
                  {!isOpen && (
                    <div className="px-5 py-3 flex items-center gap-2">
                      {section.insights.map((insight, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full ${insight.risk === "high" ? "bg-rose-400" : insight.risk === "medium" ? "bg-amber-400" : "bg-emerald-400"}`} />
                      ))}
                      <span className="text-xs text-slate-400 font-medium ml-1">Click to expand</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Trend Metrics */}
        <div>
          <h2 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-3">Key Performance Indicators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Academic Mean",   value: "B+ (8.4)", icon: Target,    change: "+0.4", up: true,  color: "from-indigo-500 to-violet-500" },
              { label: "Fee Collection",  value: "71%",      icon: BarChart3, change: "–18%", up: false, color: "from-emerald-500 to-teal-500" },
              { label: "Avg Attendance",  value: "88.4%",    icon: Activity,  change: "+1.2%",up: true,  color: "from-sky-500 to-blue-500" },
              { label: "Staff Present",   value: "54/58",    icon: Users,     change: "93%",  up: true,  color: "from-violet-500 to-purple-500" },
            ].map(kpi => {
              const Icon = kpi.icon;
              return (
                <div key={kpi.label} className={`bg-gradient-to-br ${kpi.color} rounded-2xl p-4 text-white shadow-lg relative overflow-hidden group`}>
                  <div className="absolute -bottom-3 -right-3 w-16 h-16 bg-white/10 rounded-full" />
                  <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/5 rounded-full" />
                  <Icon className="w-5 h-5 text-white/70 mb-2" />
                  <p className="text-2xl font-black">{kpi.value}</p>
                  <p className="text-[10px] text-white/70 font-bold uppercase tracking-wider mt-0.5">{kpi.label}</p>
                  <div className={`flex items-center gap-1 mt-1.5 text-[10px] font-black ${kpi.up ? "text-emerald-200" : "text-rose-200"}`}>
                    {kpi.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {kpi.change} vs last term
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══ AI Chat Panel ══ */}
      <div className="w-full lg:w-[340px] flex flex-col rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/20 border border-slate-200/80 shrink-0 bg-white" style={{ height: "calc(100vh - 120px)" }}>

        {/* Chat Header */}
        <div className="relative bg-gradient-to-r from-indigo-900 to-violet-900 p-4 text-white flex items-center gap-3 flex-shrink-0 overflow-hidden">
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-violet-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-violet-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-black text-base">MyShule AI</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              <p className="text-xs text-indigo-200 font-semibold">School Intelligence Online</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/80 hide-scrollbar">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
              {msg.role === "ai" && (
                <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 mt-0.5 shadow">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-sm whitespace-pre-line leading-relaxed ${
                msg.role === "ai"
                  ? "bg-white border border-slate-200 text-slate-700 rounded-tl-none font-medium"
                  : "bg-gradient-to-br from-indigo-600 to-violet-600 text-white font-semibold rounded-tr-none"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <div className="bg-white border border-slate-200 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                <div className="flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Prompts */}
        <div className="px-3 py-2 border-t border-slate-100 bg-white flex-shrink-0">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider mb-2">Suggested Queries</p>
          <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                onClick={() => sendMessage(prompt)}
                className="flex-shrink-0 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors whitespace-nowrap"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Input */}
        <div className="p-3 border-t border-slate-100 bg-white flex-shrink-0">
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask MyShule AI anything..."
              className="flex-1 bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-all placeholder:text-slate-400"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!chatInput.trim() || isTyping}
              className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-300/40 hover:shadow-indigo-400/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Send className="w-4 h-4 ml-0.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
