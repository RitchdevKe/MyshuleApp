"use server";

import prisma from "@/lib/prisma";

export interface MaintenanceRecordItem {
  id: string;
  assetName: string;
  assetTag: string;
  category: string;
  type: string; // PREVENTIVE, CORRECTIVE
  description: string;
  cost: number;
  date: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | string;
  performedBy: string | null;
  facilityName?: string | null;
  condition?: string;
}

export interface VehicleItem {
  id: string;
  registrationNumber: string;
  make: string | null;
  model: string | null;
  capacity: number;
  status: "ACTIVE" | "MAINTENANCE" | "INACTIVE" | string;
  driverName: string | null;
  driverEmployeeNo: string | null;
  tripsCount: number;
  fuelRecordsCount: number;
  totalFuelCost: number;
  totalFuelLiters: number;
}

export interface TransportRouteItem {
  id: string;
  routeName: string;
  driverName: string | null;
  driverEmployeeNo: string | null;
  vehiclePlate: string | null;
  costPerTerm: number | null;
  studentCount: number;
  capacity: number;
  tripsCount: number;
  status: "ACTIVE" | "INACTIVE" | "MAINTENANCE" | string;
  utilizationPercent: number;
}

export interface WorkOrderItem {
  id: string;
  orderNumber: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT" | string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED" | string;
  assignedTo: string | null;
  facilityName: string | null;
  assetName: string | null;
  dueDate: string | null;
  createdAt: string;
}

export interface OperationalData {
  metrics: {
    totalVehicles: number;
    activeVehicles: number;
    vehiclesInMaintenance: number;
    inactiveVehicles: number;
    fleetTotalCapacity: number;
    totalRoutes: number;
    activeRoutesCount: number;
    totalStudentsTransported: number;
    avgRouteUtilization: number;
    totalMaintenanceTasks: number;
    pendingMaintenanceTasksCount: number;
    completedMaintenanceTasksCount: number;
    totalMaintenanceCost: number;
    preventiveCost: number;
    correctiveCost: number;
    openWorkOrdersCount: number;
    slaComplianceRate: number;
  };
  pendingMaintenanceTasks: MaintenanceRecordItem[];
  completedMaintenanceTasks: MaintenanceRecordItem[];
  allMaintenanceRecords: MaintenanceRecordItem[];
  activeRoutes: TransportRouteItem[];
  allRoutes: TransportRouteItem[];
  vehicles: VehicleItem[];
  workOrders: WorkOrderItem[];
  admissionsFunnel: Array<{
    stage: string;
    count: number;
    conversion: number | null;
  }>;
  adminKPIs: Array<{
    task: string;
    avgTime: string;
    target: string;
    status: "optimal" | "suboptimal";
  }>;
}

export interface OperationalFilterOptions {
  branches: Array<{ id: string; name: string }>;
  vehicleStatuses: string[];
  maintenanceStatuses: string[];
  maintenanceTypes: string[];
}

export async function getOperationalFilterOptions(): Promise<OperationalFilterOptions> {
  try {
    const branches = await prisma.branch.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    });

    return {
      branches,
      vehicleStatuses: ["ALL", "ACTIVE", "MAINTENANCE", "INACTIVE"],
      maintenanceStatuses: ["ALL", "SCHEDULED", "IN_PROGRESS", "COMPLETED"],
      maintenanceTypes: ["ALL", "PREVENTIVE", "CORRECTIVE"],
    };
  } catch (error) {
    console.error("Error fetching operational filter options:", error);
    return {
      branches: [],
      vehicleStatuses: ["ALL", "ACTIVE", "MAINTENANCE", "INACTIVE"],
      maintenanceStatuses: ["ALL", "SCHEDULED", "IN_PROGRESS", "COMPLETED"],
      maintenanceTypes: ["ALL", "PREVENTIVE", "CORRECTIVE"],
    };
  }
}

