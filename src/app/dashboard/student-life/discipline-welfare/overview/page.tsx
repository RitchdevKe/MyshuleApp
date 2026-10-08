import { getDisciplinaryIncidents, getWelfareSessions, getFormData } from "../actions";
import OverviewClient from "./OverviewClient";

export default async function DisciplineWelfareOverviewPage() {
  const [incidentsRes, sessionsRes, formDataRes] = await Promise.all([
    getDisciplinaryIncidents(),
    getWelfareSessions(),
    getFormData()
  ]);

  return (
    <OverviewClient 
      initialIncidents={(incidentsRes.data as any) || []}
      initialSessions={(sessionsRes.data as any) || []}
      formData={(formDataRes.data as any) || { students: [], staff: [] }}
    />
  );
}
