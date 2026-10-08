import React from "react";
import { getOverviewData } from "./actions";
import OverviewClient from "./OverviewClient";

export default async function AcademicOverviewTab() {
  const overviewData = await getOverviewData();

  return (
    <OverviewClient initialData={overviewData} />
  );
}
