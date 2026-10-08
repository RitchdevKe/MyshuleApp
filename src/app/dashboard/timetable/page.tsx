import React from 'react';
import TimetableClient from './TimetableClient';
import { getTimetableData } from './actions';

export default async function TimetablePage() {
  const initialData = await getTimetableData();
  
  return <TimetableClient initialData={initialData} />;
}
