import { getDisciplineCases, getDisciplineFormData } from "@/app/actions/studentLife";
import CasesClient from "./CasesClient";

export default async function DisciplineCasesPage() {
  const casesRes = await getDisciplineCases();
  const formDataRes = await getDisciplineFormData();

  return (
    <CasesClient 
      initialCases={(casesRes.data as any) || []} 
      formData={(formDataRes.data as any) || { students: [], staff: [] }}
    />
  );
}
