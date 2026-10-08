import React from 'react';
import { Calendar, BookOpen, Clock, AlertCircle, ArrowRight, ShieldCheck, TrendingUp, MessageSquare, Sparkles } from 'lucide-react';
import Link from 'next/link';
import ActiveStudentHeader from '../components/ActiveStudentHeader';

import { getParentPortalData } from '../data';
import { getTenantProfile } from '@/app/actions/tenant';
import prisma from "@/lib/prisma";

export default async function HomeDiaryPage() {
  const { activeStudent } = await getParentPortalData();
  const profile = await getTenantProfile();
  const schoolName = profile?.name || 'MyShule App';
  if (!activeStudent) return null;

  const examResults = await prisma.examResult.findMany({
    where: { studentId: activeStudent.id },
    include: { subject: true, exam: true },
    orderBy: { exam: { startDate: 'desc' } },
    take: 4,
  });

  const attendanceRecords = await prisma.attendanceRecord.findMany({
    where: { studentId: activeStudent.id },
    orderBy: { register: { date: 'desc' } },
    take: 7,
  });

  const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT').length;
  const attendanceRate = attendanceRecords.length > 0 
    ? Math.round((presentCount / attendanceRecords.length) * 100) 
    : 100;

  const days = [
    { day: 'Sun', date: '30' },
    { day: 'Mon', date: '31' },
    { day: 'Tue', date: '1' },
    { day: 'Wed', date: '2' },
    { day: 'Thu', date: '3', active: true },
    { day: 'Fri', date: '4' },
    { day: 'Sat', date: '5' },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 w-full">
      <ActiveStudentHeader />

      {/* Bento Box Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        
        {/* AI Insights / Weekly Summary - New Card */}
        <div className="md:col-span-2 lg:col-span-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-[2px] shadow-lg shadow-purple-500/10 hover:shadow-xl hover:shadow-purple-500/20 transition-all group">
          <div className="bg-white dark:bg-slate-900 rounded-[22px] p-6 h-full flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-500" />
              <h3 className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
                AI Weekly Summary
              </h3>
            </div>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-medium">
              <strong className="text-slate-800 dark:text-white">{activeStudent.firstName}</strong> has had a solid week! 
              Attendance is perfect at <strong className="text-slate-800 dark:text-white">{attendanceRate}%</strong>. 
              {examResults.length > 0 ? (
                <> Recently scored <strong className="text-slate-800 dark:text-white">{examResults[0].numericScore}%</strong> in {examResults[0].subject.name}.</>
              ) : (
                <> No recent assessments this week.</>
              )} Behavioral reports show excellent engagement. Keep up the good work!
            </p>
          </div>
        </div>

        {/* Main Welcome/Learning App Card */}
        <div className="md:col-span-2 lg:col-span-2 bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-6 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden group">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-white/10 rounded-l-full blur-3xl group-hover:scale-110 transition-transform duration-700 pointer-events-none"></div>
          <div className="relative z-10 flex flex-col h-full justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4 opacity-90">
                <BookOpen className="w-5 h-5" />
                <span className="font-bold tracking-widest text-xs uppercase">{schoolName} LEARNING</span>
              </div>
              <h3 className="font-black text-2xl md:text-3xl mb-3 leading-tight">
                Unlock your child's<br/>full potential.
              </h3>
              <p className="text-primary-50 text-sm mb-6 max-w-[80%] font-medium">
                Support learning at home with AI-curated lessons, revision tools, and interactive quizzes.
              </p>
            </div>
            <Link href="#" className="bg-white text-primary-700 px-6 py-3 rounded-2xl text-sm font-bold hover:bg-primary-50 hover:shadow-lg hover:-translate-y-1 transition-all inline-flex items-center gap-2 w-fit">
              Launch App <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Attendance Summary Card */}
        <div className="md:col-span-1 lg:col-span-1 bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 flex flex-col justify-between hover:shadow-md transition-shadow group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Attendance</h3>
              <div className="p-2 bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 rounded-xl group-hover:scale-110 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-black tabular-nums text-slate-900 dark:text-white">{attendanceRate}%</span>
              <span className="text-sm font-semibold text-slate-500 mb-1">this week</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2 mt-4 overflow-hidden">
              <div className="bg-primary-500 h-2 rounded-full transition-all duration-1000 ease-out" style={{ width: `${attendanceRate}%` }}></div>
            </div>
          </div>
          <Link href="/parent-portal/analysis" className="text-primary-600 dark:text-primary-400 text-sm font-bold mt-4 flex items-center gap-1 hover:gap-2 transition-all">
            View full record <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Behavior / Welfare Snapshot */}
        <div className="md:col-span-1 lg:col-span-1 bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Wellbeing</h3>
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
               <div>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Behavior Score</p>
                 <p className="font-black text-slate-800 dark:text-slate-100">Excellent</p>
               </div>
               <TrendingUp className="w-5 h-5 text-primary-500" />
            </div>
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:border-slate-200 dark:hover:border-slate-600 transition-colors">
               <div>
                 <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Clinic Visits</p>
                 <p className="font-black text-slate-800 dark:text-slate-100">0 this term</p>
               </div>
               <div className="w-2 h-2 rounded-full bg-primary-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            </div>
          </div>
        </div>

        {/* Diary / Calendar Card */}
        <div className="md:col-span-2 lg:col-span-2 bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Academic Diary</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">This Week's Timeline</p>
            </div>
            <Link href="#" className="flex items-center gap-2 border border-slate-200 dark:border-slate-600 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 active:scale-95 text-xs font-bold transition-all">
              <Calendar className="w-4 h-4" />
              Change Week
            </Link>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2 snap-x">
            {days.map((d, i) => (
              <button
                key={i}
                className={`flex flex-col items-center justify-center min-w-[64px] py-3 rounded-2xl border snap-center hover:-translate-y-1 transition-all ${
                  d.active
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 shadow-md shadow-primary-500/10'
                    : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-[11px] font-bold uppercase tracking-wider mb-1 opacity-70">{d.day}</span>
                <span className={`text-lg font-black ${d.active ? 'text-primary-700 dark:text-primary-400' : 'text-slate-800 dark:text-slate-200'}`}>{d.date}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Results Card */}
        <div className="md:col-span-2 lg:col-span-3 bg-white dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700/50 hover:shadow-md transition-shadow group">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">Recent Assessments</h3>
            <Link href="/parent-portal/analysis" className="text-primary-600 text-sm font-bold hover:underline">View All</Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {examResults.length > 0 ? (
              examResults.map((result) => (
                <div key={result.id} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-900/50 hover:-translate-y-1 transition-all">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">{result.subject.name}</h4>
                    <div className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-1 rounded-lg text-xs font-black tabular-nums">
                      {result.numericScore}%
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mb-2">{result.exam.name}</p>
                  {result.teacherRemarks && (
                    <div className="flex items-start gap-2 mt-3 pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                      <MessageSquare className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-slate-600 dark:text-slate-400 italic leading-relaxed">"{result.teacherRemarks}"</p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 flex flex-col items-center justify-center text-slate-400">
                <AlertCircle className="w-10 h-10 opacity-20 mb-3" />
                <p className="text-sm font-medium">No recent assessments recorded.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}



