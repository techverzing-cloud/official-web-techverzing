import { NextResponse } from "next/server";
import { Resend } from "resend";
import { randomUUID } from "node:crypto";
import { buildContactEmail, parseContactMessage } from "./email-template";

export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

const MAX_EMAILS_PER_DAY = 3;
const RATE_LIMIT_WINDOW_MS = 24 * 60 * 60 * 1000;
const MAX_REQUESTS_PER_HOUR_PER_IP = 10;
const IP_RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

const emailSendLog = new Map<string, number[]>();
const ipRequestLog = new Map<string, number[]>();

function cleanupOldEntries() {
  const now = Date.now();
  for (const [email, timestamps] of emailSendLog.entries()) {
    const valid = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      emailSendLog.delete(email);
    } else {
      emailSendLog.set(email, valid);
    }
  }
  for (const [ip, timestamps] of ipRequestLog.entries()) {
    const valid = timestamps.filter((t) => now - t < IP_RATE_LIMIT_WINDOW_MS);
    if (valid.length === 0) {
      ipRequestLog.delete(ip);
    } else {
      ipRequestLog.set(ip, valid);
    }
  }
}

setInterval(cleanupOldEntries, 60 * 60 * 1000);

function checkEmailRateLimit(email: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const timestamps = emailSendLog.get(email.toLowerCase()) ?? [];
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_EMAILS_PER_DAY) {
    const oldest = recent[0];
    const retryAfter = Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  recent.push(now);
  emailSendLog.set(email.toLowerCase(), recent);
  return { allowed: true };
}

function checkIpRateLimit(ip: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const timestamps = ipRequestLog.get(ip) ?? [];
  const recent = timestamps.filter((t) => now - t < IP_RATE_LIMIT_WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_HOUR_PER_IP) {
    const oldest = recent[0];
    const retryAfter = Math.ceil((oldest + IP_RATE_LIMIT_WINDOW_MS - now) / 1000);
    return { allowed: false, retryAfter };
  }

  recent.push(now);
  ipRequestLog.set(ip, recent);
  return { allowed: true };
}

const SPAM_KEYWORDS = [
  "buy now",
  "click here",
  "free money",
  "get rich",
  "make money",
  "viagra",
  "cialis",
  "casino",
  "lottery",
  "winner",
  "congratulations",
  "urgent",
  "act now",
  "limited time",
  "offer expires",
  "100% free",
  "no risk",
  "guaranteed",
  "weight loss",
  "diet pill",
  "crypto",
  "bitcoin",
  "investment",
  "trading",
  "forex",
  "binary options",
  "work from home",
  "earn $",
  "earn money",
  "passive income",
  "financial freedom",
];

function checkSpam(message: string): boolean {
  const lower = message.toLowerCase();
  const spamCount = SPAM_KEYWORDS.filter((kw) => lower.includes(kw)).length;
  const urlCount = (lower.match(/https?:\/\/[^\s]+/g) ?? []).length;
  const capitalRatio = (message.match(/[A-Z]/g) ?? []).length / Math.max(message.length, 1);

  return spamCount >= 2 || urlCount > 2 || capitalRatio > 0.5;
}

type ErrorCode =
  | "INVALID_JSON"
  | "VALIDATION_ERROR"
  | "CONFIG_ERROR"
  | "EMAIL_PROVIDER_ERROR"
  | "INTERNAL_ERROR"
  | "RATE_LIMITED"
  | "SPAM_DETECTED"
  | "BOT_TIMING_FAILED";

interface ApiResponse {
  success: boolean;
  code: "EMAIL_SENT" | ErrorCode;
  message: string;
  requestId: string;
  timestamp: string;
  data: {
    emailId: string | null;
    name: string;
    email: string;
    company: string;
    phone: string;
    service: string;
    message: string;
    rawMessage: string;
  } | null;
  errors: Record<string, string> | null;
}

function respond(
  requestId: string,
  status: number,
  payload: Pick<ApiResponse, "success" | "code" | "message"> &
    Partial<Pick<ApiResponse, "data" | "errors">>,
) {
  const body: ApiResponse = {
    success: payload.success,
    code: payload.code,
    message: payload.message,
    requestId,
    timestamp: new Date().toISOString(),
    data: payload.data ?? null,
    errors: payload.errors ?? null,
  };
  return NextResponse.json(body, { status });
}

function clean(input: unknown): string {
  if (typeof input !== "string") return "";
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}

function validate(
  name: string,
  email: string,
  message: string,
  extras: { company: string; phone: string; service: string },
) {
  const errors: Record<string, string> = {};

  if (!name) errors.name = "Name is required";
  else if (name.length < 2 || name.length > 100)
    errors.name = "Name must be between 2 and 100 characters";

  if (!email) errors.email = "Email is required";
  else if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Invalid email format";

  if (!message) errors.message = "Message is required";
  else if (message.length < 10 || message.length > 5000)
    errors.message = "Message must be between 10 and 5000 characters";

  if (extras.company.length > 200) errors.company = "Company is too long";
  if (extras.phone.length > 50) errors.phone = "Phone is too long";
  if (extras.service.length > 200) errors.service = "Service is too long";

  return Object.keys(errors).length ? errors : null;
}

