import React from "react";
import DailyAttendanceClient from "./DailyAttendanceClient";
import { getDailyAttendance } from "@/app/actions/studentLife";

export default async function DailyAttendanceTab(
  props: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const searchParams = await props.searchParams;
  const dateStr = searchParams?.date as string | undefined;
  const streamId = searchParams?.streamId as string | undefined;

  const result = await getDailyAttendance(dateStr, streamId);

  if (!result.success || !result.data) {
    return (
      <div className="p-6">
        <div className="bg-rose-50 border border-rose-200 text-rose-600 p-4 rounded-xl font-bold">
          Error loading attendance: {result.error || "Unknown error"}
        </div>
      </div>
    );
  }

  return <DailyAttendanceClient initialData={result.data} />;
}
