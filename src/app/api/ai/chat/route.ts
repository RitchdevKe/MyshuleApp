import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/prisma";
import { aiTools, AIContext } from "@/lib/ai/tools";
import { getSession } from "@/lib/auth";

// 🌟 Strong school-context system prompt 🌟
const SYSTEM_PROMPT = `You are MyShule, an intelligent AI assistant built into a school management system called MyShule App.
You help school administrators, teachers, and staff with day-to-day school operations.

YOUR DOMAIN KNOWLEDGE:
- Fees / Fee balance: Money owed by students for tuition, transport, meals, etc.
- Attendance: Daily student check-ins and absences.
- Students: Enrolled learners with admission numbers, classes, and guardians.
- Staff / Teachers: School employees with roles, departments, and schedules.
- Grades / Marks: Academic performance in exams and assessments.
- Terms: Academic periods (Term 1, Term 2, Term 3).
- Classes / Streams: Grade levels and their sub-divisions (e.g., Grade 4 East).
- Invoices: Bills sent to parents for fees.

SPEECH CORRECTION: Users often speak to you via voice. The speech-to-text engine may 
mishear school words. Always interpret in school context:
  - "face" or "faze" almost certainly means "fees"
  - "balanced" likely means "balance"
  - "attendants" likely means "attendance"
  - "grace" or "gray" likely means "grades"
  - "stew dent" means "student"
  - "in voice" means "invoice"
  - "my shoe" or "my school" means "MyShule"

RULES:
1. Always respond in the context of a Kenyan school management system.
2. Be concise and helpful. Use bullet points for lists.
3. If you don't know something, say so honestly.
4. Never expose internal IDs, database queries, or technical details to the user.
5. If a user asks about fees, attendance, or students, try to use available tools to fetch real data.
6. Always greet back warmly when the user says "Hi MyShule".`;

