"use server";

import prisma from "@/lib/prisma";

export async function getSchedulingOverview() {
  try {
    // Attempt to query real models if they exist in the future
    // e.g., const totalTimetables = await prisma.timetable.count();
    
    // For now, returning structured mocked data simulating a DB response
    return {
      totalTimetables: 12,
      activeEvents: 3,
      upcomingClasses: 45,
      recentTimetables: [
        { id: "1", name: "Grade 10 Fall 2026", status: "Active", createdAt: new Date().toISOString() },
        { id: "2", name: "Grade 11 Fall 2026", status: "Active", createdAt: new Date().toISOString() },
        { id: "3", name: "Grade 12 Fall 2026", status: "Draft", createdAt: new Date(Date.now() - 86400000).toISOString() },
      ],
      upcomingEventsList: [
        { id: "1", title: "Midterm Exams", date: new Date(Date.now() + 86400000 * 5).toISOString(), type: "Academic" },
        { id: "2", title: "Sports Day", date: new Date(Date.now() + 86400000 * 12).toISOString(), type: "Extracurricular" },
      ]
    };
  } catch (error) {
    console.error("Failed to fetch scheduling overview:", error);
    return {
      totalTimetables: 0,
      activeEvents: 0,
      upcomingClasses: 0,
      recentTimetables: [],
      upcomingEventsList: []
    };
  }
}
