import React from "react";
import prisma from "@/lib/prisma";
import LoginClient from "./LoginClient";
import { headers } from "next/headers";

export default async function LoginPage() {
  const headersList = await headers();
  const host = headersList.get("host") || "";
  const domainPrefix = host.split(".")[0];
  
  let tenant = null;
  
  // Try to find tenant by domain prefix first (e.g. "demo.myshule.ke")
  if (domainPrefix && domainPrefix !== "app" && domainPrefix !== "localhost:3000") {
    tenant = await prisma.tenant.findUnique({
      where: { domainPrefix }
    });
  }
  
  // Fallback to first if not found (or if on app.myshule.ke)
  if (!tenant) {
    tenant = await prisma.tenant.findFirst();
  }

  return (
    <LoginClient 
      backgroundUrl={tenant?.loginBackgroundUrl || undefined}
      schoolName={tenant?.loginDisplayName || tenant?.name || undefined}
      showSchoolName={tenant?.showSchoolNameOnLogin ?? true}
    />
  );
}
