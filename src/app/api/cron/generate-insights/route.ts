import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY is not set.");
}
const genAI = new GoogleGenerativeAI(apiKey!);

export async function GET(request: Request) {
  try {
    const tenants = await prisma.tenant.findMany();
    
    for (const tenant of tenants) {
      console.log(`Generating AI Daily Brief for tenant ${tenant.name}...`);
      
      const studentCount = await prisma.student.count({ where: { tenantId: tenant.id } });
      const staffCount = await prisma.user.count({ 
        where: { tenantUsers: { some: { tenantId: tenant.id } } }
      });
      const activeTerm = await prisma.term.findFirst({
        where: { tenantId: tenant.id, isActive: true }
      });
      
      const systemState = `
      Tenant: ${tenant.name}
      Current Date: ${new Date().toDateString()}
      Total Students: ${studentCount}
      Total Staff: ${staffCount}
      Active Term: ${activeTerm?.name || "None"}
      `;
      
      const prompt = `You are the MyShule AI Analyst. 
      Generate a "Morning Brief" for the principal of ${tenant.name}.
      The brief should be in professional markdown format.
      Include these sections:
      - Quick Summary
      - Key Metrics
      - Suggested Actions (make 2 reasonable suggestions based on generic school management best practices)
      
      Here is the current system state:
      ${systemState}
      `;
      
      const model = genAI.getGenerativeModel({
        model: "gemini-3.7-flash",
      });
      
      const result = await model.generateContent(prompt);
      const briefContent = result.response.text();
      
      await prisma.aiDailyBrief.create({
        data: {
          tenantId: tenant.id,
          content: briefContent,
        }
      });
      
      console.log(`Successfully generated brief for ${tenant.name}.`);
    }
    
    return NextResponse.json({ success: true, message: "Generated insights for all tenants." });
  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}