import { getAllocationPageData } from "@/app/actions/allocations";
import AllocationClient from "./AllocationClient";

export default async function AllocationPage() {
  const data = await getAllocationPageData();
  return <AllocationClient {...data} />;
}