function logEvent(event: string, data: Record<string, unknown>) {
  console.log(JSON.stringify({ event, timestamp: new Date().toISOString(), ...data }));
}

export async function POST(req: Request) {
  const requestId = randomUUID();
  const clientIp = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  try {
    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      logEvent("contact_invalid_json", { requestId, ip: clientIp });
      return respond(requestId, 400, {
        success: false,
        code: "INVALID_JSON",
        message: "Request body must be valid JSON",
      });
    }

    const name = clean(body?.name);
    const email = clean(body?.email).toLowerCase();
    const rawMessage = clean(body?.message);
    const formLoadTime = Number(body?.formLoadTime) || 0;

    const parsed = parseContactMessage(rawMessage);
    const company = clean(body?.company) || parsed.fields.company || "";
    const phone = clean(body?.phone) || parsed.fields.phone || "";
    const service = clean(body?.service) || parsed.fields.service || "";
    const message = parsed.body;

<<<<<<< HEAD
    const errors = validate(name, email, rawMessage, { company, phone, service }) ?? {};
    if (body?.consent !== true) {
      errors.consent =
        "Consent to the Privacy Policy and Terms & Conditions is required";
    }
    if (Object.keys(errors).length > 0) {
=======
    const errors = validate(name, email, rawMessage, { company, phone, service });
    if (errors) {
      logEvent("contact_validation_error", { requestId, ip: clientIp, email, errors });
>>>>>>> 02709263b9d581e2c392ef9da9742878dc03d81c
      return respond(requestId, 400, {
        success: false,
        code: "VALIDATION_ERROR",
        message: "Please check the highlighted fields",
        errors,
      });
    }

    if (
      !process.env.RESEND_API_KEY ||
      !process.env.EMAIL_FROM ||
      !process.env.EMAIL_TO
    ) {
      console.error(`[contact:${requestId}] Missing email environment variables`);
      return respond(requestId, 500, {
        success: false,
        code: "CONFIG_ERROR",
        message: "Email service is not configured",
      });
    }

    if (formLoadTime > 0 && Date.now() - formLoadTime < 3000) {
      logEvent("contact_bot_timing_failed", { requestId, ip: clientIp, email, loadTime: formLoadTime });
      return respond(requestId, 400, {
        success: false,
        code: "BOT_TIMING_FAILED",
        message: "Submission too fast. Please take your time filling the form.",
      });
    }

    const emailLimit = checkEmailRateLimit(email);
    if (!emailLimit.allowed) {
      logEvent("contact_rate_limited_email", { requestId, ip: clientIp, email, retryAfter: emailLimit.retryAfter });
      return respond(requestId, 429, {
        success: false,
        code: "RATE_LIMITED",
        message: `Too many emails from this address. Please try again in ${emailLimit.retryAfter} seconds.`,
      });
    }

    const ipLimit = checkIpRateLimit(clientIp);
    if (!ipLimit.allowed) {
      logEvent("contact_rate_limited_ip", { requestId, ip: clientIp, email, retryAfter: ipLimit.retryAfter });
      return respond(requestId, 429, {
        success: false,
        code: "RATE_LIMITED",
        message: `Too many requests from this IP. Please try again in ${ipLimit.retryAfter} seconds.`,
      });
    }

    if (checkSpam(rawMessage)) {
      logEvent("contact_spam_detected", { requestId, ip: clientIp, email });
      return respond(requestId, 400, {
        success: false,
        code: "SPAM_DETECTED",
        message: "Your message appears to be spam. Please revise and try again.",
      });
    }

    const { subject, html, text } = buildContactEmail({
      name,
      email,
      message: rawMessage,
      company,
      phone,
      service,
      submittedAt: new Date(),
    });

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error(`[contact:${requestId}] Resend error:`, error);
      logEvent("contact_email_provider_error", { requestId, ip: clientIp, email, error: String(error) });
      return respond(requestId, 502, {
        success: false,
        code: "EMAIL_PROVIDER_ERROR",
        message: "Failed to send email. Please try again later.",
      });
    }

    logEvent("contact_form_submitted", { requestId, ip: clientIp, email, emailId: data?.id });

    return respond(requestId, 200, {
      success: true,
      code: "EMAIL_SENT",
      message: "Your message has been sent successfully",
      data: {
        emailId: data?.id ?? null,
        name,
        email,
        company,
        phone,
        service,
        message,
        rawMessage,
      },
    });
  } catch (err) {
    console.error(`[contact:${requestId}] Unexpected error:`, err);
    logEvent("contact_internal_error", { requestId, ip: clientIp, error: String(err) });
    return respond(requestId, 500, {
      success: false,
      code: "INTERNAL_ERROR",
      message: "Something went wrong. Please try again later.",
    });
  }
}