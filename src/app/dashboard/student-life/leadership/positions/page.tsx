import PositionsClient from "./PositionsClient";
import { getLeadershipPositions, getStudentsForDropdown, getStaffForDropdown } from "../actions";

export default async function PositionsPage() {
  const positions = await getLeadershipPositions();
  const students = await getStudentsForDropdown();
  const staff = await getStaffForDropdown();

  return (
    <PositionsClient 
      initialPositions={positions as any} 
      students={students as any} 
      staff={staff as any} 
    />
  );
}
