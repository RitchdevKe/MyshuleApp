"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { IncidentStatus, SeverityLevel } from "@prisma/client";

const DEFAULT_TENANT_ID = "tenant-1";

// ------------------------------------
// Disciplinary Incidents (Cases)
// ------------------------------------

export async function getDisciplinaryIncidents() {
  try {
    const cases = await prisma.disciplinaryIncident.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: {
        student: { select: { id: true, firstName: true, lastName: true, admissionNumber: true } },
        reportedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { incidentDate: 'desc' }
    });
    return { success: true, data: cases };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createDisciplinaryIncident(data: {
  studentId: string;
  reportedById: string;
  incidentDate: string;
  severity: SeverityLevel;
  description: string;
  actionTaken?: string;
  status: IncidentStatus;
}) {
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
        status: data.status,
      }
    });
    revalidatePath("/dashboard/student-life/discipline-welfare");
    return { success: true, data: newCase };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateDisciplinaryIncident(id: string, data: {
  studentId: string;
  reportedById: string;
  incidentDate: string;
  severity: SeverityLevel;
  description: string;
  actionTaken?: string;
  status: IncidentStatus;
}) {
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
        status: data.status,
      }
    });
    revalidatePath("/dashboard/student-life/discipline-welfare");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDisciplinaryIncident(id: string) {
  try {
    await prisma.disciplinaryIncident.delete({
      where: { id }
    });
    revalidatePath("/dashboard/student-life/discipline-welfare");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ------------------------------------
// Disciplinary Actions
// ------------------------------------

export async function getDisciplinaryActions() {
  try {
    const actions = await prisma.disciplinaryAction.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: {
        staff: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { date: 'desc' }
    });
    return { success: true, data: actions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createDisciplinaryAction(data: {
  staffId: string;
  offense: string;
  action: string;
  date: string;
  status: string;
}) {
  try {
    const newAction = await prisma.disciplinaryAction.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        staffId: data.staffId,
        offense: data.offense,
        action: data.action,
        date: new Date(data.date),
        status: data.status,
      }
    });
    revalidatePath("/dashboard/student-life/discipline-welfare");
    return { success: true, data: newAction };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateDisciplinaryAction(id: string, data: {
  staffId: string;
  offense: string;
  action: string;
  date: string;
  status: string;
}) {
  try {
    const updated = await prisma.disciplinaryAction.update({
      where: { id },
      data: {
        staffId: data.staffId,
        offense: data.offense,
        action: data.action,
        date: new Date(data.date),
        status: data.status,
      }
    });
    revalidatePath("/dashboard/student-life/discipline-welfare");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteDisciplinaryAction(id: string) {
  try {
    await prisma.disciplinaryAction.delete({
      where: { id }
    });
    revalidatePath("/dashboard/student-life/discipline-welfare");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ------------------------------------
// Welfare Sessions (Interventions / Counselling)
// ------------------------------------

export async function getWelfareSessions() {
  try {
    const sessions = await prisma.welfareSession.findMany({
      where: { tenantId: DEFAULT_TENANT_ID },
      include: {
        student: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { sessionDate: 'desc' }
    });
    return { success: true, data: sessions };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function createWelfareSession(data: {
  studentId: string;
  sessionDate: string;
  counselor: string;
  category: string;
  notes?: string;
  status: string;
}) {
  try {
    const newSession = await prisma.welfareSession.create({
      data: {
        tenantId: DEFAULT_TENANT_ID,
        studentId: data.studentId,
        sessionDate: new Date(data.sessionDate),
        counselor: data.counselor,
        category: data.category,
        notes: data.notes,
        status: data.status,
      }
    });
    revalidatePath("/dashboard/student-life/discipline-welfare");
    return { success: true, data: newSession };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function updateWelfareSession(id: string, data: {
  studentId: string;
  sessionDate: string;
  counselor: string;
  category: string;
  notes?: string;
  status: string;
}) {
  try {
    const updated = await prisma.welfareSession.update({
      where: { id },
      data: {
        studentId: data.studentId,
        sessionDate: new Date(data.sessionDate),
        counselor: data.counselor,
        category: data.category,
        notes: data.notes,
        status: data.status,
      }
    });
    revalidatePath("/dashboard/student-life/discipline-welfare");
    return { success: true, data: updated };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

export async function deleteWelfareSession(id: string) {
  try {
    await prisma.welfareSession.delete({
      where: { id }
    });
    revalidatePath("/dashboard/student-life/discipline-welfare");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// Utility to get form data
export async function getFormData() {
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
