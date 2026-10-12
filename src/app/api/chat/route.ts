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

const SYSTEM_INSTRUCTION = await readFile(
  path.join(process.cwd(), "src/prompts/website-assistant.md"),
  "utf8",
);

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

    const formattedMessages = messages.map((m: UIMessage) => ({
      role: m.role,
      content: m.parts?.find((p) => p.type === "text")?.text ?? "",
    }));

    const result = streamText({
      model: google("gemini-3.5-flash-lite"),
      system: `${SYSTEM_INSTRUCTION}\n\nRespond in English only.`,
      messages: formattedMessages,
      maxOutputTokens: 500,
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
