import React from 'react';
import { User, TrendingUp, TrendingDown, ChevronDown, Sparkles } from 'lucide-react';
import Link from 'next/link';
import ActiveStudentHeader from '../components/ActiveStudentHeader';
import { getParentPortalData } from '../data';
import prisma from "@/lib/prisma";
import AnalysisCharts from './AnalysisCharts';
import ResultsAccordion from './ResultsAccordion';

export default async function AnalysisPage() {
  const { parent, activeStudent } = await getParentPortalData();

  if (!activeStudent) {
    return (
      <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto w-full">
        <div className="p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-3xl shadow-sm text-center text-slate-500 border border-slate-200/50">
          No active student selected.
        </div>
      </div>
    );
  }

  const examResults = await prisma.examResult.findMany({
    where: { studentId: activeStudent.id },
    include: {
      exam: true,
      subject: true,
      gradeRange: true,
    },
    orderBy: { exam: { endDate: 'desc' } }
  });

  const exams = Array.from(new Set(examResults.map(r => r.exam.id))).map(id => {
    return examResults.find(r => r.exam.id === id)?.exam;
  }).filter(Boolean);

  const latestExam = exams[0];
  const latestResults = latestExam ? examResults.filter(r => r.exam.id === latestExam.id) : [];

  let meanMarks = 0;
  let totalPoints = 0;
  let strongArea = null;
  let weakArea = null;

  if (latestResults.length > 0) {
    const validScores = latestResults.filter(r => r.numericScore != null);
    const totalMarks = validScores.reduce((acc, curr) => acc + (curr.numericScore || 0), 0);
    if (validScores.length > 0) {
      meanMarks = totalMarks / validScores.length;
    }
    totalPoints = totalMarks;

    const sorted = [...validScores].sort((a, b) => (b.numericScore || 0) - (a.numericScore || 0));
    strongArea = sorted[0];
    weakArea = sorted[sorted.length - 1];
  }

  // Predictive Insight text
  const getPredictiveInsight = () => {
    if (meanMarks >= 80) return "Based on current trends, the student is performing excellently and is on track for Honors classification.";
    if (meanMarks >= 60) return "The student is showing steady progress. Focused revision in weaker subjects could push them into the top quartile.";
    return "The student may benefit from early intervention or remedial support to improve their foundational understanding.";
  };

  return (
    <div className="flex flex-col gap-6 p-4 max-w-lg mx-auto w-full">
      <ActiveStudentHeader />

      <div className="flex bg-white/50 dark:bg-slate-800/50 backdrop-blur-md rounded-2xl p-1 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <Link href="?tab=summative" className="flex-1 text-center py-2.5 bg-white dark:bg-slate-700 rounded-xl shadow-sm text-sm font-bold text-primary-700 dark:text-primary-400">
          Summative
        </Link>
        <Link href="?tab=formative" className="flex-1 text-center py-2.5 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400">
          Formative
        </Link>
      </div>

      <section className="pb-8">
        <h3 className="font-black text-slate-800 dark:text-slate-100 text-xl mb-4">Academic Insights</h3>

        {exams.length > 0 ? (
          <div className="relative mb-6">
            <select className="w-full bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 pr-10 text-slate-700 dark:text-slate-200 font-bold appearance-none focus:outline-none focus:ring-2 focus:ring-primary-500/50 shadow-sm transition-all cursor-pointer">
              {exams.map(ex => (
                <option key={ex?.id}>{ex?.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-4 w-5 h-5 text-slate-400 pointer-events-none" />
          </div>
        ) : (
          <div className="p-4 bg-white/50 border border-slate-200/50 rounded-2xl text-slate-500 mb-4 shadow-sm">
            No exams found.
          </div>
        )}

        {latestResults.length > 0 ? (
          <>
            {/* Predictive Insight Card */}
            <div className="bg-gradient-to-br from-primary-900 to-primary-800 text-white p-5 rounded-3xl shadow-lg shadow-primary-900/20 mb-6 relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
              <div className="flex items-start gap-3 relative z-10">
                <Sparkles className="w-5 h-5 text-primary-200 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-primary-100 uppercase tracking-wider mb-1">AI Projection</h4>
                  <p className="text-sm font-medium leading-relaxed">{getPredictiveInsight()}</p>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 bg-white dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-3xl p-5 flex flex-col items-center justify-center shadow-sm">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{meanMarks.toFixed(1)}</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-1">Mean Marks</span>
              </div>
              <div className="flex-1 bg-white dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700 rounded-3xl p-5 flex flex-col items-center justify-center shadow-sm">
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100">{totalPoints}</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mt-1">Total Points</span>
              </div>
            </div>

            {/* Recharts Data Visualization */}
            <div className="mb-6">
               <AnalysisCharts examResults={examResults} />
            </div>

            {/* Strengths & Weaknesses */}
            <div className="flex flex-col gap-4 mb-8">
              {strongArea && (
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-5 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm flex items-center justify-between group hover:-translate-y-1 transition-transform">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <TrendingUp className="w-4 h-4 text-emerald-500" />
                       <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Strongest Subject</span>
                    </div>
                    <h4 className="font-black text-slate-800 dark:text-slate-100 text-lg mb-0.5">{strongArea.subject?.name}</h4>
                    <p className="text-xs font-semibold text-slate-500">{strongArea.gradeRange?.defaultRemarks || 'Excellent Work'}</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex flex-col items-center justify-center text-emerald-700 dark:text-emerald-400">
                    <span className="font-black text-xl leading-none">{strongArea.numericScore}</span>
                    <span className="text-[10px] font-bold">{strongArea.gradeRange?.gradeLabel || '-'}</span>
                  </div>
                </div>
              )}

              {weakArea && (
                <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-5 border border-slate-200 dark:border-slate-700 rounded-3xl shadow-sm flex items-center justify-between group hover:-translate-y-1 transition-transform">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                       <TrendingDown className="w-4 h-4 text-orange-500" />
                       <span className="text-[10px] font-black uppercase tracking-wider text-slate-500">Area for Growth</span>
                    </div>
                    <h4 className="font-black text-slate-800 dark:text-slate-100 text-lg mb-0.5">{weakArea.subject?.name}</h4>
                    <p className="text-xs font-semibold text-slate-500">{weakArea.gradeRange?.defaultRemarks || 'Needs Attention'}</p>
                  </div>
                  <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-900/20 flex flex-col items-center justify-center text-orange-700 dark:text-orange-400">
                    <span className="font-black text-xl leading-none">{weakArea.numericScore}</span>
                    <span className="text-[10px] font-bold">{weakArea.gradeRange?.gradeLabel || '-'}</span>
                  </div>
                </div>
              )}
            </div>

            <ResultsAccordion results={latestResults} />

            <Link href={`/parent-portal/analysis/details?exam=${latestExam.id}`} className="flex items-center justify-center w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-primary-600/20 active:scale-95">
              View Full Report Card
            </Link>
          </>
        ) : (
          <div className="p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200/50 dark:border-slate-700/50 rounded-3xl shadow-sm text-center text-slate-500 flex flex-col items-center">
            <span className="text-4xl mb-3 opacity-20">📊</span>
            <span className="font-medium">No assessment data available.</span>
          </div>
        )}
      </section>
    </div>
  );
}


