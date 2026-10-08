"use server";

import prisma from "@/lib/prisma";

export async function getHeadcountData() {
  const allStaff = await prisma.staff.findMany({
    select: {
      status: true,
      gender: true,
      hireDate: true,
      dateOfBirth: true,
      department: true,
    }
  });

  const activeStaff = allStaff.filter(s => s.status === 'ACTIVE');
  const totalEmployees = activeStaff.length;
  
  const maleCount = activeStaff.filter(s => s.gender?.toLowerCase() === 'male' || s.gender?.toLowerCase() === 'm').length;
  const femaleCount = activeStaff.filter(s => s.gender?.toLowerCase() === 'female' || s.gender?.toLowerCase() === 'f').length;
  
  const now = new Date();
  
  // Avg Tenure
  const totalTenureYears = activeStaff.reduce((sum, s) => {
    if (!s.hireDate) return sum;
    const diffTime = now.getTime() - s.hireDate.getTime();
    if (diffTime < 0) return sum;
    const diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    return sum + diffYears;
  }, 0);
  const avgTenure = activeStaff.length ? (totalTenureYears / activeStaff.length).toFixed(1) : "0.0";

  // New Hires YTD
  const currentYear = now.getFullYear();
  const newHiresYTD = activeStaff.filter(s => s.hireDate && s.hireDate.getFullYear() === currentYear).length;

  // Department Breakdown
  const deptCounts: Record<string, number> = {};
  activeStaff.forEach(s => {
    const dept = s.department || 'Unknown';
    deptCounts[dept] = (deptCounts[dept] || 0) + 1;
  });
  
  const deptMap: Record<string, string> = {
    'ACADEMICS': 'Academic Staff',
    'ADMINISTRATION': 'Administration',
    'TRANSPORT': 'Transport',
    'KITCHEN': 'Kitchen',
    'SUPPORT': 'Support & Maintenance',
  };

  const departments = Object.keys(deptCounts).map(d => ({
    name: deptMap[d] || d,
    count: deptCounts[d],
    percent: totalEmployees > 0 ? Math.round((deptCounts[d] / totalEmployees) * 100) : 0,
    color: getColorForDept(d),
  })).sort((a, b) => b.count - a.count);

  // Age Distribution
  const ageGroups = [
    { range: "18-25", count: 0, min: 18, max: 25 },
    { range: "26-35", count: 0, min: 26, max: 35 },
    { range: "36-45", count: 0, min: 36, max: 45 },
    { range: "46-55", count: 0, min: 46, max: 55 },
    { range: "56+", count: 0, min: 56, max: 999 }
  ];

  activeStaff.forEach(s => {
    if (!s.dateOfBirth) return;
    const diffTime = now.getTime() - s.dateOfBirth.getTime();
    if (diffTime < 0) return;
    const age = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    for (const group of ageGroups) {
      if (age >= group.min && age <= group.max) {
        group.count++;
        break;
      }
    }
  });

  const maxAgeCount = Math.max(...ageGroups.map(g => g.count), 1);
  const ageDistribution = ageGroups.map(({ range, count }) => ({
    range,
    count,
    heightPercent: Math.round((count / maxAgeCount) * 100),
  }));

  return {
    totalEmployees,
    maleCount,
    femaleCount,
    avgTenure,
    newHiresYTD,
    departments,
    ageDistribution,
  };
}

function getColorForDept(dept: string) {
  const map: Record<string, string> = {
    'ACADEMICS': 'bg-blue-500',
    'ADMINISTRATION': 'bg-emerald-500',
    'TRANSPORT': 'bg-amber-500',
    'KITCHEN': 'bg-rose-500',
    'SUPPORT': 'bg-indigo-500',
  };
  return map[dept] || 'bg-slate-500';
}
