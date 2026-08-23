import { getParents } from "@/app/actions/parents";
import ParentsClient from "./ParentsClient";

export default async function ParentsDirectoryPage() {
  const result = await getParents();
  const parents = result.success ? result.data : [];

  return <ParentsClient initialParents={parents} />;
}
