import React from "react";
import { BookOpen, Target, Layout, List, CheckCircle2, TrendingUp, AlertTriangle, BookMarked, Activity, Clock } from "lucide-react";
import { getCurriculumOverview } from "@/app/actions/curriculum";

export default async function CurriculumOverview() {
  const data = await getCurriculumOverview();

  return (
    <div className="space-y-6">
      
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-lg flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BookOpen className="w-24 h-24 text-primary-900" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center text-primary-700 shadow-sm border border-primary-200">
              <Layout className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800">Total Subjects</h3>
              <p className="text-xs font-bold text-slate-500">Active Curriculum</p>
            </div>
          </div>
          <div className="mt-auto relative z-10">
            <div className="text-4xl font-black text-primary-950 mb-1">{data.totalSubjects}</div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 w-fit px-2 py-0.5 rounded-lg border border-emerald-100">
              <TrendingUp className="w-3.5 h-3.5" /> Tracked
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-lg flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Target className="w-24 h-24 text-secondary-500" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-secondary-50 flex items-center justify-center text-secondary-600 shadow-sm border border-secondary-100">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800">Allocation Coverage</h3>
              <p className="text-xs font-bold text-slate-500">Subjects Assigned</p>
            </div>
          </div>
          <div className="mt-auto relative z-10 w-full">
            <div className="flex justify-between items-end mb-2">
              <div className="text-4xl font-black text-secondary-600">{data.coverage}%</div>
              <span className="text-xs font-bold text-slate-500 mb-1">Target: 100%</span>
            </div>
            <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden shadow-inner">
              <div className="h-full bg-secondary-500 rounded-full" style={{ width: `${data.coverage}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl p-6 shadow-lg flex flex-col relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <CheckCircle2 className="w-24 h-24 text-emerald-500" />
          </div>
          <div className="flex items-center gap-3 mb-4 relative z-10">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
              <List className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-slate-800">Total Exams</h3>
              <p className="text-xs font-bold text-slate-500">Scheduled Assessments</p>
            </div>
          </div>
          <div className="mt-auto relative z-10">
            <div className="text-4xl font-black text-emerald-700 mb-1">{data.totalExams}</div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 bg-amber-50 w-fit px-2 py-0.5 rounded-lg border border-amber-100">
              <AlertTriangle className="w-3.5 h-3.5" /> Manage in Setup
            </div>
          </div>
        </div>

      </div>

      {/* Recent Updates & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Syllabus Updates (now Recent Exams) */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-primary-900" /> Recent Exams
            </h3>
            <a href="/dashboard/academics/curriculum/setup" className="text-xs font-bold text-secondary-600 hover:text-secondary-700 bg-secondary-50 px-3 py-1 rounded-lg transition-colors">
              Manage Exams
            </a>
          </div>
          
          <div className="space-y-3">
            {data.recentExams.length === 0 ? (
              <p className="text-sm text-slate-500">No exams have been created yet.</p>
            ) : (
              data.recentExams.map((exam) => (
                <div key={exam.id} className="flex items-center justify-between p-4 bg-white/80 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{exam.name}</p>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">{exam.academicTerm.name}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md border border-slate-100 mb-1">
                      Start: {new Date(exam.startDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Coverage by Learning Area (now Top Subjects by Allocation) */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-3xl shadow-lg p-6">
          <h3 className="text-lg font-black text-slate-800 flex items-center gap-2 mb-6">
            <Target className="w-5 h-5 text-secondary-500" /> Top Subjects by Allocation
          </h3>
          
          <div className="space-y-5">
            {data.topSubjects.length === 0 ? (
              <p className="text-sm text-slate-500">No subjects or allocations found.</p>
            ) : (
              data.topSubjects.map((subject, i) => {
                const colors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500"];
                const color = colors[i % colors.length];
                const maxAlloc = data.topSubjects[0]?._count.allocations || 1;
                const progress = maxAlloc > 0 ? (subject._count.allocations / maxAlloc) * 100 : 0;
                
                return (
                  <div key={subject.id}>
                    <div className="flex justify-between text-xs font-bold mb-1.5">
                      <span className="text-slate-700">{subject.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-slate-400">Allocations:</span>
                        <span className="text-primary-900">{subject._count.allocations}</span>
                      </div>
                    </div>
                    <div className="h-2 w-full bg-slate-200/50 rounded-full overflow-hidden shadow-inner relative">
                      <div className={`h-full rounded-full ${color}`} style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="mt-8 p-4 bg-primary-50/50 border border-primary-100 rounded-2xl flex items-start gap-3">
            <div className="mt-0.5 w-2 h-2 rounded-full bg-primary-500 animate-pulse flex-shrink-0" />
            <p className="text-xs font-bold text-primary-800 leading-relaxed">
              These subjects have the highest number of class allocations. Ensure the respective departments are well-resourced.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}