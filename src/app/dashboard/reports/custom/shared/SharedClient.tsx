"use client";

import { useState } from "react";
import { revokeShare } from "./actions";
import { format } from "date-fns";
import { useRouter } from "next/navigation";

export default function SharedClient({ initialReports }: { initialReports: any[] }) {
  const [reports, setReports] = useState(initialReports);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const router = useRouter();

  const handleRevoke = async (id: string) => {
    if (confirm("Are you sure you want to revoke this shared report?")) {
      setRevokingId(id);
      try {
        const result = await revokeShare(id);
        if (result.success) {
          setReports((prev) => prev.filter((r) => r.id !== id));
        } else {
          alert(result.error || "Failed to revoke share");
        }
      } finally {
        setRevokingId(null);
      }
    }
  };

  const handleView = (id: string) => {
    router.push(`/dashboard/reports/custom/${id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Shared Reports</h1>
          <p className="text-slate-400 text-sm mt-1">Manage reports you have shared with others.</p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 overflow-hidden backdrop-blur-xl">
        {reports.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            No shared reports found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-sm">
                  <th className="pb-4 font-medium px-4">Name</th>
                  <th className="pb-4 font-medium px-4">Type</th>
                  <th className="pb-4 font-medium px-4">Created At</th>
                  <th className="pb-4 font-medium px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm text-slate-300">
                {reports.map((report) => (
                  <tr key={report.id} className="border-b border-slate-800/50 hover:bg-slate-800/50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="font-medium text-white">{report.name}</div>
                      <div className="text-xs text-slate-500 line-clamp-1 mt-1">{report.description || "No description"}</div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300">
                        {report.type}
                      </span>
                    </td>
                    <td className="py-4 px-4">{format(new Date(report.createdAt), "MMM d, yyyy")}</td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleView(report.id)}
                          className="px-3 py-1.5 bg-primary-900/30 text-primary-400 hover:bg-primary-900/50 rounded-xl transition-colors text-xs font-medium"
                        >
                          View Report
                        </button>
                        <button
                          onClick={() => handleRevoke(report.id)}
                          disabled={revokingId === report.id}
                          className="px-3 py-1.5 bg-red-900/30 text-red-400 hover:bg-red-900/50 rounded-xl transition-colors text-xs font-medium disabled:opacity-50"
                        >
                          {revokingId === report.id ? "Revoking..." : "Revoke Share"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
