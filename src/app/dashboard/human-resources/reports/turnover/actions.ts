"use server";

import prisma from "@/lib/prisma";

const DEFAULT_TENANT_ID = "1e8a93ff-1533-4f1a-b337-1473919ff7f2";

async function getTenantId() {
  try {
    const tenant = await prisma.tenant.findFirst();
    return tenant ? tenant.id : DEFAULT_TENANT_ID;
  } catch (e) {
    return DEFAULT_TENANT_ID;
  }
}

export async function getTurnoverData() {
  try {
    const tenantId = await getTenantId();
    
    // Get all staff for the tenant
    const allStaff = await prisma.staff.findMany({
      where: { tenantId },
      select: {
        id: true,
        employeeNumber: true,
        firstName: true,
        lastName: true,
        department: true,
        status: true,
        hireDate: true,
        endDate: true,
      }
    });

    const now = new Date();
    const currentYear = now.getFullYear();

    // Departed staff
    const departedStaff = allStaff.filter(
      s => (s.status === "RESIGNED" || s.status === "TERMINATED") && s.endDate
    );

    // Departed YTD
    const departedYTD = departedStaff.filter(
      s => s.endDate && s.endDate.getFullYear() === currentYear
    );

    // Calculate YTD Turnover Rate
    // Active staff at the beginning of the year
    const staffAtStartOfYear = allStaff.filter(
      s => s.hireDate.getFullYear() < currentYear && 
           (!s.endDate || s.endDate.getFullYear() >= currentYear)
    ).length;

    const currentActiveStaff = allStaff.filter(
      s => s.status === "ACTIVE" || s.status === "ON_LEAVE"
    ).length;

    const averageStaffYTD = (staffAtStartOfYear + currentActiveStaff) / 2 || 1;
    const turnoverRateYTD = (departedYTD.length / averageStaffYTD) * 100;

    // Calculate Average Retention (Tenure of all departed and active staff)
    let totalRetentionMonths = 0;
    allStaff.forEach(s => {
      const end = s.endDate || now;
      const diffTime = Math.abs(end.getTime() - s.hireDate.getTime());
      const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30.44); 
      totalRetentionMonths += diffMonths;
    });
    const avgRetentionYears = allStaff.length > 0 ? (totalRetentionMonths / allStaff.length) / 12 : 0;

    // Net Headcount Change YTD
    const hiredYTD = allStaff.filter(
      s => s.hireDate.getFullYear() === currentYear
    ).length;
    const netHeadcountChange = hiredYTD - departedYTD.length;

    // Reasons for Departure YTD (Based on status)
    const reasons = [
      { reason: "Resignation", count: departedYTD.filter(s => s.status === "RESIGNED").length, percent: 0, color: "bg-rose-500" },
      { reason: "Termination", count: departedYTD.filter(s => s.status === "TERMINATED").length, percent: 0, color: "bg-slate-800" },
    ];
    // filter out zeros
    const activeReasons = reasons.filter(r => r.count > 0);
    const totalReasons = activeReasons.reduce((acc, curr) => acc + curr.count, 0);
    activeReasons.forEach(r => {
      r.percent = totalReasons > 0 ? Math.round((r.count / totalReasons) * 100) : 0;
    });
    
    // Sort reasons by count descending
    activeReasons.sort((a, b) => b.count - a.count);

    // Recent Departures Log
    const recentDepartures = departedStaff
      .sort((a, b) => (b.endDate?.getTime() || 0) - (a.endDate?.getTime() || 0))
      .slice(0, 10)
      .map(s => {
        const tenureMs = (s.endDate?.getTime() || now.getTime()) - s.hireDate.getTime();
        const tenureYrs = (tenureMs / (1000 * 60 * 60 * 24 * 365.25)).toFixed(1);
        return {
          id: s.employeeNumber,
          employee: `${s.firstName} ${s.lastName}`,
          department: s.department,
          reason: s.status === "RESIGNED" ? "Resignation" : "Termination",
          date: s.endDate ? s.endDate.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "-",
          tenure: `${tenureYrs} yrs`
        };
      });

    return {
      success: true,
      data: {
        turnoverRateYTD: turnoverRateYTD.toFixed(1),
        avgRetentionYears: avgRetentionYears.toFixed(1),
        netHeadcountChange: netHeadcountChange > 0 ? `+${netHeadcountChange}` : `${netHeadcountChange}`,
        reasons: activeReasons,
        recentDepartures,
      }
    };

  } catch (error: any) {
    console.error("Error fetching turnover data:", error);
    return { success: false, error: error.message };
  }
}
