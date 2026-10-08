"use server";

import prisma from "@/lib/prisma";
import { AttendanceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "tenant-1";

export async function getDailyAttendance(dateStr?: string, streamId?: string) {
  try {
    let selectedStreamId = streamId;
    
    if (!selectedStreamId) {
      const stream = await prisma.stream.findFirst({ where: { tenantId: DEFAULT_TENANT_ID } });
      if (!stream) throw new Error("No streams found");
      selectedStreamId = stream.id;
    }

    const term = await prisma.academicTerm.findFirst({ where: { tenantId: DEFAULT_TENANT_ID } });
    const staff = await prisma.staff.findFirst({ where: { tenantId: DEFAULT_TENANT_ID } });
    const stream = await prisma.stream.findUnique({ where: { id: selectedStreamId } });
    
    if (!term || !staff || !stream) throw new Error("Missing term, staff, or stream");

    const date = dateStr ? new Date(dateStr) : new Date();
    date.setHours(0,0,0,0);

    const register = await prisma.attendanceRegister.findFirst({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        streamId: selectedStreamId,
        date: date
      },
      include: {
        records: true
      }
    });

    const year = await prisma.academicYear.findFirst({ where: { tenantId: DEFAULT_TENANT_ID } });
    const enrollments = await prisma.studentEnrollment.findMany({
      where: {
        tenantId: DEFAULT_TENANT_ID,
        streamId: selectedStreamId,
        academicYearId: year?.id
      },
      include: {
        student: {
          select: {
            id: true,
            admissionNumber: true,
            firstName: true,
            lastName: true
          }
        }
      }
    });

    let students = enrollments.map(e => ({
      id: e.student.id,
      admissionNumber: e.student.admissionNumber,
      name: `${e.student.firstName} ${e.student.lastName}`,
      status: "PRESENT" as AttendanceStatus // default
    }));

    if (register) {
      // Merge with existing records
      students = students.map(s => {
        const record = register.records.find(r => r.studentId === s.id);
        if (record) {
          s.status = record.status;
        }
        return s;
      });
    }

    return {
      success: true,
      data: {
        streamName: stream.name,
        teacherName: `${staff.firstName} ${staff.lastName}`,
        date: date.toISOString(),
        students,
        termId: term.id,
        staffId: staff.id,
        streamId: selectedStreamId,
        registerId: register?.id
      }
    };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}

export async function saveDailyAttendance(data: {
  streamId: string;
  termId: string;
  staffId: string;
  date: string;
  records: { studentId: string; status: AttendanceStatus }[];
}) {
  try {
    const date = new Date(data.date);
    date.setHours(0,0,0,0);

    // Upsert register
    const register = await prisma.attendanceRegister.upsert({
      where: {
        streamId_date: {
          streamId: data.streamId,
          date: date
        }
      },
      update: {},
      create: {
        tenantId: DEFAULT_TENANT_ID,
        academicTermId: data.termId,
        streamId: data.streamId,
        date: date,
        recordedById: data.staffId
      }
    });

    // Upsert records
    for (const record of data.records) {
      await prisma.attendanceRecord.upsert({
        where: {
          registerId_studentId: {
            registerId: register.id,
            studentId: record.studentId
          }
        },
        update: {
          status: record.status
        },
        create: {
          registerId: register.id,
          studentId: record.studentId,
          status: record.status
        }
      });
    }

    revalidatePath("/dashboard/student-life/attendance/daily");
    return { success: true };
  } catch (error: unknown) {
    return { success: false, error: error instanceof Error ? error.message : String(error) };
  }
}
