"use server";

import prisma from "@/lib/prisma";

export async function getStudents() {
  try {
    const students = await prisma.student.findMany({
      take: 50,
      include: {
        enrollments: {
          include: {
            class: true,
            stream: true
          }
        },
        parents: {
          include: {
            parent: true
          }
        },
        attendanceRecords: {
          include: {
            register: true
          },
          orderBy: {
            register: {
              date: 'desc'
            }
          },
          take: 10
        }
      }
    });
    
    return students;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
}

export async function sendNoticeToParent(studentId: string, parentEmailOrPhone: string) {
  // Mock function for sending notice to a parent
  console.log(`Sending notice for student ${studentId} to ${parentEmailOrPhone}`);
  return { success: true, message: "Notice sent successfully." };
}
