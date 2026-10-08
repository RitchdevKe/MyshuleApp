"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const REVALIDATE_PATH = "/dashboard/student-life/leadership";

// =======================
// Leadership Positions
// =======================

export async function getLeadershipPositions() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];
  
  return await prisma.leadershipPosition.findMany({
    where: { tenantId: tenant.id },
    include: {
      student: { include: { user: true, currentClass: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createLeadershipPosition(data: any) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  await prisma.leadershipPosition.create({
    data: {
      tenantId: tenant.id,
      title: data.title,
      category: data.category,
      studentId: data.studentId || null,
      supervisorId: data.supervisorId || null,
      term: data.term || null,
      status: data.status || "Vacant",
    },
  });
  
  revalidatePath(`${REVALIDATE_PATH}/positions`);
}

export async function updateLeadershipPosition(id: string, data: any) {
  await prisma.leadershipPosition.update({
    where: { id },
    data: {
      title: data.title,
      category: data.category,
      studentId: data.studentId || null,
      supervisorId: data.supervisorId || null,
      term: data.term || null,
      status: data.status || "Vacant",
    },
  });
  
  revalidatePath(`${REVALIDATE_PATH}/positions`);
}

export async function deleteLeadershipPosition(id: string) {
  await prisma.leadershipPosition.delete({
    where: { id },
  });
  
  revalidatePath(`${REVALIDATE_PATH}/positions`);
}

// =======================
// Elections
// =======================

export async function getElections() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];
  
  return await prisma.election.findMany({
    where: { tenantId: tenant.id },
    include: { candidates: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createElection(data: any) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) throw new Error("No tenant found");

  await prisma.election.create({
    data: {
      tenantId: tenant.id,
      title: data.title,
      date: new Date(data.date),
      status: data.status,
      audience: data.audience,
      voters: data.voters,
    },
  });
  
  revalidatePath(`${REVALIDATE_PATH}/elections`);
}

export async function updateElection(id: string, data: any) {
  await prisma.election.update({
    where: { id },
    data: {
      title: data.title,
      date: new Date(data.date),
      status: data.status,
      audience: data.audience,
      voters: data.voters,
    },
  });
  
  revalidatePath(`${REVALIDATE_PATH}/elections`);
}

export async function deleteElection(id: string) {
  await prisma.election.delete({
    where: { id },
  });
  
  revalidatePath(`${REVALIDATE_PATH}/elections`);
}

export async function addElectionCandidate(electionId: string, data: any) {
  await prisma.electionCandidate.create({
    data: {
      electionId,
      name: data.name,
      role: data.role,
      votes: data.votes || 0,
    },
  });
  
  revalidatePath(`${REVALIDATE_PATH}/elections`);
}

export async function deleteElectionCandidate(id: string) {
  await prisma.electionCandidate.delete({
    where: { id },
  });
  
  revalidatePath(`${REVALIDATE_PATH}/elections`);
}

// =======================
// Utilities
// =======================

export async function getStudentsForDropdown() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  return await prisma.student.findMany({
    where: { tenantId: tenant.id },
    select: { id: true, user: { select: { firstName: true, lastName: true } }, currentClass: { select: { name: true } } },
    take: 100, // Limit to 100 for dropdown
  });
}

export async function getStaffForDropdown() {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return [];

  return await prisma.staff.findMany({
    where: { tenantId: tenant.id },
    select: { id: true, firstName: true, lastName: true, jobTitle: true },
    take: 100,
  });
}
