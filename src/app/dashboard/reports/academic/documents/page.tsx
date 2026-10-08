import React from "react";
import DocumentsClient from "./components/documents-client";
import { getDocumentTemplates, getRecentDocuments } from "./actions";
import prisma from "@/lib/prisma";

export default async function AcademicDocumentsTab() {
  // Ensure we have at least one tenant for demo purposes
  let tenant = await prisma.tenant.findFirst();
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: "Demo School",
        domainPrefix: "demo",
        status: "ACTIVE"
      }
    });
  }

  // Ensure we have some templates if none exist
  const existingTemplates = await prisma.documentTemplate.count({
    where: { tenantId: tenant.id }
  });

  if (existingTemplates === 0) {
    await prisma.documentTemplate.createMany({
      data: [
        {
          tenantId: tenant.id,
          name: "Report Cards",
          type: "REPORT_CARD",
        },
        {
          tenantId: tenant.id,
          name: "Transcripts",
          type: "TRANSCRIPT",
        },
        {
          tenantId: tenant.id,
          name: "Leaving Certificates",
          type: "LEAVING_CERTIFICATE",
        }
      ]
    });
  }

  // Ensure we have a student for generating docs
  const existingStudent = await prisma.student.count({
    where: { tenantId: tenant.id }
  });

  if (existingStudent === 0) {
    await prisma.student.create({
      data: {
        tenantId: tenant.id,
        admissionNumber: "ADM-001",
        firstName: "John",
        lastName: "Doe",
        dateOfBirth: new Date("2010-01-01"),
        gender: "MALE",
        enrollmentDate: new Date(),
        status: "ACTIVE"
      }
    });
  }

  const templates = await getDocumentTemplates();
  const recentDocuments = await getRecentDocuments();

  return (
    <DocumentsClient 
      templates={templates} 
      recentDocuments={recentDocuments} 
    />
  );
}
