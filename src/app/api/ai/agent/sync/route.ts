import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const tenants = await prisma.tenant.findMany({
      where: { status: "ACTIVE" },
      select: { id: true, name: true }
    });

    for (const tenant of tenants) {
      const tenantId = tenant.id;

      const [
        studentCount, 
        staffCount, 
        parentCount,
        recentIncidents,
        recentAdmissions
      ] = await Promise.all([
        prisma.student.count({ where: { tenantId, status: "ACTIVE" } }),
        prisma.staff.count({ where: { tenantId, status: "ACTIVE" } }),
        prisma.user.count({ where: { tenantUsers: { some: { tenantId, role: { name: "Parent" } } } } }),
        prisma.disciplinaryIncident.count({ 
          where: { tenantId, incidentDate: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } 
        }),
        prisma.admissionApplication.count({
          where: { tenantId, stage: "APPLIED" }
        })
      ]);

      const stateJson = {
        tenantName: tenant.name,
        stats: {
          activeStudents: studentCount,
          activeStaff: staffCount,
          registeredParents: parentCount,
          recentDisciplinaryIncidents: recentIncidents,
          pendingAdmissions: recentAdmissions
        },
        lastUpdated: new Date().toISOString()
      };

      await prisma.aiSystemState.upsert({
        where: { tenantId },
        update: { state: stateJson },
        create: {
          tenantId,
          state: stateJson
        }
      });
    }

    return NextResponse.json({ success: true, message: `Synced ${tenants.length} tenants` });
  } catch (error: any) {
    console.error("AI Sync Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

