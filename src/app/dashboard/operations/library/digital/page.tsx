import { getDigitalResources } from "./actions";
import DigitalLibraryClient from "./DigitalLibraryClient";

export default async function DigitalLibraryPage() {
  const resources = await getDigitalResources();

  // Convert resources to match what the client expects (dates to native Date objects if needed, though they already are from Prisma)
  // Or just pass directly. But we must be careful with Next.js serializing Dates from Server to Client Components.
  // Next.js handles Date objects in Server Actions/Props automatically, but wait, usually we pass plain objects.
  
  return <DigitalLibraryClient initialResources={resources} />;
}
