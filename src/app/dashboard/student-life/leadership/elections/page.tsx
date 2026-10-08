import ElectionsClient from "./ElectionsClient";
import { getElections } from "../actions";

export default async function ElectionsPage() {
  const elections = await getElections();

  return (
    <ElectionsClient initialElections={elections as any} />
  );
}
