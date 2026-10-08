"use server";

import prisma from "@/lib/prisma";
import { AttendanceStatus } from "@prisma/client";

export async function generateAttendanceReport(params: { type: string, cohort: string, startDate?: string, endDate?: string }) {
  try {
    const whereClause: any = {};
    if (params.startDate && params.endDate) {
      whereClause.register = {
        date: {
          gte: new Date(params.startDate),
          lte: new Date(params.endDate)
        }
      };
    } else if (params.startDate) {
      whereClause.register = {
        date: {
          gte: new Date(params.startDate)
        }
      };
    }

    const records = await prisma.attendanceRecord.findMany({
      where: whereClause,
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true
          }
        },
        register: {
          select: {
            date: true
          }
        }
      },
      orderBy: {
        register: {
          date: 'desc'
        }
      }
    });

    const presentCount = records.filter(r => r.status === 'PRESENT').length;
    const absentCount = records.filter(r => r.status === 'ABSENT').length;
    const lateCount = records.filter(r => r.status === 'LATE').length;
    const totalCount = records.length;
    
    const avg = totalCount > 0 ? (((presentCount + lateCount) / totalCount) * 100).toFixed(1) + "%" : "0%";

    return {
      success: true,
      summary: {
        totalStudents: new Set(records.map(r => r.studentId)).size,
        averageAttendance: avg,
        totalAbsences: absentCount,
        chronicAbsentees: 0 
      },
      data: records.map(r => ({
        id: r.id,
        studentName: `${r.student.firstName} ${r.student.lastName}`,
        grade: "N/A",
        date: r.register.date.toISOString().split('T')[0],
        status: r.status,
        remarks: r.remarks || ""
      }))
    };
  } catch (error) {
    console.error("Failed to generate report:", error);
    return { success: false, error: "Failed to generate report" };
  }
}
