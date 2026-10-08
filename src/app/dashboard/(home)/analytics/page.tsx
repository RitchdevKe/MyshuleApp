import React from 'react';
import AnalyticsClient from './AnalyticsClient';
import { getAnalyticsData } from './actions';

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const yearId = typeof searchParams.yearId === 'string' ? searchParams.yearId : undefined;
  const termId = typeof searchParams.termId === 'string' ? searchParams.termId : undefined;

  const initialData = await getAnalyticsData(yearId, termId);

  return <AnalyticsClient initialData={initialData} />;
}
