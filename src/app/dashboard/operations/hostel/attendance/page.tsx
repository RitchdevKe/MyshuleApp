import React from "react";
import { getBoardingStudents, getAttendance, getAttendanceStats } from "./actions";
import AttendanceClient from "./AttendanceClient";

export default async function AttendancePage() {
  const today = new Date();
  
  const [studentsRes, attendanceRes, statsRes] = await Promise.all([
    getBoardingStudents(),
    getAttendance(today),
    getAttendanceStats(today)
  ]);

  const students = studentsRes.data || [];
  const attendance = attendanceRes.data || [];
  const stats = statsRes.data || { totalBoarders: 0, present: 0, absent: 0, onLeave: 0, unrecorded: 0 };

  return (
    <AttendanceClient 
       students={students} 
       initialAttendance={attendance} 
       stats={stats} 
    />
  );
}
