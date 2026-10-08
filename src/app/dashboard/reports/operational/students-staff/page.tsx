import React from "react";
import StudentsStaffClient from "./StudentsStaffClient";
import { getStudentsStaffReportData, getStudentsStaffFilterOptions } from "./actions";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams?: Promise<{
    branchId?: string;
    status?: string;
  }>;
}

export default async function StudentsStaffPage({ searchParams }: PageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const branchId = resolvedSearchParams?.branchId;
  const status = resolvedSearchParams?.status;

  const [initialData, filterOptions] = await Promise.all([
    getStudentsStaffReportData({ branchId, status }),
    getStudentsStaffFilterOptions(),
  ]);

  return <StudentsStaffClient initialData={initialData} filterOptions={filterOptions} />;
}
