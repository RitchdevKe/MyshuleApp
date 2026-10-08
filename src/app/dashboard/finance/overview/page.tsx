import React from "react";
import prisma from "@/lib/prisma";
import FinanceOverviewClient from "./FinanceOverviewClient";
import { 
  getSummaryData, 
  getCashflowData, 
  getReceivablesData, 
  getBudgetData, 
  getAccountsData 
} from "./actions";

export default async function FinanceOverviewPage({ searchParams }: { searchParams: { year?: string, term?: string } }) {
  const tenant = await prisma.tenant.findFirst();
  if (!tenant) return <div>No tenant found</div>;

  const year = searchParams.year || "2026";
  const term = searchParams.term || "Term 2";

  const [summaryData, cashflowData, receivablesData, budgetData, accountsData] = await Promise.all([
    getSummaryData(tenant.id, year, term),
    getCashflowData(tenant.id, year, term),
    getReceivablesData(tenant.id, year, term),
    getBudgetData(tenant.id, year, term),
    getAccountsData(tenant.id, year, term),
  ]);

  return (
    <FinanceOverviewClient 
      summaryData={summaryData}
      cashflowData={cashflowData}
      receivablesData={receivablesData}
      budgetData={budgetData}
      accountsData={accountsData}
      initialYear={year}
      initialTerm={term}
    />
  );
}