export async function getOperationalReportData(filters?: {
  branchId?: string;
  maintenanceStatus?: string;
  maintenanceType?: string;
  vehicleStatus?: string;
}): Promise<OperationalData> {
  try {
    // 1. Fetch Maintenance Records
    const maintenanceWhere: any = {};
    if (filters?.maintenanceStatus && filters.maintenanceStatus !== "ALL") {
      maintenanceWhere.status = filters.maintenanceStatus;
    }
    if (filters?.maintenanceType && filters.maintenanceType !== "ALL") {
      maintenanceWhere.type = filters.maintenanceType;
    }

    const [maintenanceDb, vehiclesDb, routesDb, workOrdersDb] = await Promise.all([
      prisma.maintenanceRecord.findMany({
        where: maintenanceWhere,
        include: {
          asset: {
            include: {
              facility: true,
            },
          },
        },
        orderBy: { date: "desc" },
      }),
      prisma.vehicle.findMany({
        where:
          filters?.vehicleStatus && filters.vehicleStatus !== "ALL"
            ? { status: filters.vehicleStatus }
            : {},
        include: {
          driver: {
            select: {
              firstName: true,
              lastName: true,
              employeeNumber: true,
            },
          },
          trips: true,
          fuelRecords: true,
        },
        orderBy: { registrationNumber: "asc" },
      }),
      prisma.transportRoute.findMany({
        include: {
          driver: {
            select: {
              firstName: true,
              lastName: true,
              employeeNumber: true,
            },
          },
          assignments: true,
          trips: {
            include: {
              vehicle: true,
            },
          },
        },
        orderBy: { routeName: "asc" },
      }),
      prisma.workOrder.findMany({
        include: {
          asset: true,
          facility: true,
        },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    ]);

    // -------------------------------------------------------------
    // MAP & PROCESS MAINTENANCE RECORDS
    // -------------------------------------------------------------
    let allMaintenanceRecords: MaintenanceRecordItem[] = [];

    if (maintenanceDb.length > 0) {
      allMaintenanceRecords = maintenanceDb.map((m) => ({
        id: m.id,
        assetName: m.asset?.name || "Equipment / Facility",
        assetTag: m.asset?.assetTag || "N/A",
        category: m.asset?.category || "General Asset",
        type: m.type || "PREVENTIVE",
        description: m.description,
        cost: m.cost || 0,
        date: m.date ? m.date.toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
        status: m.status || "COMPLETED",
        performedBy: m.performedBy || "Internal Facilities Team",
        facilityName: m.asset?.facility?.name || null,
        condition: m.asset?.condition || "GOOD",
      }));
    } else {
      allMaintenanceRecords = [];
    }

    const pendingMaintenanceTasks = allMaintenanceRecords.filter(
      (m) => m.status === "SCHEDULED" || m.status === "IN_PROGRESS"
    );
    const completedMaintenanceTasks = allMaintenanceRecords.filter(
      (m) => m.status === "COMPLETED"
    );

    // -------------------------------------------------------------
    // MAP & PROCESS VEHICLES
    // -------------------------------------------------------------
    let vehicles: VehicleItem[] = [];

    if (vehiclesDb.length > 0) {
      vehicles = vehiclesDb.map((v) => {
        const totalFuelCost = v.fuelRecords.reduce((sum, f) => sum + (f.cost || 0), 0);
        const totalFuelLiters = v.fuelRecords.reduce((sum, f) => sum + (f.amount || 0), 0);
        const driverName = v.driver
          ? `${v.driver.firstName} ${v.driver.lastName}`
          : null;

        return {
          id: v.id,
          registrationNumber: v.registrationNumber,
          make: v.make,
          model: v.model,
          capacity: v.capacity,
          status: v.status,
          driverName,
          driverEmployeeNo: v.driver?.employeeNumber || null,
          tripsCount: v.trips.length,
          fuelRecordsCount: v.fuelRecords.length,
          totalFuelCost,
          totalFuelLiters,
        };
      });
    } else {
      vehicles = [];
    }

    // -------------------------------------------------------------
    // MAP & PROCESS TRANSPORT ROUTES
    // -------------------------------------------------------------
    let allRoutes: TransportRouteItem[] = [];

    if (routesDb.length > 0) {
      allRoutes = routesDb.map((r) => {
        const driverName = r.driver
          ? `${r.driver.firstName} ${r.driver.lastName}`
          : null;
        const studentCount = r.assignments.length;

        // Try to match vehicle capacity from plate or vehicle list
        const matchedVeh = vehicles.find(
          (v) => v.registrationNumber.toLowerCase() === (r.vehiclePlate || "").toLowerCase()
        );
        const capacity = matchedVeh?.capacity || 45;
        const tripsCount = r.trips.length;
        const utilizationPercent = capacity > 0 ? Math.min(Math.round((studentCount / capacity) * 100), 100) : 0;
        const isRouteActive = matchedVeh ? matchedVeh.status === "ACTIVE" : true;

        return {
          id: r.id,
          routeName: r.routeName,
          driverName,
          driverEmployeeNo: r.driver?.employeeNumber || null,
          vehiclePlate: r.vehiclePlate || matchedVeh?.registrationNumber || "Unassigned",
          costPerTerm: r.costPerTerm || 0,
          studentCount,
          capacity,
          tripsCount,
          status: isRouteActive ? "ACTIVE" : "MAINTENANCE",
          utilizationPercent,
        };
      });
    } else {
      allRoutes = [];
    }

    const activeRoutes = allRoutes.filter((r) => r.status === "ACTIVE");

    // -------------------------------------------------------------
    // MAP & PROCESS WORK ORDERS
    // -------------------------------------------------------------
    let workOrders: WorkOrderItem[] = [];

    if (workOrdersDb.length > 0) {
      workOrders = workOrdersDb.map((w) => ({
        id: w.id,
        orderNumber: w.orderNumber,
        title: w.title,
        description: w.description,
        priority: w.priority,
        status: w.status,
        assignedTo: w.assignedTo,
        facilityName: w.facility?.name || null,
        assetName: w.asset?.name || null,
        dueDate: w.dueDate ? w.dueDate.toISOString().split("T")[0] : null,
        createdAt: w.createdAt.toISOString().split("T")[0],
      }));
    } else {
      workOrders = [];
    }

    // -------------------------------------------------------------
    // CALCULATE OPERATIONAL KPIS & METRICS
    // -------------------------------------------------------------
    const totalVehicles = vehicles.length;
    const activeVehicles = vehicles.filter((v) => v.status === "ACTIVE").length;
    const vehiclesInMaintenance = vehicles.filter((v) => v.status === "MAINTENANCE").length;
    const inactiveVehicles = vehicles.filter((v) => v.status === "INACTIVE").length;
    const fleetTotalCapacity = vehicles.reduce((sum, v) => sum + (v.capacity || 0), 0);

    const totalRoutes = allRoutes.length;
    const activeRoutesCount = activeRoutes.length;
    const totalStudentsTransported = allRoutes.reduce((sum, r) => sum + r.studentCount, 0);
    const avgRouteUtilization =
      allRoutes.length > 0
        ? Math.round(
            allRoutes.reduce((sum, r) => sum + r.utilizationPercent, 0) / allRoutes.length
          )
        : 0;

    const totalMaintenanceTasks = allMaintenanceRecords.length;
    const pendingMaintenanceTasksCount = pendingMaintenanceTasks.length;
    const completedMaintenanceTasksCount = completedMaintenanceTasks.length;
    const totalMaintenanceCost = allMaintenanceRecords.reduce((sum, m) => sum + (m.cost || 0), 0);

    const preventiveRecords = allMaintenanceRecords.filter((m) => m.type === "PREVENTIVE");
    const correctiveRecords = allMaintenanceRecords.filter((m) => m.type === "CORRECTIVE");
    const preventiveCost = preventiveRecords.reduce((sum, m) => sum + (m.cost || 0), 0);
    const correctiveCost = correctiveRecords.reduce((sum, m) => sum + (m.cost || 0), 0);

    const openWorkOrdersCount = workOrders.filter(
      (w) => w.status === "PENDING" || w.status === "IN_PROGRESS"
    ).length;

    // Admissions Funnel & Admin KPIs
    const admissionsFunnel: any[] = [];
    const adminKPIs: any[] = [];

    return {
      metrics: {
        totalVehicles,
        activeVehicles,
        vehiclesInMaintenance,
        inactiveVehicles,
        fleetTotalCapacity,
        totalRoutes,
        activeRoutesCount,
        totalStudentsTransported,
        avgRouteUtilization,
        totalMaintenanceTasks,
        pendingMaintenanceTasksCount,
        completedMaintenanceTasksCount,
        totalMaintenanceCost,
        preventiveCost,
        correctiveCost,
        openWorkOrdersCount,
        slaComplianceRate: (completedMaintenanceTasksCount + pendingMaintenanceTasksCount) > 0 ? Math.round((completedMaintenanceTasksCount / (completedMaintenanceTasksCount + pendingMaintenanceTasksCount)) * 100) : 100,
      },
      pendingMaintenanceTasks,
      completedMaintenanceTasks,
      allMaintenanceRecords,
      activeRoutes,
      allRoutes,
      vehicles,
      workOrders,
      admissionsFunnel,
      adminKPIs,
    };
  } catch (error) {
    console.error("Error fetching operational report data:", error);
    throw error;
  }
}
