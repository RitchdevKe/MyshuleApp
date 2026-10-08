"use server";

import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export interface OperationalResourcesData {
  facilities: {
    total: number;
    active: number;
    inMaintenance: number;
    inactive: number;
    totalCapacity: number;
    byType: Record<string, number>;
    list: Array<{
      id: string;
      name: string;
      type: string;
      capacity: number;
      location: string;
      status: string;
      assetCount: number;
    }>;
  };
  assets: {
    total: number;
    active: number;
    inMaintenance: number;
    retired: number;
    lost: number;
    totalCost: number;
    byCondition: {
      good: number;
      fair: number;
      poor: number;
      critical: number;
    };
    byCategory: Record<string, number>;
    list: Array<{
      id: string;
      assetTag: string;
      name: string;
      category: string;
      status: string;
      condition: string;
      purchaseCost: number;
      facilityName: string;
    }>;
  };
  library: {
    totalTitles: number;
    totalCopies: number;
    availableCopies: number;
    activeLoans: number;
    overdueLoans: number;
    totalMembers: number;
    utilizationRate: number;
    byCategory: Record<string, number>;
    list: Array<{
      id: string;
      title: string;
      author: string;
      category: string;
      copies: number;
      status: string;
      activeLoansCount: number;
    }>;
  };
  transport: {
    totalRoutes: number;
    totalVehicles: number;
    totalCapacity: number;
    totalEnrolled: number;
    utilizationRate: number;
    list: Array<{
      id: string;
      routeName: string;
      vehiclePlate: string;
      driverName: string;
      enrolledCount: number;
      costPerTerm: number;
    }>;
  };
  hostels: {
    totalHostels: number;
    totalRooms: number;
    totalBeds: number;
    occupiedBeds: number;
    availableBeds: number;
    occupancyRate: number;
    list: Array<{
      id: string;
      name: string;
      type: string;
      capacity: number;
      roomCount: number;
      occupied: number;
      status: string;
    }>;
  };
}

const emptyResourcesData: OperationalResourcesData = {
  facilities: {
    total: 0,
    active: 0,
    inMaintenance: 0,
    inactive: 0,
    totalCapacity: 0,
    byType: {},
    list: [],
  },
  assets: {
    total: 0,
    active: 0,
    inMaintenance: 0,
    retired: 0,
    lost: 0,
    totalCost: 0,
    byCondition: { good: 0, fair: 0, poor: 0, critical: 0 },
    byCategory: {},
    list: [],
  },
  library: {
    totalTitles: 0,
    totalCopies: 0,
    availableCopies: 0,
    activeLoans: 0,
    overdueLoans: 0,
    totalMembers: 0,
    utilizationRate: 0,
    byCategory: {},
    list: [],
  },
  transport: {
    totalRoutes: 0,
    totalVehicles: 0,
    totalCapacity: 0,
    totalEnrolled: 0,
    utilizationRate: 0,
    list: [],
  },
  hostels: {
    totalHostels: 0,
    totalRooms: 0,
    totalBeds: 0,
    occupiedBeds: 0,
    availableBeds: 0,
    occupancyRate: 0,
    list: [],
  },
};

