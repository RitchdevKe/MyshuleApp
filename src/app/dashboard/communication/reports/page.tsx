import { getMessageTemplates, getCommunicationTriggers, getAnalytics } from "./actions";
import ReportsAutomationClient from "./ReportsClient";

export default async function ReportsAutomationPage() {
  const templates = await getMessageTemplates();
  const triggers = await getCommunicationTriggers();
  const analytics = await getAnalytics();

  return <ReportsAutomationClient initialTemplates={templates} initialTriggers={triggers} analytics={analytics} />;
}
