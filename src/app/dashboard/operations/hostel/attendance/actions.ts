"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getAttendance(date: Date) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23,59,59,999);

    const records = await prisma.boardingAttendance.findMany({
      where: {
         date: {
           gte: startOfDay,
           lte: endOfDay,
         }
      },
      include: {
        student: {
          include: {
            hostelAllocation: {
              include: {
                hostel: true,
                room: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: records };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function markAttendance(data: {
  studentId: string;
  status: string;
  notes?: string;
}) {
  try {
    const tenant = await prisma.tenant.findFirst();
    if (!tenant) throw new Error("No tenant found");

    const startOfDay = new Date();
    startOfDay.setHours(0,0,0,0);
    const endOfDay = new Date();
    endOfDay.setHours(23,59,59,999);
    
    let record = await prisma.boardingAttendance.findFirst({
       where: {
          studentId: data.studentId,
          date: {
             gte: startOfDay,
             lte: endOfDay
          }
       }
    });
    
    if (record) {
       record = await prisma.boardingAttendance.update({
          where: { id: record.id },
          data: { status: data.status, notes: data.notes }
       });
    } else {
       record = await prisma.boardingAttendance.create({
         data: {
            tenantId: tenant.id,
            studentId: data.studentId,
            status: data.status,
            notes: data.notes,
            date: new Date(),
         },
       });
    }
    
    revalidatePath("/dashboard/operations/hostel/attendance");
    return { success: true, data: record };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getBoardingStudents() {
   try {
      const students = await prisma.student.findMany({
         where: {
            hostelAllocation: {
               status: "ACTIVE"
            }
         },
         include: {
            hostelAllocation: {
               include: {
                  hostel: true,
                  room: true
               }
            }
         }
      });
      return { success: true, data: students };
   } catch (error: any) {
      return { success: false, error: error.message };
   }
}

export async function getAttendanceStats(date: Date) {
   try {
       const totalBoarders = await prisma.hostelAllocation.count({
          where: { status: "ACTIVE" }
       });
       
       const startOfDay = new Date(date);
       startOfDay.setHours(0,0,0,0);
       const endOfDay = new Date(date);
       endOfDay.setHours(23,59,59,999);

       const attendance = await prisma.boardingAttendance.findMany({
          where: {
            date: {
               gte: startOfDay,
               lte: endOfDay,
            }
          }
       });
       
       const present = attendance.filter(a => a.status === 'PRESENT').length;
       const absent = attendance.filter(a => a.status === 'ABSENT').length;
       const onLeave = attendance.filter(a => a.status === 'LEAVE').length;
       
       const unrecorded = totalBoarders - attendance.length;
       
       return { success: true, data: { totalBoarders, present, absent, onLeave, unrecorded } };
   } catch (error: any) {
       return { success: false, error: error.message };
   }
}
