"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTransportAssignments() {
  const assignments = await prisma.transportAssignment.findMany({
    include: {
      route: true,
      student: {
        include: {
          enrollments: {
            include: {
              class: true,
            },
            take: 1,
            orderBy: {
              academicYear: {
                id: 'desc'
              }
            }
          },
          parents: {
            include: {
              parent: true,
            },
            take: 1
          },
        },
      },
    },
  });

  return assignments.map((assignment) => {
    const student = assignment.student;
    const grade = student.enrollments[0]?.class?.name || "N/A";
    const primaryParent = student.parents[0]?.parent;

    return {
      id: student.admissionNumber || student.id,
      name: `${student.firstName} ${student.lastName}`,
      grade: grade,
      route: assignment.route.routeName,
      stop: assignment.pickupPoint,
      guardian: primaryParent
        ? `${primaryParent.firstName} ${primaryParent.lastName}`
        : "N/A",
      phone: primaryParent?.phonePrimary || "N/A",
      status: student.status === "ACTIVE" ? "Active" : "Inactive",
    };
  });
}

export async function getRoutes() {
  const routes = await prisma.transportRoute.findMany();
  return routes.map(r => r.routeName);
}

export async function getRoutesData() {
  const routes = await prisma.transportRoute.findMany();
  return routes.map(r => ({
    id: r.id,
    name: r.routeName
  }));
}

export async function getUnassignedStudents() {
  const students = await prisma.student.findMany({
    where: {
      transportAssignments: {
        none: {}
      }
    }
  });
  return students.map(s => ({
    id: s.id,
    name: `${s.firstName} ${s.lastName}`,
    admissionNumber: s.admissionNumber
  }));
}

export async function assignStudent(studentId: string, routeId: string, pickupPoint: string, tripType: "TWO_WAY" | "ONE_WAY_MORNING" | "ONE_WAY_EVENING") {
  await prisma.transportAssignment.create({
    data: {
      studentId,
      routeId,
      pickupPoint,
      tripType
    }
  });
  revalidatePath('/dashboard/operations/transport');
}
