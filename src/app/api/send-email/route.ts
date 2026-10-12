import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateName(name: string): boolean {
  return name.length >= 2 && name.length <= 100;
}

function validateMessage(message: string): boolean {
  return message.length >= 10 && message.length <= 5000;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, message" },
        { status: 400 }
      );
    }

    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedMessage = sanitizeInput(message);

    if (!validateName(sanitizedName)) {
      return NextResponse.json(
        { error: "Name must be between 2 and 100 characters" },
        { status: 400 }
      );
    }

    if (!validateEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!validateMessage(sanitizedMessage)) {
      return NextResponse.json(
        { error: "Message must be between 10 and 5000 characters" },
        { status: 400 }
      );
    }

    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: process.env.EMAIL_TO!,
      subject: `${sanitizedName} sent a message via Contact Form - Techverzing`,
      html: `
      <div style="font-family:Arial,Segoe UI,sans-serif;background-color:#f3f4f6;padding:24px;">
        <div style="max-width:600px;margin:auto;background-color:#ffffff;border-radius:10px;padding:24px;border:1px solid #e5e7eb;">
          
          <h2 style="margin:0 0 16px;color:#111827;">
            New Contact Form Message
          </h2>
          
          <p style="margin:6px 0;color:#111827;">
            <strong>Name:</strong> ${sanitizedName}
          </p>
          
          <p style="margin:6px 0;color:#111827;">
            <strong>Email:</strong> ${sanitizedEmail}
          </p>
          
          <div style="margin-top:14px;">
            <p style="margin:0 0 4px;color:#111827;">
              <strong>Message:</strong>
            </p>
            
            <div style="
              background-color:#e5e7eb;
              border:1px solid #d1d5db;
              border-radius:8px;
              padding:12px;
              color:#111827;
              font-size:14px;
              line-height:1.6;
              white-space:pre-wrap;
            ">
              ${sanitizedMessage}
            </div>
          </div>

          <hr style="margin:20px 0;border:0;border-top:1px solid #e5e7eb;"/>

          <p style="font-size:12px;color:#6b7280;text-align:center;">
            Sent from <strong>techverzing.com</strong>
          </p>
        
        </div>
      </div>
      `,
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
