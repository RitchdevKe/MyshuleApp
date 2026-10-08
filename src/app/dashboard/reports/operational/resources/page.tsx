import React from "react";
import { getOperationalResourcesData } from "./actions";
import ResourcesClient from "./ResourcesClient";

export const dynamic = "force-dynamic";

export default async function OperationalResourcesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const initialData = await getOperationalResourcesData(searchParams);

  return <ResourcesClient initialData={initialData} />;
}
