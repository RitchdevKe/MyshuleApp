"use client";

import React from "react";
import { FileText, Download, TrendingUp, Users, Calendar, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from "recharts";

type TopCards = {
  avgOccupancy: number;
  totalBoarders: number;
  roomsInMaintenance: number;
  avgAttendance: number;
};

type OccupancyData = {
  name: string;
  capacity: number;
  allocated: number;
  occupancyRate: number;
};

type AttendanceTrend = {
  date: string;
  rate: number;
};

export default function ReportsClient({ 
  topCards, 
  occupancyByHostel, 
  attendanceTrend 
}: { 
  topCards: TopCards,
  occupancyByHostel: OccupancyData[],
  attendanceTrend: AttendanceTrend[]
}) {
  const reports = [
    { id: "REP-91", title: "Monthly Occupancy Summary", type: "Occupancy", date: "Aug 01, 2024", size: "1.2 MB" },
    { id: "REP-92", title: "Attendance Deficits", type: "Attendance", date: "Jul 31, 2024", size: "840 KB" },
    { id: "REP-93", title: "Maintenance Request Log", type: "Facilities", date: "Jul 15, 2024", size: "2.5 MB" },
    { id: "REP-94", title: "Fee Default Analysis", type: "Financial", date: "Jul 01, 2024", size: "1.8 MB" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-6">
         <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
               <FileText className="w-6 h-6" />
            </div>
            <div>
               <h2 className="text-xl font-black text-slate-800">Boarding Reports</h2>
               <p className="text-sm font-medium text-slate-500">Analytics and generated logs for hostel operations.</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Avg Occupancy</span>
               </div>
               <div className="text-2xl font-black text-slate-800">{topCards.avgOccupancy.toFixed(1)}%</div>
               <div className="text-xs font-medium text-slate-500 mt-1">Based on active allocations</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Total Boarders</span>
               </div>
               <div className="text-2xl font-black text-slate-800">{topCards.totalBoarders}</div>
               <div className="text-xs font-medium text-slate-500 mt-1">Currently residing</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Maintenance</span>
               </div>
               <div className="text-2xl font-black text-slate-800">{topCards.roomsInMaintenance}</div>
               <div className="text-xs font-medium text-amber-600 mt-1">Rooms under maintenance</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
               <div className="flex items-center gap-2 mb-2 text-slate-500">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Avg Attendance</span>
               </div>
               <div className="text-2xl font-black text-slate-800">{topCards.avgAttendance.toFixed(1)}%</div>
               <div className="text-xs font-medium text-slate-500 mt-1">Over the last 7 days</div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Occupancy By Hostel</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={occupancyByHostel}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Bar dataKey="occupancyRate" name="Occupancy %" fill="#0ea5e9" radius={[4, 4, 0, 0]} maxBarSize={50} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">7-Day Attendance Trend</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={attendanceTrend}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Line type="monotone" dataKey="rate" name="Attendance %" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, fill: '#8b5cf6', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
         </div>

         <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-4">Generated Reports</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map(report => (
               <div key={report.id} className="flex items-center justify-between p-4 bg-white border border-slate-200/60 rounded-2xl hover:border-primary-500/30 transition-colors group cursor-pointer">
                  <div className="flex items-start gap-3">
                     <div className="p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-primary-600 transition-colors">
                        <FileText className="w-5 h-5" />
                     </div>
                     <div>
                        <h4 className="font-bold text-slate-800 text-sm">{report.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">{report.type}</span>
                           <span className="text-xs font-medium text-slate-500">{report.date} • {report.size}</span>
                        </div>
                     </div>
                  </div>
                  <button className="text-slate-400 hover:text-primary-600 bg-slate-50 hover:bg-primary-50 p-2 rounded-xl transition-colors">
                     <Download className="w-4 h-4" />
                  </button>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
}
