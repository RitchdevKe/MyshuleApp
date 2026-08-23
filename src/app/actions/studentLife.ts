"use server";

import prisma from "@/lib/prisma";
import { AttendanceStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";

const DEFAULT_TENANT_ID = "tenant-1";

export async function getAttendanceLayoutStats() {
  try {
    const totalRecords = await prisma.attendanceRecord.count({
      where: { register: { tenantId: DEFAULT_TENANT_ID } }
    });
    
    return {
      averageAttendance: "95%",
      onLeave: 12,
      perfectAttendance: 145,
      pendingApprovals: 5,
    };
  } catch (error) {
    return {
      averageAttendance: "0%",
      onLeave: 0,
      perfectAttendance: 0,
      pendingApprovals: 0,
    };
  }
}

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

export async function getDisciplineLayoutStats() {
  try {
    const activeCases = await prisma.disciplinaryIncident.count({
      where: { tenantId: DEFAULT_TENANT_ID, status: "OPEN" }
    });
    const totalCases = await prisma.disciplinaryIncident.count({
      where: { tenantId: DEFAULT_TENANT_ID }
    });
    
    return {
      activeCases,
      resolvedCases: totalCases - activeCases,
      interventions: 12, // Stub for now
      sessions: 4, // Stub for now
    };
  } catch (error) {
    return {
      activeCases: 0,
      resolvedCases: 0,
      interventions: 0,
      sessions: 0,
    };
  }
}

export async function getDisciplineCases() {
  try {
    const cases = await prisma.disciplinaryIncident.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            enrollments: {
              include: {
                class: true
              }
            }
          }
        },
        reportedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
        }
      },
      orderBy: { incidentDate: 'desc' }
    });
    return { success: true, data: cases };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getDisciplineFormData() {
  try {
    const students = await prisma.student.findMany({
      where: { tenantId: DEFAULT_TENANT_ID, status: "ACTIVE" },
      select: { id: true, firstName: true, lastName: true, admissionNumber: true }
    });
    const staff = await prisma.staff.findMany({
      where: { tenantId: DEFAULT_TENANT_ID, status: "ACTIVE" },
      select: { id: true, firstName: true, lastName: true, employeeNumber: true }
    });
    return { success: true, data: { students, staff } };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createDisciplineCase(data: any) {
  try {
    const newCase = await prisma.disciplinaryIncident.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        studentId: data.studentId,
        reportedById: data.reportedById,
        incidentDate: new Date(data.incidentDate),
        severity: data.severity,
        description: data.description,
        actionTaken: data.actionTaken,
        status: data.status || 'OPEN'
      }
    });
    revalidatePath("/dashboard/student-life/discipline-welfare/cases");
    return { success: true, data: newCase };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateDisciplineCase(id: string, data: any) {
  try {
    const updated = await prisma.disciplinaryIncident.update({
      where: { id },
      data: {
        studentId: data.studentId,
        reportedById: data.reportedById,
        incidentDate: new Date(data.incidentDate),
        severity: data.severity,
        description: data.description,
        actionTaken: data.actionTaken,
        status: data.status
      }
    });
    revalidatePath("/dashboard/student-life/discipline-welfare/cases");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDisciplineCase(id: string) {
  try {
    await prisma.disciplinaryIncident.delete({
      where: { id }
    });
    revalidatePath("/dashboard/student-life/discipline-welfare/cases");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function getLeadershipLayoutStats() {
  try {
    return {
      activeLeaders: 24,
      openPositions: 2,
      upcomingElections: 1,
      pendingActivities: 3,
    };
  } catch (error) {
    return {
      activeLeaders: 0,
      openPositions: 0,
      upcomingElections: 0,
      pendingActivities: 0,
    };
  }
}

export async function getEngagementLayoutStats() {
  try {
    return {
      activePortfolios: 1240,
      totalAwards: 86,
      serviceHours: 350,
      averageParticipation: 78,
    };
  } catch (error) {
    return {
      activePortfolios: 0,
      totalAwards: 0,
      serviceHours: 0,
      averageParticipation: 0,
    };
  }
}

export async function getActivitiesLayoutStats() {
  try {
    const totalClubs = await prisma.extracurricularActivity.count({
      where: { tenantId: DEFAULT_TENANT_ID, activityType: "CLUB" }
    });
    const totalSports = await prisma.extracurricularActivity.count({
      where: { tenantId: DEFAULT_TENANT_ID, activityType: "SPORT" }
    });
    
    return {
      activeClubs: totalClubs,
      sportsTeams: totalSports,
      upcomingEvents: 4, // Simulated
      studentAthletes: 125, // Simulated
    };
  } catch (error) {
    return {
      activeClubs: 0,
      sportsTeams: 0,
      upcomingEvents: 0,
      studentAthletes: 0,
    };
  }
}
