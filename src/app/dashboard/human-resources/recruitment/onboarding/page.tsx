import React from "react";
import OnboardingClient from "./OnboardingClient";
import { getOnboardings } from "./actions";

export default async function OnboardingPage() {
  const onboardings = await getOnboardings();
  
  // Format dates and ensure steps are typed for the client
  const serialized = onboardings.map(o => ({
    ...o,
    startDate: o.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    steps: typeof o.steps === 'string' ? JSON.parse(o.steps) : o.steps,
  }));

  return <OnboardingClient initialHires={serialized as any} />;
}
