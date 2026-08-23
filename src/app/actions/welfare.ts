'use server';

import prisma from '@/lib/prisma';

const DEFAULT_TENANT_ID = '1e8a93ff-1533-4f1a-b337-1473919ff7f2';

export async function getStudentWelfare() {
  try {
    const students = await prisma.student.findMany({
      where: { tenantId: DEFAULT_TENANT_ID, status: 'ACTIVE' },
      include: {
        disciplinaryIncidents: {
          orderBy: { incidentDate: 'desc' },
          take: 5
        },
        attendanceRecords: {
          orderBy: { id: 'desc' },
          take: 30
        }
      }
    });

    return { success: true, data: students };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
export async function logDisciplinaryIncident(data: { studentId: string, description: string, severity: string, actionTaken?: string }) {
  try {
    const staff = await prisma.staff.findFirst();
    if (!staff) throw new Error("No staff found to log incident");

    const incident = await prisma.disciplinaryIncident.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        studentId: data.studentId,
        reportedById: staff.id,
        incidentDate: new Date(),
        severity: data.severity as any,
        description: data.description,
        actionTaken: data.actionTaken,
      }
    });
    return { success: true, data: incident };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateMedicalConditions(studentId: string, medicalConditions: string) {
  try {
    const student = await prisma.student.update({
      where: { id: studentId },
      data: { medicalConditions }
    });
    return { success: true, data: student };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateDisciplinaryIncident(id: string, data: { description: string, severity: string, actionTaken?: string }) {
  try {
    const incident = await prisma.disciplinaryIncident.update({
      where: { id },
      data: {
        severity: data.severity as any,
        description: data.description,
        actionTaken: data.actionTaken,
      }
    });
    return { success: true, data: incident };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDisciplinaryIncident(id: string) {
  try {
    await prisma.disciplinaryIncident.delete({
      where: { id }
    });
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

