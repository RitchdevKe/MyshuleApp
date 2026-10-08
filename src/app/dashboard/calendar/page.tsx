import React from 'react';
import CalendarClient from './CalendarClient';
import { getCalendarEvents } from './actions';

export default async function CalendarPage() {
  const initialEvents = await getCalendarEvents();
  
  return <CalendarClient initialEvents={initialEvents} />;
}