export async function POST(req: NextRequest) {
  try {
    // 1. Authenticate via session cookie
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Please log in first." }, { status: 401 });
    }

    const tenantId = session.tenantId;
    const userId = session.userId;

    // Look up user details for context injection
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenantUsers: {
          where: { tenantId },
          include: { role: true, tenant: true },
        },
        staff: {
          where: { tenantId },
          take: 1,
        }
      },
    });

    if (!user || user.tenantUsers.length === 0) {
      return NextResponse.json({ error: "User not found or not part of this tenant" }, { status: 401 });
    }

    const roleName = user.tenantUsers[0].role.name;
    const tenantName = user.tenantUsers[0].tenant.name;
    
    // Extract name (users might be staff, parents, or students. We check staff for now, fallback to email)
    const firstName = user.staff?.[0]?.firstName || user.email.split("@")[0];
    const lastName = user.staff?.[0]?.lastName || "";

    const { prompt, history } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // 2. Setup Gemini
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured" }, { status: 500 });
    }

    // 3. Build function declarations for tools
    const functionDeclarations = Object.values(aiTools).map((tool) => ({
      name: tool.name,
      description: tool.description,
      parameters: {
        type: "OBJECT" as const,
        properties: {
          ...(tool.name === "search_students"
            ? { query: { type: "STRING" as const, description: "Student name or admission number to search for" } }
            : {}),
          ...(tool.name === "get_fee_balance"
            ? { studentId: { type: "STRING" as const, description: "The internal student ID" } }
            : {}),
          ...(tool.name === "get_today_attendance_summary"
            ? {}
            : {}),
        },
        required:
          tool.name === "search_students"
            ? ["query"]
            : tool.name === "get_fee_balance"
            ? ["studentId"]
            : [],
      },
    }));

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-3.7-flash",
      systemInstruction: SYSTEM_PROMPT,
      tools: functionDeclarations.length > 0 ? [{ functionDeclarations } as any] : undefined,
    });

    // 4. Fetch pre-computed system state
    const [systemState, dailyBrief] = await Promise.all([
      prisma.aiSystemState.findUnique({
        where: { tenantId }
      }),
      prisma.aiDailyBrief.findFirst({
        where: { tenantId },
        orderBy: { date: 'desc' }
      })
    ]);

    // Check FAQ cache for exact or very similar matches
    const faqMatches = await prisma.aiFaqCache.findMany({
      where: { tenantId }
    });
    const matchedFaqs = faqMatches.filter(faq => 
      prompt.toLowerCase().includes(faq.question.toLowerCase()) || 
      faq.question.toLowerCase().includes(prompt.toLowerCase())
    ).map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join("\n\n");

    const systemStats = `
[SYSTEM SHORTCUT DATA]
${systemState ? JSON.stringify(systemState.state, null, 2) : "System state not available yet."}

[LATEST DAILY BRIEF (Generated by AI Agent)]
${dailyBrief ? dailyBrief.content : "No brief available yet for today."}

[PRE-STORED FAQ ANSWERS (Relevant to user's question)]
${matchedFaqs || "No cached answers."}
`;

    const contextPrompt = `Current user: ${firstName} ${lastName} (${roleName}) at ${tenantName}.
${systemStats}

User says: ${prompt}`;

    // 5. Start chat - use try/catch around Gemini calls specifically
    let finalResponse: string;
    let executedTool: string | null = null;

    try {
      // Format history for Gemini (Frontend sends `parts: [{text}]`)
      const formattedHistory = (history || []).map((msg: any) => ({
        role: msg.role === "model" ? "model" : "user",
        parts: msg.parts || [{ text: msg.content || "" }],
      }));

      const chat = model.startChat({
        history: formattedHistory,
        tools: functionDeclarations.length > 0 ? [{ functionDeclarations } as any] : undefined,
      });

      console.log("Starting initial sendMessage...");
      const result = await chat.sendMessage(contextPrompt);
      console.log("Initial sendMessage finished");
      finalResponse = result.response.text();

      // 6. Handle tool/function calls
      const functionCalls = result.response.functionCalls();
      console.log("Function calls detected:", functionCalls?.length || 0);

      if (functionCalls && functionCalls.length > 0) {
        const call = functionCalls[0];
        const tool = aiTools[call.name];

        if (tool) {
          executedTool = tool.name;
          const context: AIContext = { tenantId, userId };

          try {
            console.log(`Executing tool ${tool.name} with args`, call.args);
            const toolResult = await tool.execute(call.args, context);
            console.log(`Tool ${tool.name} returned`, toolResult);

            const currentHistory = await chat.getHistory();
            console.log("Sending generateContent with functionResponse");
            const followup = await model.generateContent({
              contents: [
                ...currentHistory,
                {
                  role: "user",
                  parts: [
                    {
                      functionResponse: {
                        name: call.name,
                        response: { result: toolResult },
                      },
                    },
                  ],
                },
              ],
            });
            console.log("generateContent finished");
            finalResponse = followup.response.text();
          } catch (toolErr: any) {
            console.error("Tool execution error:", toolErr);
            finalResponse = `I tried to look that up but encountered an issue. Could you rephrase your question?`;
          }
        }
      }
    } catch (geminiErr: any) {
      console.error("Gemini API error:", geminiErr);
      
      // Fallback: try a simple generation without function calling using a lighter model
      try {
        const fallbackModel = genAI.getGenerativeModel({
          model: "gemini-3.7-flash",
          systemInstruction: SYSTEM_PROMPT,
        });

        const fallbackResult = await fallbackModel.generateContent(contextPrompt);

        finalResponse = fallbackResult.response.text();
      } catch (fallbackErr: any) {
        console.error("Gemini fallback error:", fallbackErr);
        return NextResponse.json({
          response: "I'm having trouble connecting right now. Please try again in a moment.",
        });
      }
    }

    // 7. Audit logging (non-blocking)
    try {
      await prisma.aIAuditLog.create({
        data: {
          tenantId,
          userId,
          intent: executedTool || "chat",
          prompt,
          response: finalResponse,
          toolUsed: executedTool,
        },
      });
    } catch {
      console.error("Failed to write AI audit log");
    }

    return NextResponse.json({ response: finalResponse });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    return NextResponse.json(
      { error: `Something went wrong: ${error.message}` },
      { status: 500 }
    );
  }
}
