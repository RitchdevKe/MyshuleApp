"use client";

import React, { useState, useTransition } from "react";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Users,
  X,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { sendParentAlertsAction } from "../actions";
import type { AttendanceReportData } from "../actions";

interface Props {
  data: AttendanceReportData;
}

export default function AttendanceClient({ data }: Props) {
  const {
    todayRate,
    chronicAbsentCount,
    gradeAttendance,
    chronicAbsentStudents,
  } = data;

  const [showStudentList, setShowStudentList] = useState(false);
  const [alertResult, setAlertResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSendAlerts() {
    const studentIds = chronicAbsentStudents.map((s) => s.id);
    startTransition(async () => {
      const result = await sendParentAlertsAction(studentIds);
      setAlertResult(result.message);
      setTimeout(() => setAlertResult(null), 5000);
    });
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-black text-slate-800">
            Attendance Insights
          </h2>
          <p className="text-sm text-slate-500">
            Track daily attendance rates and identify chronic absenteeism.
          </p>
        </div>
        <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-black flex items-center gap-2">
          Today&apos;s Rate: {todayRate}%
        </div>
      </div>

      {alertResult && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl text-sm font-bold">
          <CheckCircle className="w-4 h-4" />
          {alertResult}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chronic Absenteeism */}
        <div className="bg-rose-50 border border-rose-100 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black text-rose-800 uppercase tracking-wider mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-rose-500" /> Chronic
            Absenteeism
          </h3>
          <p className="text-xs text-rose-600 mb-6">
            Students with attendance below 80% this term.
          </p>

          <div className="text-center mb-6">
            <div className="text-5xl font-black text-rose-700 mb-2">
              {chronicAbsentCount}
            </div>
            <div className="text-xs font-bold text-rose-500 uppercase">
              Students At Risk
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setShowStudentList(true)}
              className="w-full bg-white border border-rose-200 text-slate-700 py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-rose-100 hover:text-rose-800 transition-colors"
            >
              View Student List
            </button>
            <button
              onClick={handleSendAlerts}
              disabled={isPending || chronicAbsentCount === 0}
              className="w-full bg-rose-600 text-white py-2.5 rounded-xl text-xs font-bold shadow-sm hover:bg-rose-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="w-3 h-3" />
                  Send Parent Alerts (SMS)
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grade Breakdown */}
        <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-sm p-6">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider mb-6 flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-500" /> Attendance by Grade
          </h3>

          {gradeAttendance.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              No attendance data available yet.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {gradeAttendance.map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer"
                >
                  <div className="text-xs font-bold text-slate-500 mb-2">
                    {item.grade}
                  </div>
                  <div
                    className={`text-2xl font-black mb-1 ${item.rate < 93 ? "text-amber-600" : "text-slate-800"}`}
                  >
                    {item.rate}%
                  </div>
                  <div
                    className={`flex items-center justify-center gap-1 text-[10px] font-bold uppercase ${item.trend > 0 ? "text-emerald-500" : "text-rose-500"}`}
                  >
                    {item.trend > 0 ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    {Math.abs(item.trend)}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Student List Modal */}
      {showStudentList && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between p-5 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-800">
                  Chronically Absent Students
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Students with attendance rate below 80% this term
                </p>
              </div>
              <button
                onClick={() => setShowStudentList(false)}
                className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 p-5">
              {chronicAbsentStudents.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-sm">
                  No chronically absent students found — great news!
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                      <th className="pb-3 pr-4">Student</th>
                      <th className="pb-3 pr-4">Adm No.</th>
                      <th className="pb-3 pr-4">Class</th>
                      <th className="pb-3 text-right">Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {chronicAbsentStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50">
                        <td className="py-3 pr-4 font-semibold text-slate-700">
                          {student.name}
                        </td>
                        <td className="py-3 pr-4 text-slate-500">
                          {student.admissionNumber}
                        </td>
                        <td className="py-3 pr-4 text-slate-500">
                          {student.className}
                        </td>
                        <td className="py-3 text-right">
                          <span className="inline-block bg-rose-100 text-rose-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            {student.rate}%
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="p-5 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowStudentList(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleSendAlerts();
                  setShowStudentList(false);
                }}
                disabled={isPending || chronicAbsentStudents.length === 0}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-3 h-3" />
                Send Alerts to All Parents
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
