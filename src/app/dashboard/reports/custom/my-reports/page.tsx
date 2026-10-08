import React from "react";
import { getMyReports } from "./actions";
import MyReportsClient from "./MyReportsClient";

export const metadata = {
  title: "My Reports - Custom Reports",
};

export const dynamic = "force-dynamic";

export default async function MyReportsPage() {
  const reports = await getMyReports();

  return <MyReportsClient reports={reports} />;
}
