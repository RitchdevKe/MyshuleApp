import React from 'react';
import QuickSearchClient from './QuickSearchClient';
import { getQuickSearchStudents } from './actions';

export default async function QuickSearchPage() {
  const initialStudents = await getQuickSearchStudents("all", "");
  
  return <QuickSearchClient initialStudents={initialStudents} />;
}
