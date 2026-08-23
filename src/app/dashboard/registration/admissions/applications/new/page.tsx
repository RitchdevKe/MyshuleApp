"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { NewEnrollmentFullPageWizard } from "@/components/NewEnrollmentFullPageWizard";
import { createApplication } from "@/app/actions/applications";

export default function NewApplicationPage() {
  const router = useRouter();

  const handleWizardSubmit = async (payload: any) => {
    const res = await createApplication(payload);
    if (res.success) {
      alert("Application submitted successfully!");
      router.push("/dashboard/registration/admissions/applications");
      router.refresh();
    } else {
      throw new Error(res.error || "Failed to submit application");
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto min-h-screen space-y-6">
      <NewEnrollmentFullPageWizard 
        onClose={() => router.push("/dashboard/registration/admissions/applications")} 
        onSubmit={handleWizardSubmit} 
      />
    </div>
  );
}
