import { getSharedReports } from "./actions";
import SharedClient from "./SharedClient";

export const metadata = {
  title: "Shared Reports | MyShule",
  description: "View and manage shared custom reports",
};

export default async function SharedReportsPage() {
  const result = await getSharedReports();

  if (!result.success) {
    return (
      <div className="p-6">
        <div className="bg-red-900/30 border border-red-800 text-red-400 p-4 rounded-xl">
          Failed to load shared reports: {result.error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <SharedClient initialReports={result.data || []} />
    </div>
  );
}
