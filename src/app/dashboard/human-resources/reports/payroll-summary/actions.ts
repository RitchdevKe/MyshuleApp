"use server";

import prisma from "@/lib/prisma";

export async function getPayrollSummaryData() {
  const payslips = await prisma.payslip.findMany({
    include: {
      staff: true,
      payrollRun: true,
    },
  });

  const totalPayroll = payslips.reduce((acc, curr) => acc + curr.basicPay + curr.allowances, 0);
  const totalAllowances = payslips.reduce((acc, curr) => acc + curr.allowances, 0);
  const totalDeductions = payslips.reduce((acc, curr) => acc + curr.deductions, 0);
  const totalNetPay = payslips.reduce((acc, curr) => acc + curr.netPay, 0);

  const totalEmployees = new Set(payslips.map(p => p.staffId)).size;
  const avgSalary = totalEmployees > 0 ? totalPayroll / totalEmployees : 0;

  const deptStats: Record<string, { totalCost: number; empIds: Set<string> }> = {};

  payslips.forEach((p) => {
    const dept = p.staff.department || 'UNKNOWN';
    if (!deptStats[dept]) {
      deptStats[dept] = { totalCost: 0, empIds: new Set() };
    }
    deptStats[dept].totalCost += (p.basicPay + p.allowances);
    deptStats[dept].empIds.add(p.staffId);
  });

  const departmentCosts = Object.keys(deptStats).map(dept => {
    const cost = deptStats[dept].totalCost;
    const empCount = deptStats[dept].empIds.size;
    const deptAvgSalary = empCount > 0 ? cost / empCount : 0;
    const percent = totalPayroll > 0 ? (cost / totalPayroll) * 100 : 0;
    
    return {
      name: dept,
      cost,
      avgSalary: deptAvgSalary,
      percent,
    };
  }).sort((a, b) => b.cost - a.cost);

  let topCostCenter = { name: "N/A", cost: 0, percent: 0 };
  if (departmentCosts.length > 0) {
    topCostCenter = {
      name: departmentCosts[0].name,
      cost: departmentCosts[0].cost,
      percent: departmentCosts[0].percent
    };
  }

  // Adding colors for UI
  const colors = ["bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-indigo-500", "bg-rose-500", "bg-purple-500", "bg-cyan-500"];
  const formattedDepartmentCosts = departmentCosts.map((dept, idx) => ({
    ...dept,
    color: colors[idx % colors.length]
  }));

  return {
    totalPayroll,
    totalAllowances,
    totalDeductions,
    totalNetPay,
    avgSalary,
    totalEmployees,
    topCostCenter,
    departmentCosts: formattedDepartmentCosts,
  };
}
