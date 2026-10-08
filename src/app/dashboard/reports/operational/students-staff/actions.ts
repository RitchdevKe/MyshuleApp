"use server";

import prisma from "@/lib/prisma";

export interface BranchOption {
  id: string;
  name: string;
  levelTypes?: string[];
  status?: string;
}

export interface StudentsStaffFilterOptions {
  branches: BranchOption[];
}

export interface RatioBenchmark {
  status: "optimal" | "warning" | "alert";
  text: string;
  target: string;
}

export interface DepartmentStaffItem {
  department: string;
  departmentKey: string;
  count: number;
  percent: number;
  activeCount: number;
  onLeaveCount: number;
  roles: { name: string; count: number }[];
}

export interface RoleStaffItem {
  roleName: string;
  count: number;
  percent: number;
  department: string;
  activeCount: number;
}

export interface SectionEnrollmentItem {
  name: string;
  count: number;
  percent: number;
  classCount: number;
  streamCount: number;
  capacity: number;
  utilization: number;
  boys: number;
  girls: number;
}

export interface ClassBreakdownItem {
  id: string;
  className: string;
  branchName: string;
  streamCount: number;
  enrolled: number;
  capacity: number;
  boys: number;
  girls: number;
  utilization: number;
  streams: {
    id: string;
    name: string;
    classTeacherName: string;
    enrolled: number;
    capacity: number;
  }[];
}

export interface StaffListItem {
  id: string;
  employeeNumber: string;
  fullName: string;
  jobTitle: string;
  department: string;
  roleName: string;
  status: string;
  branchName: string;
  hireDate: string;
  assignedClassesCount: number;
}

export interface StudentsStaffReportData {
  summary: {
    totalStudents: number;
    activeStudents: number;
    suspendedStudents: number;
    transferredStudents: number;
    alumniStudents: number;
    totalStaff: number;
    activeStaff: number;
    onLeaveStaff: number;
    teachingStaff: number;
    nonTeachingStaff: number;
    studentTeacherRatio: string;
    studentStaffRatio: string;
    ratioBenchmark: RatioBenchmark;
    genderParityIndex: string;
    totalClasses: number;
    totalStreams: number;
    totalCapacity: number;
    capacityUtilization: string;
  };
  genderDistribution: {
    students: {
      male: number;
      female: number;
      other: number;
      malePercent: number;
      femalePercent: number;
      otherPercent: number;
    };
    staff: {
      male: number;
      female: number;
      unspecified: number;
      malePercent: number;
      femalePercent: number;
    };
  };
  staffByDepartment: DepartmentStaffItem[];
  staffByRole: RoleStaffItem[];
  studentsBySection: SectionEnrollmentItem[];
  classBreakdown: ClassBreakdownItem[];
  staffList: StaffListItem[];
}

export async function getStudentsStaffFilterOptions(): Promise<StudentsStaffFilterOptions> {
  try {
    const branches = await prisma.branch.findMany({
      select: {
        id: true,
        name: true,
        levelTypes: true,
        status: true,
      },
      orderBy: { name: "asc" },
    });

    return {
      branches: branches.map((b) => ({
        id: b.id,
        name: b.name,
        levelTypes: b.levelTypes?.map((l) => String(l)) || [],
        status: b.status,
      })),
    };
  } catch (error) {
    console.error("Error fetching students-staff filter options:", error);
    return { branches: [] };
  }
}

