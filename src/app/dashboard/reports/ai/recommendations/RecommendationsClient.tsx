"use client";

import { useState, useRef } from "react";
import { generateJobPosting, generateMeetingInvite } from "./actions";

type Recommendation = {
  id: string;
  title: string;
  description: string;
  type: string;
  actionLabel: string;
  overloadedRoutes?: { name: string; count: number }[];
};

export default function RecommendationsClient({
  initialRecommendations,
}: {
  initialRecommendations: Recommendation[];
}) {
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState<{ title: string; content: React.ReactNode } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const handleAction = async (rec: Recommendation) => {
    setLoading(true);
    try {
      if (rec.type === "HIRING") {
        const text = await generateJobPosting();
        setModalContent({
          title: "Draft Job Posting",
          content: <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300">{text}</pre>
        });
        dialogRef.current?.showModal();
      } else if (rec.type === "MEETING") {
        const text = await generateMeetingInvite();
        setModalContent({
          title: "Meeting Invite Draft",
          content: <pre className="whitespace-pre-wrap font-sans text-sm text-slate-300">{text}</pre>
        });
        dialogRef.current?.showModal();
      } else if (rec.type === "TRANSPORT") {
        setModalContent({
          title: "Proposed Transport Routes",
          content: (
            <div className="space-y-4">
              <p className="text-sm text-slate-300">Based on the data, here is the route breakdown:</p>
              <ul className="list-disc pl-5 text-sm text-slate-300">
                {rec.overloadedRoutes?.map((route, i) => (
                  <li key={i}>
                    {route.name}: {route.count} students
                  </li>
                ))}
              </ul>
            </div>
          )
        });
        dialogRef.current?.showModal();
      }
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    dialogRef.current?.close();
    setModalContent(null);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialRecommendations.map((rec) => (
          <div key={rec.id} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 flex flex-col h-full shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2">{rec.title}</h3>
            <p className="text-slate-400 text-sm flex-grow mb-6">{rec.description}</p>
            <button
              onClick={() => handleAction(rec)}
              disabled={loading}
              className="bg-primary-600 hover:bg-primary-500 text-white font-medium py-2 px-4 rounded-xl transition-colors disabled:opacity-50 mt-auto"
            >
              {loading ? "Generating..." : rec.actionLabel}
            </button>
          </div>
        ))}
        {initialRecommendations.length === 0 && (
          <div className="col-span-full p-8 text-center bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl">
             <p className="text-slate-400">No active recommendations at this time.</p>
          </div>
        )}
      </div>

      <dialog
        ref={dialogRef}
        className="bg-slate-900 border border-slate-700 rounded-3xl p-0 backdrop:bg-black/60 backdrop:backdrop-blur-sm max-w-lg w-full shadow-2xl"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-white">{modalContent?.title}</h2>
            <button
              onClick={closeModal}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mb-6 max-h-96 overflow-y-auto">
            {modalContent?.content}
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                alert("Action performed! (Mocked for now)");
                closeModal();
              }}
              className="px-4 py-2 text-sm font-medium bg-primary-600 hover:bg-primary-500 text-white rounded-xl transition-colors"
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
