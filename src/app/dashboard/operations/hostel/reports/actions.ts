"use server";

import prisma from "@/lib/prisma";
import { subDays, format } from "date-fns";

export async function getHostelReportsData(tenantId: string) {
  // 1. Top Cards Data
  const hostels = await prisma.hostel.findMany({
    where: { tenantId },
    include: {
      rooms: {
        include: {
          allocations: {
            where: { status: "ACTIVE" }
          }
        }
      }
    }
  });

  let totalCapacity = 0;
  let totalBoarders = 0;
  let roomsInMaintenance = 0;

  const occupancyByHostel = [];

  for (const hostel of hostels) {
    let hostelCapacity = 0;
    let hostelAllocated = 0;

    for (const room of hostel.rooms) {
      hostelCapacity += room.capacity;
      hostelAllocated += room.allocations.length;
      if (room.status === "MAINTENANCE") {
        roomsInMaintenance++;
      }
    }

    totalCapacity += hostelCapacity;
    totalBoarders += hostelAllocated;

    occupancyByHostel.push({
      name: hostel.name,
      capacity: hostelCapacity,
      allocated: hostelAllocated,
      occupancyRate: hostelCapacity > 0 ? (hostelAllocated / hostelCapacity) * 100 : 0
    });
  }

  const avgOccupancy = totalCapacity > 0 ? (totalBoarders / totalCapacity) * 100 : 0;

  // Last 7 days attendance
  const sevenDaysAgo = subDays(new Date(), 7);
  
  const attendances = await prisma.boardingAttendance.findMany({
    where: {
      tenantId,
      date: {
        gte: sevenDaysAgo
      }
    }
  });

  const attendanceByDate: Record<string, { present: number; total: number }> = {};
  
  // Initialize last 7 days
  for (let i = 6; i >= 0; i--) {
    const d = subDays(new Date(), i);
    const dateStr = format(d, "MMM dd");
    attendanceByDate[dateStr] = { present: 0, total: 0 };
  }

  let totalRecentAttendance = 0;
  let totalRecentPresent = 0;

  attendances.forEach(att => {
    const dateStr = format(att.date, "MMM dd");
    if (attendanceByDate[dateStr]) {
      attendanceByDate[dateStr].total++;
      totalRecentAttendance++;
      if (att.status === "PRESENT") {
        attendanceByDate[dateStr].present++;
        totalRecentPresent++;
      }
    }
  });

  const avgAttendance = totalRecentAttendance > 0 
    ? (totalRecentPresent / totalRecentAttendance) * 100 
    : 0;

  const attendanceTrend = Object.keys(attendanceByDate).map(date => {
    const data = attendanceByDate[date];
    return {
      date,
      rate: data.total > 0 ? (data.present / data.total) * 100 : 0
    };
  });

  return {
    topCards: {
      avgOccupancy,
      totalBoarders,
      roomsInMaintenance,
      avgAttendance
    },
    charts: {
      occupancyByHostel,
      attendanceTrend
    }
  };
}
