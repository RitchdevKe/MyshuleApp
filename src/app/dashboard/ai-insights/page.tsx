import React from 'react';
import AiInsightsClient from './AiInsightsClient';
import { getAiInsights } from './actions';

export default async function AiInsightsPage() {
  const { ALERTS, INTELLIGENCE_SECTIONS } = await getAiInsights();
  
  return <AiInsightsClient initialAlerts={ALERTS} initialSections={INTELLIGENCE_SECTIONS} />;
}
