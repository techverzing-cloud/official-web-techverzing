import {
  streamText,
  createUIMessageStreamResponse,
  type UIMessage,
  toUIMessageStream,
} from "ai";
import { google } from "@ai-sdk/google";
import { NextResponse } from "next/server";
import path from "node:path";
import { readFile } from "node:fs/promises";

export const runtime = "nodejs";

const SYSTEM_PROMPT_PATH = path.join(process.cwd(), "src/content/chatbot-system-prompt.md");

async function loadSystemPrompt(): Promise<string> {
  try {
    return await readFile(SYSTEM_PROMPT_PATH, "utf8");
  } catch {
    return "You are Techverzing's website assistant. Help visitors with services, capabilities, and company information.";
  }
}

async function loadCompanyContext(): Promise<string> {
  const contentDir = path.join(process.cwd(), "src/content");
  const files = [
    "site.json",
    "home.json",
    "services.json",
    "services-data.json",
    "contact.json",
    "about.json",
    "services/data.json",
  ];

  const contextParts: string[] = [];

  for (const file of files) {
    try {
      const filePath = path.join(contentDir, file);
      const content = await readFile(filePath, "utf8");
      const parsed = JSON.parse(content);
      const fileKey = file.replace(".json", "").replace("/", ".");
      contextParts.push(`## ${fileKey}\n${JSON.stringify(parsed, null, 2)}`);
    } catch {
    }
  }

  return contextParts.join("\n\n");
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: "Invalid messages format" },
        { status: 400 },
      );
    }

    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY not configured");
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 503 },
      );
    }

    const [systemPrompt, companyContext] = await Promise.all([
      loadSystemPrompt(),
      loadCompanyContext(),
    ]);

    const formattedMessages = messages.map((m: UIMessage) => ({
      role: m.role,
      content: m.parts?.find((p) => p.type === "text")?.text ?? "",
    }));

    const systemMessage = `${systemPrompt}\n\n## Current Website Content (Source of Truth)\n${companyContext}\n\nRespond in the visitor's language. English is default.`;

    const result = streamText({
      model: google("gemini-3.5-flash-lite"),
      system: systemMessage,
      messages: formattedMessages,
      maxOutputTokens: 800,
      temperature: 0.7,
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
      }),
    });
  } catch (error) {
    console.error("Chat API error:", error);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
