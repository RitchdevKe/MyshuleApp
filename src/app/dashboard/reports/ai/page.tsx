"use client";
import React, { useState } from "react";
import { Sparkles, MessageSquare, Brain, ActivitySquare, Lightbulb, FileText, Send, AlertTriangle, TrendingUp, TrendingDown, ArrowRight, Zap, Target } from "lucide-react";

export default function AIAnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState("executive");
  const [chatInput, setChatInput] = useState("");

  const tabs = [
    { id: "executive", label: "Executive Insight", icon: Brain },
    { id: "ask", label: "Ask MyShule", icon: MessageSquare },
    { id: "predictions", label: "Predictions", icon: ActivitySquare },
    { id: "anomalies", label: "Anomalies", icon: AlertTriangle },
    { id: "recommendations", label: "Recommendations", icon: Lightbulb },
    { id: "ai-reports", label: "AI Reports", icon: FileText },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">
      
      {/* Contextual Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-primary-900 p-5 rounded-3xl border border-primary-800 shadow-lg shadow-primary-900/20">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight capitalize flex items-center gap-3">
             <Sparkles className="w-8 h-8 text-indigo-400" /> AI Analytics
          </h1>
          <p className="text-sm text-primary-100 font-medium mt-1">
            The intelligence layer over your school's data. Predictive insights and natural language reporting.
          </p>
        </div>
      </div>

      {/* Dynamic Tab Navigation */}
      <div className="flex space-x-2 bg-white/80 backdrop-blur-xl p-1.5 rounded-2xl overflow-x-auto border border-white/60 backdrop-blur-md shadow-sm hide-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
                isActive
                  ? "bg-secondary-500 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-800 hover:bg-white/50 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-3xl shadow-sm overflow-hidden min-h-[600px]">
        
        {/* 1. EXECUTIVE INSIGHT */}
        {activeTab === "executive" && (
          <div className="p-8">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 border-4 border-white shadow-sm mb-4">
                  <Brain className="w-8 h-8 text-indigo-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Good Morning, Principal</h2>
                <p className="text-slate-500 mt-2 font-medium">MyShule AI analyzed <strong className="text-indigo-600">18,421</strong> data points overnight.</p>
                <div className="mt-6 flex items-center justify-center gap-2 text-slate-800 font-bold uppercase tracking-wider text-xs">
                   <Zap className="w-4 h-4 text-amber-500" /> 3 items require your attention today:
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white/80 backdrop-blur-xl border-2 border-amber-100 rounded-2xl p-6 shadow-sm hover:border-amber-300 transition-all group">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 font-black flex items-center justify-center shrink-0">1</div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                         Grade 8 Mathematics dropped 8.4% <TrendingDown className="w-4 h-4 text-rose-500" />
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 mb-4">Performance across all 4 streams has declined compared to Term 1.</p>
                      <button className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 border border-amber-200 px-4 py-2 rounded-lg group-hover:bg-amber-100 transition-colors">Investigate Issue</button>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border-2 border-rose-100 rounded-2xl p-6 shadow-sm hover:border-rose-300 transition-all group">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 font-black flex items-center justify-center shrink-0">2</div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                         Fee collection is 11% below target <AlertTriangle className="w-4 h-4 text-rose-500" />
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 mb-4">Current collection stands at KSh 72.8M against a target of KSh 81.5M for the month.</p>
                      <button className="text-xs font-bold uppercase tracking-wider text-rose-700 bg-rose-50 border border-rose-200 px-4 py-2 rounded-lg group-hover:bg-rose-100 transition-colors">View Financial Report</button>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl border-2 border-indigo-100 rounded-2xl p-6 shadow-sm hover:border-indigo-300 transition-all group">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 font-black flex items-center justify-center shrink-0">3</div>
                    <div>
                      <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                         17 students show compound risk factors <Target className="w-4 h-4 text-indigo-500" />
                      </h3>
                      <p className="text-sm text-slate-500 mt-1 mb-4">An anomaly was detected where these students are dropping in both attendance and performance simultaneously.</p>
                      <button className="text-xs font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-lg group-hover:bg-indigo-100 transition-colors">View At-Risk Roster</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. ASK MYSHULE */}
        {activeTab === "ask" && (
          <div className="flex flex-col h-[600px]">
            <div className="flex-1 p-8 overflow-y-auto bg-slate-50/50">
              <div className="max-w-3xl mx-auto space-y-6">
                 
                 {/* Chat Bubble 1 (User) */}
                 <div className="flex gap-4">
                   <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white shrink-0">
                     <span className="font-bold text-xs">Me</span>
                   </div>
                   <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-2xl rounded-tl-none p-4 shadow-sm">
                     <p className="text-sm text-slate-700 font-medium">Show me Grade 7 performance for the last three terms.</p>
                   </div>
                 </div>

                 {/* Chat Bubble 2 (AI) */}
                 <div className="flex gap-4 flex-row-reverse">
                   <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                     <Sparkles className="w-4 h-4" />
                   </div>
                   <div className="bg-indigo-50 border border-indigo-100 rounded-2xl rounded-tr-none p-4 shadow-sm w-full max-w-2xl">
                     <p className="text-sm text-slate-700 font-medium mb-4">Here is the performance trend for Grade 7 across the last three terms:</p>
                     
                     <div className="bg-white p-4 rounded-xl border border-indigo-100 mb-4 flex items-end gap-6 h-40 shadow-sm">
                       <div className="flex-1 flex flex-col items-center justify-end gap-2 group">
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black text-indigo-900">68.5%</div>
                         <div className="w-full bg-indigo-200 hover:bg-indigo-300 transition-colors rounded-t-sm" style={{ height: '60%' }}></div>
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Term 3 '25</span>
                       </div>
                       <div className="flex-1 flex flex-col items-center justify-end gap-2 group">
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black text-indigo-900">72.1%</div>
                         <div className="w-full bg-indigo-400 hover:bg-indigo-500 transition-colors rounded-t-sm" style={{ height: '75%' }}></div>
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Term 1 '26</span>
                       </div>
                       <div className="flex-1 flex flex-col items-center justify-end gap-2 group">
                         <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-black text-indigo-900">68.1%</div>
                         <div className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors rounded-t-sm" style={{ height: '68%' }}></div>
                         <span className="text-[10px] font-bold text-slate-500 uppercase">Term 2 '26</span>
                       </div>
                     </div>

                     <p className="text-sm text-slate-700 font-medium">Performance peaked in Term 1 at 72.1% but has slightly declined to 68.1% in the current term.</p>
                     <div className="mt-4 flex flex-wrap gap-2">
                       <button className="text-[10px] font-bold uppercase tracking-wider bg-white border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Export to PDF</button>
                       <button className="text-[10px] font-bold uppercase tracking-wider bg-white border border-indigo-200 text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors">Compare with Grade 8</button>
                     </div>
                   </div>
                 </div>

              </div>
            </div>
            
            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-slate-200">
              <div className="max-w-3xl mx-auto relative">
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-6 pr-14 py-4 text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                  placeholder="Ask MyShule anything about your school's data..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                />
                <button className="absolute right-3 top-3 bottom-3 w-10 bg-primary-900 rounded-xl flex items-center justify-center text-white hover:bg-primary-800 transition-colors shadow-sm">
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <div className="max-w-3xl mx-auto mt-3 flex gap-2 overflow-x-auto hide-scrollbar">
                <span className="text-[10px] font-bold text-slate-400 uppercase mr-2 flex items-center shrink-0">Suggestions:</span>
                <button className="whitespace-nowrap text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full font-bold hover:bg-indigo-100 transition-colors">Which classes have attendance below 90%?</button>
                <button className="whitespace-nowrap text-xs text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1.5 rounded-full font-bold hover:bg-indigo-100 transition-colors">Compare transport income and expenses</button>
              </div>
            </div>
          </div>
        )}

        {/* 3. PREDICTIONS */}
        {activeTab === "predictions" && (
           <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-lg font-black text-slate-800">Predictive Modeling</h2>
                    <p className="text-sm text-slate-500">AI-generated forecasts for the upcoming academic terms.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                 <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 text-center">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-emerald-600 mb-2">Projected Term 3 Enrollment</h3>
                    <div className="text-4xl font-black text-emerald-800 mb-1">2,510</div>
                    <div className="text-xs font-bold text-emerald-600 flex justify-center items-center gap-1"><TrendingUp className="w-3 h-3"/> +72 expected</div>
                 </div>
                 <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 text-center">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-indigo-600 mb-2">Projected Monthly Revenue</h3>
                    <div className="text-4xl font-black text-indigo-800 mb-1">84.2M</div>
                    <div className="text-xs font-bold text-indigo-600 flex justify-center items-center gap-1"><TrendingUp className="w-3 h-3"/> +3.1% MoM</div>
                 </div>
                 <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 text-center">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-amber-600 mb-2">At-Risk Dropouts (Next Term)</h3>
                    <div className="text-4xl font-black text-amber-800 mb-1">12</div>
                    <div className="text-xs font-bold text-amber-600 flex justify-center items-center gap-1">High confidence prediction</div>
                 </div>
              </div>

              <div className="bg-white border border-slate-200/60 rounded-2xl shadow-sm p-6">
                 <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6">Enrollment Trajectory (5-Year Forecast)</h3>
                 
                 <div className="h-64 flex items-end gap-2 sm:gap-6 md:gap-12 mt-4 border-b border-slate-200 pb-4 relative">
                    <div className="absolute left-0 top-0 bottom-0 w-8 flex flex-col justify-between text-[10px] font-bold text-slate-400">
                       <span>3K</span>
                       <span>2.5K</span>
                       <span>2K</span>
                       <span>1.5K</span>
                       <span>1K</span>
                    </div>

                    <div className="ml-10 flex-1 flex justify-between h-full items-end">
                       {/* Historical Data */}
                       {[1800, 1950, 2100, 2438].map((val, i) => (
                          <div key={i} className="flex-1 flex justify-center items-end h-full">
                             <div className="w-8 sm:w-12 bg-slate-300 rounded-t-sm" style={{ height: `${(val / 3000) * 100}%` }}></div>
                          </div>
                       ))}
                       {/* Predictive Data */}
                       {[2510, 2680, 2850].map((val, i) => (
                          <div key={`p-${i}`} className="flex-1 flex justify-center items-end h-full group relative">
                             <div className="absolute -top-8 bg-indigo-600 text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                ~{val}
                             </div>
                             <div className="w-8 sm:w-12 bg-indigo-400 bg-stripes bg-stripes-white/20 rounded-t-sm cursor-pointer" style={{ height: `${(val / 3000) * 100}%` }}></div>
                          </div>
                       ))}
                    </div>
                 </div>
                 
                 <div className="ml-10 flex justify-between mt-4">
                    {['2023', '2024', '2025', '2026', '2027 (Est)', '2028 (Est)', '2029 (Est)'].map((year, i) => (
                       <div key={i} className={`text-[10px] font-bold text-center flex-1 ${i > 3 ? 'text-indigo-600' : 'text-slate-500'}`}>{year}</div>
                    ))}
                 </div>
              </div>
           </div>
        )}

        {/* 4. ANOMALIES */}
        {activeTab === "anomalies" && (
           <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-lg font-black text-slate-800">Anomaly Detection</h2>
                    <p className="text-sm text-slate-500">AI-flagged statistical irregularities across your institution.</p>
                 </div>
              </div>

              <div className="space-y-4">
                 <div className="bg-white border-l-4 border-rose-500 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                       <div className="flex gap-3">
                          <AlertTriangle className="w-5 h-5 text-rose-500 mt-0.5" />
                          <div>
                             <h3 className="font-black text-slate-800">Sudden variance in Form 4 Chemistry Scores</h3>
                             <p className="text-sm text-slate-600 mt-1">Mid-term scores are statistically lower (avg 42%) than historical term averages (avg 61%) for this cohort.</p>
                             <div className="mt-3 flex gap-2 text-xs font-bold">
                                <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md">Confidence: 99%</span>
                                <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md">Department: Academic</span>
                             </div>
                          </div>
                       </div>
                       <button className="text-xs font-bold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">Investigate</button>
                    </div>
                 </div>

                 <div className="bg-white border-l-4 border-amber-500 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                       <div className="flex gap-3">
                          <ActivitySquare className="w-5 h-5 text-amber-500 mt-0.5" />
                          <div>
                             <h3 className="font-black text-slate-800">Unusual login patterns detected</h3>
                             <p className="text-sm text-slate-600 mt-1">3 staff accounts accessed the system between 1:00 AM and 3:00 AM outside of normal working hours.</p>
                             <div className="mt-3 flex gap-2 text-xs font-bold">
                                <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md">Confidence: 95%</span>
                                <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md">Department: System/IT</span>
                             </div>
                          </div>
                       </div>
                       <button className="text-xs font-bold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">Review Logs</button>
                    </div>
                 </div>

                 <div className="bg-white border-l-4 border-indigo-500 rounded-xl p-5 shadow-sm">
                    <div className="flex justify-between items-start">
                       <div className="flex gap-3">
                          <TrendingUp className="w-5 h-5 text-indigo-500 mt-0.5" />
                          <div>
                             <h3 className="font-black text-slate-800">Transport fuel expenses higher than expected</h3>
                             <p className="text-sm text-slate-600 mt-1">Route 4 shows a 22% spike in fuel usage this week without any reported detours or traffic incidents.</p>
                             <div className="mt-3 flex gap-2 text-xs font-bold">
                                <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md">Confidence: 87%</span>
                                <span className="bg-slate-100 text-slate-500 px-2 py-1 rounded-md">Department: Operations</span>
                             </div>
                          </div>
                       </div>
                       <button className="text-xs font-bold bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg shadow-sm hover:bg-slate-50 transition-colors">View Fleet Data</button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* 5. RECOMMENDATIONS */}
        {activeTab === "recommendations" && (
           <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-lg font-black text-slate-800">Prescriptive Analytics</h2>
                    <p className="text-sm text-slate-500">Actionable recommendations generated by AI based on current data.</p>
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 relative overflow-hidden group">
                    <Lightbulb className="w-32 h-32 text-indigo-100 absolute -bottom-6 -right-6 opacity-50 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                       <span className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 text-[10px] font-black uppercase tracking-wider rounded-md mb-3">Staffing Optimization</span>
                       <h3 className="text-lg font-black text-slate-800 mb-2">Hire 1 additional Mathematics Teacher</h3>
                       <p className="text-sm text-slate-600 mb-6">The student-to-teacher ratio for Senior Mathematics has crossed the 35:1 threshold, which historically correlates with a 5-8% drop in average test scores at this institution.</p>
                       <button className="flex items-center gap-2 text-xs font-bold bg-indigo-600 text-white px-4 py-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-sm">
                          Draft Job Posting <ArrowRight className="w-3 h-3" />
                       </button>
                    </div>
                 </div>

                 <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 relative overflow-hidden group">
                    <Lightbulb className="w-32 h-32 text-emerald-100 absolute -bottom-6 -right-6 opacity-50 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                       <span className="inline-block px-2 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase tracking-wider rounded-md mb-3">Resource Efficiency</span>
                       <h3 className="text-lg font-black text-slate-800 mb-2">Consolidate Bus Routes 3 and 5</h3>
                       <p className="text-sm text-slate-600 mb-6">Both routes are operating at under 45% capacity. Consolidating them into a single route would save approximately KSh 120,000 per month in fuel and maintenance.</p>
                       <button className="flex items-center gap-2 text-xs font-bold bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
                          View Proposed Route <ArrowRight className="w-3 h-3" />
                       </button>
                    </div>
                 </div>

                 <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6 relative overflow-hidden group md:col-span-2">
                    <Lightbulb className="w-32 h-32 text-amber-100 absolute -bottom-6 -right-6 opacity-50 group-hover:scale-110 transition-transform" />
                    <div className="relative z-10">
                       <span className="inline-block px-2 py-1 bg-amber-100 text-amber-800 text-[10px] font-black uppercase tracking-wider rounded-md mb-3">Intervention Required</span>
                       <h3 className="text-lg font-black text-slate-800 mb-2">Initiate Parent-Teacher Conference for 12 Students</h3>
                       <p className="text-sm text-slate-600 mb-6 max-w-3xl">These students exhibit compound risk factors (attendance below 85%, declining grades in 2+ subjects). Early intervention in week 5 of the term has a 78% success rate in correcting the trajectory.</p>
                       <button className="flex items-center gap-2 text-xs font-bold bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors shadow-sm">
                          Generate Meeting Invites <ArrowRight className="w-3 h-3" />
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        )}

        {/* 6. AI REPORTS */}
        {activeTab === "ai-reports" && (
           <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                 <div>
                    <h2 className="text-lg font-black text-slate-800">Auto-Generated Narratives</h2>
                    <p className="text-sm text-slate-500">Natural language summaries generated by AI from complex data sets.</p>
                 </div>
                 <button className="flex items-center justify-center gap-2 px-4 py-2 bg-primary-900 text-white rounded-xl font-bold text-sm hover:bg-primary-800 transition-all shadow-sm">
                   <Sparkles className="w-4 h-4" /> Generate New Summary
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {[
                    { title: "End of Month Financial Narrative", date: "Oct 1, 2026", words: 850, type: "Finance" },
                    { title: "Term 1 Academic Health Report", date: "Sep 15, 2026", words: 1200, type: "Academic" },
                    { title: "Weekly Disciplinary Summary", date: "Yesterday", words: 340, type: "Admin" },
                    { title: "Transport Fleet Efficiency Review", date: "Sep 2, 2026", words: 620, type: "Operations" },
                 ].map((report, i) => (
                    <div key={i} className="bg-white border border-slate-200/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col group">
                       <div className="flex items-start justify-between mb-4">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                             <FileText className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                             {report.type}
                          </span>
                       </div>
                       <h3 className="font-bold text-slate-800 text-base mb-1">{report.title}</h3>
                       <p className="text-xs text-slate-500 mb-6 flex-1">Auto-generated narrative summary containing key highlights and executive breakdown.</p>
                       <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                          <div className="text-[10px] font-bold text-slate-400 uppercase">{report.date} • {report.words} words</div>
                          <button className="text-xs font-bold text-primary-600 hover:text-primary-800 flex items-center gap-1 transition-colors">
                             Read <ArrowRight className="w-3 h-3" />
                          </button>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        )}
      </div>

    </div>
  );
}
