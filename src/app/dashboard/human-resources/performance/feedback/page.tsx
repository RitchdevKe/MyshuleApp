import React from "react";
import { getStaffMembers, getFeedbacks } from "./actions";
import FeedbackClient from "./FeedbackClient";

export default async function FeedbackPage() {
  const staffMembers = await getStaffMembers();
  const feedbacks = await getFeedbacks();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-lg font-black text-slate-800">Continuous Feedback</h2>
           <p className="text-sm font-medium text-slate-500">Peer-to-peer recognition and 360-degree feedback log.</p>
        </div>
      </div>
      <FeedbackClient staffMembers={staffMembers} initialFeedbacks={feedbacks} />
    </div>
  );
}
