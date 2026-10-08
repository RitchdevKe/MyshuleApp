"use server";

import prisma from "@/lib/prisma";

export async function getInventoryOverviewData() {
  const tenantId = "tenant-1"; // Assuming single tenant or we need to pass it, but usually these dashboards are mocked to a specific tenant if not authenticated, or we fetch the first tenant. Let's fetch the first tenant if not provided, or just don't filter by tenant if it's a generic dashboard for now. Wait, schema has tenantId required on everything. Let's get the first tenant.

  const tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    throw new Error("No tenant found");
  }

  // 1. Total Stock Value & Value by Category
  const items = await prisma.inventoryItem.findMany({
    where: { tenantId: tenant.id },
    include: {
      inventoryBalances: true,
    }
  });

  let totalValue = 0;
  const categoryValues: Record<string, number> = {};

  items.forEach(item => {
    const totalQty = item.inventoryBalances.reduce((sum, bal) => sum + bal.quantity, 0);
    const value = totalQty * item.unitCost;
    totalValue += value;

    if (!categoryValues[item.category]) {
      categoryValues[item.category] = 0;
    }
    categoryValues[item.category] += value;
  });

  const categories = Object.entries(categoryValues)
    .sort((a, b) => b[1] - a[1]) // Sort by value desc
    .map(([name, value]) => ({
      name,
      value,
      percent: totalValue > 0 ? Math.round((value / totalValue) * 100) : 0,
    }));

  const colors = ["bg-indigo-500", "bg-emerald-500", "bg-amber-500", "bg-rose-500", "bg-cyan-500", "bg-purple-500"];
  const stockCategories = categories.map((cat, index) => ({
    ...cat,
    formattedValue: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(cat.value),
    color: colors[index % colors.length],
  }));

  // 2. Active SKUs
  const activeSkusCount = items.filter(item => item.status === "ACTIVE").length;

  // 3. Active Stores
  const storesCount = await prisma.store.count({
    where: { tenantId: tenant.id, status: "ACTIVE" }
  });

  // 4. Low Stock Alerts
  const alerts = items
    .map(item => {
      const totalQty = item.inventoryBalances.reduce((sum, bal) => sum + bal.quantity, 0);
      return {
        id: item.id,
        item: item.name,
        qty: totalQty,
        threshold: item.minStockLevel,
      };
    })
    .filter(item => item.qty <= item.threshold && item.threshold > 0)
    .map(item => ({
      ...item,
      status: item.qty === 0 ? "Out of Stock" : "Low Stock",
      time: "Just now", // In a real app we might look at last movement
    }))
    .sort((a, b) => a.qty - b.qty) // Sort by quantity (0 first)
    .slice(0, 10); // top 10 alerts

  const lowStockAlertsCount = alerts.length;

  // 5. Items Issued YTD
  const currentYear = new Date().getFullYear();
  const startOfYear = new Date(currentYear, 0, 1);
  
  const issuesYtd = await prisma.stockIssue.aggregate({
    where: {
      tenantId: tenant.id,
      date: { gte: startOfYear }
    },
    _sum: {
      quantity: true
    }
  });
  
  const itemsIssuedYtd = issuesYtd._sum.quantity || 0;

  return {
    totalValue,
    formattedTotalValue: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: "compact" }).format(totalValue),
    activeSkusCount,
    storesCount,
    lowStockAlertsCount,
    itemsIssuedYtd,
    stockCategories,
    recentAlerts: alerts,
  };
}