export async function getOperationalResourcesData(
  searchParams?: { [key: string]: string | string[] | undefined }
): Promise<OperationalResourcesData> {
  try {
    const session = await getSession();
    const tenantId = session?.tenantId || (await prisma.tenant.findFirst())?.id;

    // Build the filter
    const tenantFilter: any = tenantId ? { tenantId } : {};

    // Example of using global filters if models supported them:
    // const branchId = searchParams?.branchId as string | undefined;
    // if (branchId) {
    //   tenantFilter.branchId = branchId;
    // }

    const [
      facilities,
      assets,
      libraryBooks,
      activeCirculationsCount,
      overdueCirculationsCount,
      libraryMembersCount,
      transportRoutes,
      vehicles,
      hostels,
    ] = await Promise.all([
      prisma.facility.findMany({
        where: tenantFilter,
        include: {
          assets: {
            select: { id: true },
          },
        },
        orderBy: { name: "asc" },
      }),
      prisma.asset.findMany({
        where: tenantFilter,
        include: {
          facility: {
            select: { name: true },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.libraryBook.findMany({
        where: tenantFilter,
        include: {
          circulations: {
            where: {
              status: { in: ["ISSUED", "OVERDUE"] },
            },
            select: { id: true },
          },
        },
        orderBy: { title: "asc" },
      }),
      prisma.libraryCirculation.count({
        where: {
          ...tenantFilter,
          status: "ISSUED",
        },
      }),
      prisma.libraryCirculation.count({
        where: {
          ...tenantFilter,
          status: "OVERDUE",
        },
      }),
      prisma.libraryMember.count({
        where: {
          ...tenantFilter,
          status: "ACTIVE",
        },
      }),
      prisma.transportRoute.findMany({
        where: tenantFilter,
        include: {
          driver: {
            select: { firstName: true, lastName: true },
          },
          assignments: {
            select: { id: true },
          },
        },
        orderBy: { routeName: "asc" },
      }),
      prisma.vehicle.findMany({
        where: tenantFilter,
      }),
      prisma.hostel.findMany({
        where: tenantFilter,
        include: {
          rooms: {
            select: { id: true, capacity: true },
          },
          allocations: {
            where: { status: "ACTIVE" },
            select: { id: true },
          },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    // Process Facilities
    let activeFacilities = 0;
    let maintFacilities = 0;
    let inactiveFacilities = 0;
    let totalFacilityCapacity = 0;
    const facilityTypes: Record<string, number> = {};

    const facilityList = facilities.map((f) => {
      const statusUpper = (f.status || "ACTIVE").toUpperCase();
      if (statusUpper === "ACTIVE") activeFacilities++;
      else if (statusUpper === "MAINTENANCE") maintFacilities++;
      else inactiveFacilities++;

      const cap = f.capacity || 0;
      totalFacilityCapacity += cap;

      const fType = f.type || "Other";
      facilityTypes[fType] = (facilityTypes[fType] || 0) + 1;

      return {
        id: f.id,
        name: f.name,
        type: f.type || "General",
        capacity: cap,
        location: f.location || "Main Campus",
        status: f.status || "ACTIVE",
        assetCount: f.assets.length,
      };
    });

    // Process Assets
    let activeAssets = 0;
    let maintAssets = 0;
    let retiredAssets = 0;
    let lostAssets = 0;
    let totalAssetCost = 0;
    const conditionCount = { good: 0, fair: 0, poor: 0, critical: 0 };
    const assetCategories: Record<string, number> = {};

    const assetList = assets.map((a) => {
      const statusUpper = (a.status || "ACTIVE").toUpperCase();
      if (statusUpper === "ACTIVE") activeAssets++;
      else if (statusUpper === "MAINTENANCE") maintAssets++;
      else if (statusUpper === "RETIRED") retiredAssets++;
      else if (statusUpper === "LOST") lostAssets++;

      totalAssetCost += a.purchaseCost || 0;

      const condUpper = (a.condition || "GOOD").toUpperCase();
      if (condUpper === "GOOD") conditionCount.good++;
      else if (condUpper === "FAIR") conditionCount.fair++;
      else if (condUpper === "POOR") conditionCount.poor++;
      else if (condUpper === "CRITICAL") conditionCount.critical++;
      else conditionCount.good++;

      const cat = a.category || "General";
      assetCategories[cat] = (assetCategories[cat] || 0) + 1;

      return {
        id: a.id,
        assetTag: a.assetTag,
        name: a.name,
        category: a.category,
        status: a.status,
        condition: a.condition,
        purchaseCost: a.purchaseCost || 0,
        facilityName: a.facility?.name || "Unassigned",
      };
    });

    // Process Library Books
    let totalCopies = 0;
    const bookCategories: Record<string, number> = {};

    const bookList = libraryBooks.map((b) => {
      totalCopies += b.copies || 0;
      const cat = b.category || "General";
      bookCategories[cat] = (bookCategories[cat] || 0) + (b.copies || 1);

      return {
        id: b.id,
        title: b.title,
        author: b.author,
        category: b.category || "General",
        copies: b.copies,
        status: b.status,
        activeLoansCount: b.circulations.length,
      };
    });

    const totalActiveLoans = activeCirculationsCount + overdueCirculationsCount;
    const availableCopies = Math.max(0, totalCopies - totalActiveLoans);
    const libraryUtilization = totalCopies > 0 ? Math.min(100, Math.round((totalActiveLoans / totalCopies) * 100)) : 0;

    // Process Transport
    let totalTransportCapacity = 0;
    vehicles.forEach((v) => {
      totalTransportCapacity += v.capacity || 0;
    });

    let totalEnrolledTransport = 0;
    const routeList = transportRoutes.map((r) => {
      const enrolled = r.assignments.length;
      totalEnrolledTransport += enrolled;
      const driverName = r.driver ? `${r.driver.firstName} ${r.driver.lastName}`.trim() : "Not Assigned";

      return {
        id: r.id,
        routeName: r.routeName,
        vehiclePlate: r.vehiclePlate || "N/A",
        driverName: driverName || "Not Assigned",
        enrolledCount: enrolled,
        costPerTerm: r.costPerTerm || 0,
      };
    });

    const transportUtilization =
      totalTransportCapacity > 0
        ? Math.min(100, Math.round((totalEnrolledTransport / totalTransportCapacity) * 100))
        : routeList.length > 0
        ? Math.min(100, Math.round((totalEnrolledTransport / (routeList.length * 40)) * 100))
        : 0;

    // Process Hostels
    let totalRooms = 0;
    let totalBeds = 0;
    let totalOccupiedBeds = 0;

    const hostelList = hostels.map((h) => {
      totalRooms += h.rooms.length;
      const roomBedSum = h.rooms.reduce((acc, rm) => acc + (rm.capacity || 0), 0);
      const hostelBedCap = roomBedSum > 0 ? roomBedSum : h.capacity || 0;
      totalBeds += hostelBedCap;

      const occupied = h.allocations.length;
      totalOccupiedBeds += occupied;

      return {
        id: h.id,
        name: h.name,
        type: h.type,
        capacity: hostelBedCap,
        roomCount: h.rooms.length,
        occupied,
        status: h.status,
      };
    });

    const availableBeds = Math.max(0, totalBeds - totalOccupiedBeds);
    const hostelOccupancyRate = totalBeds > 0 ? Math.min(100, Math.round((totalOccupiedBeds / totalBeds) * 100)) : 0;

    return {
      facilities: {
        total: facilities.length,
        active: activeFacilities,
        inMaintenance: maintFacilities,
        inactive: inactiveFacilities,
        totalCapacity: totalFacilityCapacity,
        byType: facilityTypes,
        list: facilityList,
      },
      assets: {
        total: assets.length,
        active: activeAssets,
        inMaintenance: maintAssets,
        retired: retiredAssets,
        lost: lostAssets,
        totalCost: totalAssetCost,
        byCondition: conditionCount,
        byCategory: assetCategories,
        list: assetList,
      },
      library: {
        totalTitles: libraryBooks.length,
        totalCopies,
        availableCopies,
        activeLoans: activeCirculationsCount,
        overdueLoans: overdueCirculationsCount,
        totalMembers: libraryMembersCount,
        utilizationRate: libraryUtilization,
        byCategory: bookCategories,
        list: bookList,
      },
      transport: {
        totalRoutes: transportRoutes.length,
        totalVehicles: vehicles.length,
        totalCapacity: totalTransportCapacity,
        totalEnrolled: totalEnrolledTransport,
        utilizationRate: transportUtilization,
        list: routeList,
      },
      hostels: {
        totalHostels: hostels.length,
        totalRooms,
        totalBeds,
        occupiedBeds: totalOccupiedBeds,
        availableBeds,
        occupancyRate: hostelOccupancyRate,
        list: hostelList,
      },
    };
  } catch (error) {
    console.error("Error fetching operational resources data:", error);
    return emptyResourcesData;
  }
}
