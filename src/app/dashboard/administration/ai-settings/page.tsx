import React from "react";
import AISettingsClient from "./ai-settings-client";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AISettingsPage() {
  const user = await prisma.user.findFirst({
    where: { role: { name: "SUPER_ADMIN" } },
    include: { tenant: true }
  });

  if (!user) return <div>Unauthorized</div>;

  const logs = await prisma.aIAuditLog.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: "desc" },
    take: 50,
    include: { user: { select: { firstName: true, lastName: true } } }
  });

  const kbDocs = await prisma.aIKnowledgeBase.findMany({
    where: { tenantId: user.tenantId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">AI Agent Configuration</h2>
          <p className="text-muted-foreground">
            Manage permissions, view audit logs, and train the AI knowledge base.
          </p>
        </div>
      </div>
      
      <AISettingsClient initialLogs={logs} initialKb={kbDocs} />
    </div>
  );
}
