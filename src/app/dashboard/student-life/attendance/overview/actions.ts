"use server";

import prisma from "@/lib/prisma";

export async function getOverviewStats() {
  try {
    const present = await prisma.attendanceRecord.count({ where: { status: 'PRESENT' } });
    const absent = await prisma.attendanceRecord.count({ where: { status: 'ABSENT' } });
    const late = await prisma.attendanceRecord.count({ where: { status: 'LATE' } });
    const excused = await prisma.attendanceRecord.count({ where: { status: 'EXCUSED' } });

    const total = present + absent + late + excused;
    const todayAttendance = total > 0 ? ((present + late) / total * 100).toFixed(1) : 0;

    return {
      success: true,
      stats: {
        todayAttendance: Number(todayAttendance),
        present,
        absent,
        late
      }
    };
  } catch (error) {
    console.error("Error fetching overview stats:", error);
    return {
      success: false,
      stats: {
        todayAttendance: 0,
        present: 0,
        absent: 0,
        late: 0
      }
    };
  }
}
