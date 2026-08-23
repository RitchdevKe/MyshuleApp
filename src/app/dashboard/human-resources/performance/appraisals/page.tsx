import React, { Suspense } from "react";
import { AppraisalsClient } from "./client";
import { getAppraisals, getStaff } from "./actions";

export default async function AppraisalsPage() {
  const [appraisals, staffMembers] = await Promise.all([
    getAppraisals(),
    getStaff(),
  ]);

  return (
    <Suspense fallback={
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-900"></div>
      </div>
    }>
      <AppraisalsClient initialAppraisals={appraisals} staffMembers={staffMembers} />
    </Suspense>
  );
}