export async function getStudentsStaffReportData(filters?: {
  branchId?: string;
  status?: string;
}): Promise<StudentsStaffReportData> {
  const branchId =
    filters?.branchId && filters.branchId !== "all" && filters.branchId.trim() !== ""
      ? filters.branchId
      : undefined;

  const statusFilter =
    filters?.status && filters.status !== "all" && filters.status.trim() !== ""
      ? filters.status
      : undefined;

  try {
    // 1. Prepare Where Clauses
    const studentWhere: any = {};
    if (branchId) {
      studentWhere.enrollments = {
        some: {
          class: {
            branchId: branchId,
          },
        },
      };
    }
    if (statusFilter) {
      studentWhere.status = statusFilter;
    }

    const staffWhere: any = {};
    if (branchId) {
      staffWhere.OR = [
        { user: { tenantUsers: { some: { branchId } } } },
        { allocations: { some: { stream: { class: { branchId } } } } },
        { streams: { some: { class: { branchId } } } },
      ];
    }

    const classWhere: any = {};
    if (branchId) {
      classWhere.branchId = branchId;
    }

    // 2. Fetch in Parallel for optimal performance
    const [students, staffMembers, classesList] = await Promise.all([
      prisma.student.findMany({
        where: studentWhere,
        select: {
          id: true,
          gender: true,
          status: true,
          enrollments: {
            select: {
              classId: true,
              streamId: true,
              class: {
                select: {
                  id: true,
                  name: true,
                  branchId: true,
                },
              },
            },
          },
        },
      }),
      prisma.staff.findMany({
        where: staffWhere,
        select: {
          id: true,
          employeeNumber: true,
          firstName: true,
          lastName: true,
          jobTitle: true,
          department: true,
          gender: true,
          status: true,
          hireDate: true,
          user: {
            select: {
              tenantUsers: {
                select: {
                  branchId: true,
                  branch: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                  role: {
                    select: {
                      id: true,
                      name: true,
                    },
                  },
                },
              },
            },
          },
          allocations: {
            select: {
              id: true,
              stream: {
                select: {
                  id: true,
                  name: true,
                  class: {
                    select: {
                      id: true,
                      name: true,
                      branchId: true,
                    },
                  },
                },
              },
            },
          },
          streams: {
            select: {
              id: true,
              name: true,
              class: {
                select: {
                  id: true,
                  name: true,
                  branchId: true,
                },
              },
            },
          },
        },
        orderBy: { firstName: "asc" },
      }),
      prisma.class.findMany({
        where: classWhere,
        select: {
          id: true,
          name: true,
          branchId: true,
          branch: {
            select: {
              id: true,
              name: true,
            },
          },
          streams: {
            select: {
              id: true,
              name: true,
              capacity: true,
              classTeacher: {
                select: {
                  firstName: true,
                  lastName: true,
                },
              },
              _count: {
                select: {
                  enrollments: true,
                },
              },
            },
          },
          enrollments: {
            select: {
              student: {
                select: {
                  id: true,
                  gender: true,
                  status: true,
                },
              },
            },
          },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    // 3. Process Student Demographics
    const totalStudents = students.length;
    const activeStudents = students.filter((s) => s.status === "ACTIVE").length;
    const suspendedStudents = students.filter((s) => s.status === "SUSPENDED").length;
    const transferredStudents = students.filter((s) => s.status === "TRANSFERRED").length;
    const alumniStudents = students.filter((s) => s.status === "ALUMNI").length;

    const maleStudents = students.filter((s) => s.gender === "MALE").length;
    const femaleStudents = students.filter((s) => s.gender === "FEMALE").length;
    const otherStudents = students.filter((s) => s.gender === "OTHER").length;

    const studentMalePct = totalStudents > 0 ? Math.round((maleStudents / totalStudents) * 100) : 0;
    const studentFemalePct = totalStudents > 0 ? Math.round((femaleStudents / totalStudents) * 100) : 0;
    const studentOtherPct =
      totalStudents > 0 ? Math.max(0, 100 - (studentMalePct + studentFemalePct)) : 0;

    // Gender Parity Index (Girls to Boys ratio)
    const genderParityIndex =
      maleStudents > 0
        ? (femaleStudents / maleStudents).toFixed(2)
        : femaleStudents > 0
        ? "1.00"
        : "0.00";

    // 4. Process Staff Demographics
    const totalStaff = staffMembers.length;
    const activeStaff = staffMembers.filter((s) => s.status === "ACTIVE").length;
    const onLeaveStaff = staffMembers.filter((s) => s.status === "ON_LEAVE").length;

    // Identify teaching staff
    const isTeacher = (s: (typeof staffMembers)[0]) => {
      const job = (s.jobTitle || "").toLowerCase();
      const userRole = (s.user?.tenantUsers?.[0]?.role?.name || "").toLowerCase();
      return (
        s.department === "ACADEMICS" ||
        job.includes("teacher") ||
        job.includes("educator") ||
        job.includes("instructor") ||
        job.includes("tutor") ||
        job.includes("lecturer") ||
        job.includes("hod") ||
        job.includes("head of department") ||
        job.includes("principal") ||
        job.includes("deputy") ||
        userRole.includes("teacher")
      );
    };

    const teachingStaff = staffMembers.filter((s) => isTeacher(s) && s.status === "ACTIVE").length;
    const nonTeachingStaff = Math.max(0, activeStaff - teachingStaff);

    // Staff Gender
    const maleStaff = staffMembers.filter((s) => {
      const g = (s.gender || "").toUpperCase();
      return g === "MALE" || g === "M";
    }).length;
    const femaleStaff = staffMembers.filter((s) => {
      const g = (s.gender || "").toUpperCase();
      return g === "FEMALE" || g === "F";
    }).length;
    const unspecifiedStaff = totalStaff - (maleStaff + femaleStaff);
    const staffMalePct = totalStaff > 0 ? Math.round((maleStaff / totalStaff) * 100) : 0;
    const staffFemalePct = totalStaff > 0 ? Math.round((femaleStaff / totalStaff) * 100) : 0;

    // 5. Calculate Ratios
    const effectiveStudents = activeStudents > 0 ? activeStudents : totalStudents;
    let studentTeacherRatio = "0.0";
    let ratioNumber = 0;

    if (teachingStaff > 0) {
      ratioNumber = Number((effectiveStudents / teachingStaff).toFixed(1));
      studentTeacherRatio = ratioNumber.toFixed(1);
    } else if (effectiveStudents > 0) {
      studentTeacherRatio = effectiveStudents.toString();
      ratioNumber = effectiveStudents;
    }

    let studentStaffRatio = "0.0";
    if (activeStaff > 0) {
      studentStaffRatio = (effectiveStudents / activeStaff).toFixed(1);
    }

    // Ratio Benchmark Evaluation
    let ratioBenchmark: RatioBenchmark = {
      status: "optimal",
      text: "Optimal range (UNESCO standard <= 25:1)",
      target: "20:1",
    };

    if (ratioNumber === 0 && effectiveStudents > 0) {
      ratioBenchmark = {
        status: "warning",
        text: "No active teachers assigned to students",
        target: "20:1",
      };
    } else if (ratioNumber > 35) {
      ratioBenchmark = {
        status: "alert",
        text: "High teacher workload (Exceeds 35:1 threshold)",
        target: "20:1",
      };
    } else if (ratioNumber > 25) {
      ratioBenchmark = {
        status: "warning",
        text: "Moderate workload (Above 25:1 target)",
        target: "20:1",
      };
    } else if (ratioNumber < 10 && ratioNumber > 0) {
      ratioBenchmark = {
        status: "optimal",
        text: "High personalized attention (<10:1 ratio)",
        target: "20:1",
      };
    }

    // 6. Group Staff by Department
    const deptDisplayMap: Record<string, string> = {
      ACADEMICS: "Academic & Teaching",
      ADMINISTRATION: "Administration & Leadership",
      SUPPORT: "Support & Facilities",
      TRANSPORT: "Transport & Logistics",
      KITCHEN: "Kitchen & Catering",
    };

    const deptMap: Record<
      string,
      {
        count: number;
        activeCount: number;
        onLeaveCount: number;
        rolesMap: Record<string, number>;
      }
    > = {
      ACADEMICS: { count: 0, activeCount: 0, onLeaveCount: 0, rolesMap: {} },
      ADMINISTRATION: { count: 0, activeCount: 0, onLeaveCount: 0, rolesMap: {} },
      SUPPORT: { count: 0, activeCount: 0, onLeaveCount: 0, rolesMap: {} },
      TRANSPORT: { count: 0, activeCount: 0, onLeaveCount: 0, rolesMap: {} },
      KITCHEN: { count: 0, activeCount: 0, onLeaveCount: 0, rolesMap: {} },
    };

    staffMembers.forEach((staff) => {
      const deptKey = (staff.department as string) || "SUPPORT";
      if (!deptMap[deptKey]) {
        deptMap[deptKey] = { count: 0, activeCount: 0, onLeaveCount: 0, rolesMap: {} };
      }
      deptMap[deptKey].count += 1;
      if (staff.status === "ACTIVE") deptMap[deptKey].activeCount += 1;
      if (staff.status === "ON_LEAVE") deptMap[deptKey].onLeaveCount += 1;

      const title = staff.jobTitle?.trim() || "Staff Member";
      deptMap[deptKey].rolesMap[title] = (deptMap[deptKey].rolesMap[title] || 0) + 1;
    });

    const staffByDepartment: DepartmentStaffItem[] = Object.entries(deptMap)
      .map(([key, data]) => {
        const percent = totalStaff > 0 ? Math.round((data.count / totalStaff) * 100) : 0;
        const roles = Object.entries(data.rolesMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        return {
          department: deptDisplayMap[key] || key,
          departmentKey: key,
          count: data.count,
          percent,
          activeCount: data.activeCount,
          onLeaveCount: data.onLeaveCount,
          roles,
        };
      })
      .sort((a, b) => b.count - a.count);

    // 7. Group Staff by Role
    const roleMap: Record<
      string,
      { count: number; department: string; activeCount: number }
    > = {};

    staffMembers.forEach((staff) => {
      const userRole = staff.user?.tenantUsers?.[0]?.role?.name;
      const roleName = staff.jobTitle?.trim() || userRole || "Staff Member";
      const deptName = deptDisplayMap[staff.department as string] || staff.department || "General";

      if (!roleMap[roleName]) {
        roleMap[roleName] = {
          count: 0,
          department: deptName,
          activeCount: 0,
        };
      }
      roleMap[roleName].count += 1;
      if (staff.status === "ACTIVE") {
        roleMap[roleName].activeCount += 1;
      }
    });

    const staffByRole: RoleStaffItem[] = Object.entries(roleMap)
      .map(([roleName, data]) => ({
        roleName,
        count: data.count,
        percent: totalStaff > 0 ? Math.round((data.count / totalStaff) * 100) : 0,
        department: data.department,
        activeCount: data.activeCount,
      }))
      .sort((a, b) => b.count - a.count);

    // 8. Process Classes & Streams & Section Breakdown
    let totalClassesCount = classesList.length;
    let totalStreamsCount = 0;
    let totalCapacityCount = 0;
    let totalEnrolledInClasses = 0;

    // Helper to categorize class name into section
    const getSectionName = (className: string): string => {
      const c = className.toLowerCase();
      if (
        c.includes("playgroup") ||
        c.includes("baby") ||
        c.includes("pp1") ||
        c.includes("pp2") ||
        c.includes("pre-primary") ||
        c.includes("nursery") ||
        c.includes("kindergarten") ||
        c.includes("reception") ||
        c.includes("ecde") ||
        c.includes("daycare")
      ) {
        return "Pre-Primary (Early Years)";
      }
      if (
        c.includes("grade 1") ||
        c.includes("grade 2") ||
        c.includes("grade 3") ||
        c.includes("grade 4") ||
        c.includes("grade 5") ||
        c.includes("grade 6") ||
        c.includes("class 1") ||
        c.includes("class 2") ||
        c.includes("class 3") ||
        c.includes("class 4") ||
        c.includes("class 5") ||
        c.includes("class 6") ||
        c.includes("class 7") ||
        c.includes("class 8") ||
        c.includes("primary")
      ) {
        return "Primary School";
      }
      if (
        c.includes("grade 7") ||
        c.includes("grade 8") ||
        c.includes("grade 9") ||
        c.includes("jss") ||
        c.includes("junior")
      ) {
        return "Junior Secondary (JSS)";
      }
      if (
        c.includes("grade 10") ||
        c.includes("grade 11") ||
        c.includes("grade 12") ||
        c.includes("form 1") ||
        c.includes("form 2") ||
        c.includes("form 3") ||
        c.includes("form 4") ||
        c.includes("senior") ||
        c.includes("high school")
      ) {
        return "Senior School";
      }
      return "General Academic";
    };

    const sectionMap: Record<
      string,
      {
        count: number;
        classCount: number;
        streamCount: number;
        capacity: number;
        boys: number;
        girls: number;
      }
    > = {};

    const classBreakdown: ClassBreakdownItem[] = classesList.map((cls) => {
      const sCount = cls.streams.length;
      totalStreamsCount += sCount;

      let clsCap = 0;
      cls.streams.forEach((st) => {
        clsCap += st.capacity || 0;
      });
      if (clsCap === 0 && sCount > 0) {
        clsCap = sCount * 35; // default capacity per stream if unset
      }
      totalCapacityCount += clsCap;

      const enrolledCount = cls.enrollments.length;
      totalEnrolledInClasses += enrolledCount;

      let boysCount = 0;
      let girlsCount = 0;
      cls.enrollments.forEach((e) => {
        if (e.student?.gender === "MALE") boysCount++;
        else if (e.student?.gender === "FEMALE") girlsCount++;
      });

      const utilization = clsCap > 0 ? Math.min(100, Math.round((enrolledCount / clsCap) * 100)) : 0;

      const secName = getSectionName(cls.name);
      if (!sectionMap[secName]) {
        sectionMap[secName] = {
          count: 0,
          classCount: 0,
          streamCount: 0,
          capacity: 0,
          boys: 0,
          girls: 0,
        };
      }
      sectionMap[secName].count += enrolledCount;
      sectionMap[secName].classCount += 1;
      sectionMap[secName].streamCount += sCount;
      sectionMap[secName].capacity += clsCap;
      sectionMap[secName].boys += boysCount;
      sectionMap[secName].girls += girlsCount;

      return {
        id: cls.id,
        className: cls.name,
        branchName: cls.branch?.name || "Main Campus",
        streamCount: sCount,
        enrolled: enrolledCount,
        capacity: clsCap,
        boys: boysCount,
        girls: girlsCount,
        utilization,
        streams: cls.streams.map((st) => ({
          id: st.id,
          name: st.name,
          classTeacherName: st.classTeacher
            ? `${st.classTeacher.firstName} ${st.classTeacher.lastName}`
            : "Unassigned",
          enrolled: st._count?.enrollments || 0,
          capacity: st.capacity || 35,
        })),
      };
    });

    const studentsBySection: SectionEnrollmentItem[] = Object.entries(sectionMap)
      .map(([name, data]) => {
        const percent =
          totalStudents > 0
            ? Math.round((data.count / totalStudents) * 100)
            : totalEnrolledInClasses > 0
            ? Math.round((data.count / totalEnrolledInClasses) * 100)
            : 0;
        const utilization =
          data.capacity > 0 ? Math.min(100, Math.round((data.count / data.capacity) * 100)) : 0;

        return {
          name,
          count: data.count,
          percent,
          classCount: data.classCount,
          streamCount: data.streamCount,
          capacity: data.capacity,
          utilization,
          boys: data.boys,
          girls: data.girls,
        };
      })
      .sort((a, b) => b.count - a.count);

    const totalCapUtil =
      totalCapacityCount > 0
        ? Math.min(100, Math.round((totalStudents / totalCapacityCount) * 100)).toFixed(0)
        : "0";

    // 9. Staff Directory List
    const staffList: StaffListItem[] = staffMembers.map((s) => {
      const tu = s.user?.tenantUsers?.[0];
      const branchName =
        tu?.branch?.name ||
        s.streams?.[0]?.class?.branchId ||
        s.allocations?.[0]?.stream?.class?.branchId ||
        "All Campuses";

      const assignedClassesCount = (s.streams?.length || 0) + (s.allocations?.length || 0);

      return {
        id: s.id,
        employeeNumber: s.employeeNumber || "N/A",
        fullName: `${s.firstName} ${s.lastName}`.trim(),
        jobTitle: s.jobTitle || "Staff Member",
        department: deptDisplayMap[s.department as string] || s.department || "General",
        roleName: tu?.role?.name || s.jobTitle || "Staff",
        status: s.status || "ACTIVE",
        branchName: typeof branchName === "string" ? branchName : "Main Campus",
        hireDate: s.hireDate ? new Date(s.hireDate).toISOString().split("T")[0] : "N/A",
        assignedClassesCount,
      };
    });

    return {
      summary: {
        totalStudents,
        activeStudents,
        suspendedStudents,
        transferredStudents,
        alumniStudents,
        totalStaff,
        activeStaff,
        onLeaveStaff,
        teachingStaff,
        nonTeachingStaff,
        studentTeacherRatio,
        studentStaffRatio,
        ratioBenchmark,
        genderParityIndex,
        totalClasses: totalClassesCount,
        totalStreams: totalStreamsCount,
        totalCapacity: totalCapacityCount,
        capacityUtilization: totalCapUtil,
      },
      genderDistribution: {
        students: {
          male: maleStudents,
          female: femaleStudents,
          other: otherStudents,
          malePercent: studentMalePct,
          femalePercent: studentFemalePct,
          otherPercent: studentOtherPct,
        },
        staff: {
          male: maleStaff,
          female: femaleStaff,
          unspecified: unspecifiedStaff,
          malePercent: staffMalePct,
          femalePercent: staffFemalePct,
        },
      },
      staffByDepartment,
      staffByRole,
      studentsBySection,
      classBreakdown,
      staffList,
    };
  } catch (error) {
    console.error("Error generating students-staff report data:", error);
    return {
      summary: {
        totalStudents: 0,
        activeStudents: 0,
        suspendedStudents: 0,
        transferredStudents: 0,
        alumniStudents: 0,
        totalStaff: 0,
        activeStaff: 0,
        onLeaveStaff: 0,
        teachingStaff: 0,
        nonTeachingStaff: 0,
        studentTeacherRatio: "0.0",
        studentStaffRatio: "0.0",
        ratioBenchmark: {
          status: "optimal",
          text: "No data available",
          target: "20:1",
        },
        genderParityIndex: "0.00",
        totalClasses: 0,
        totalStreams: 0,
        totalCapacity: 0,
        capacityUtilization: "0",
      },
      genderDistribution: {
        students: {
          male: 0,
          female: 0,
          other: 0,
          malePercent: 0,
          femalePercent: 0,
          otherPercent: 0,
        },
        staff: {
          male: 0,
          female: 0,
          unspecified: 0,
          malePercent: 0,
          femalePercent: 0,
        },
      },
      staffByDepartment: [],
      staffByRole: [],
      studentsBySection: [],
      classBreakdown: [],
      staffList: [],
    };
  }
}
