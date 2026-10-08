"use client";

import React from 'react';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip 
} from 'recharts';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 p-3 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700">
        <p className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-1">{label}</p>
        <p className="text-primary-600 dark:text-primary-400 font-black">
          {payload[0].value}%
        </p>
      </div>
    );
  }
  return null;
};

export default function AnalysisCharts({ examResults }: { examResults: any[] }) {
  // Process data for the Area Chart (Trendline over time)
  // We want to group by Exam Name and get the average score for that exam.
  const examMap = new Map();
  examResults.forEach(r => {
    if (!r.exam || r.numericScore == null) return;
    const date = new Date(r.exam.endDate || r.exam.startDate).getTime();
    if (!examMap.has(date)) {
      examMap.set(date, {
        name: r.exam.name,
        date,
        totalScore: 0,
        count: 0
      });
    }
    const entry = examMap.get(date);
    entry.totalScore += r.numericScore;
    entry.count += 1;
  });

  const trendData = Array.from(examMap.values())
    .sort((a, b) => a.date - b.date)
    .map(entry => ({
      name: entry.name,
      average: Math.round(entry.totalScore / entry.count)
    }));

  // Process data for the Radar Chart (Subject breakdown for the latest exam)
  // Get the most recent exam
  const latestExam = trendData.length > 0 ? trendData[trendData.length - 1].name : null;
  const latestResults = examResults.filter(r => r.exam?.name === latestExam && r.numericScore != null);
  
  const radarData = latestResults.map(r => ({
    subject: r.subject?.name?.substring(0, 12) + (r.subject?.name?.length > 12 ? '...' : ''),
    score: r.numericScore,
    fullMark: 100
  }));

  return (
    <div className="flex flex-col gap-6">
      
      {/* Radar Chart Section */}
      {radarData.length > 2 ? (
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-5 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Subject Proficiency</h4>
          <p className="text-xs text-slate-500 mb-6">360-degree view of core competencies</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="score" stroke="#3a1127" fill="#895876" fillOpacity={0.5} />
                <Tooltip content={<CustomTooltip />} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}

      {/* Area Chart Section */}
      {trendData.length > 1 ? (
        <div className="bg-white dark:bg-slate-800/50 backdrop-blur-md p-5 rounded-3xl border border-slate-200 dark:border-slate-700/50 shadow-sm">
          <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-1">Performance Trend</h4>
          <p className="text-xs text-slate-500 mb-6">Historical academic trajectory</p>
          <div className="h-56 w-full -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAvg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3a1127" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3a1127" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="average" stroke="#3a1127" strokeWidth={3} fillOpacity={1} fill="url(#colorAvg)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : null}

    </div>
  );
}



