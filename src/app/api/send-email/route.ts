import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, message } = await req.json();

const data = await resend.emails.send({
  from: process.env.EMAIL_FROM!,
  to: process.env.EMAIL_TO!,
  subject: `${name} sent a message via Contact Form — Techverzing`,
  html: `
  <div style="font-family:Arial,Segoe UI,sans-serif;background-color:#f3f4f6;padding:24px;">
    <div style="max-width:600px;margin:auto;background-color:#ffffff;border-radius:10px;padding:24px;border:1px solid #e5e7eb;">
      
      <h2 style="margin:0 0 16px;color:#111827;">
        New Contact Form Message
      </h2>
      
      <p style="margin:6px 0;color:#111827;">
        <strong>Name:</strong> ${name}
      </p>
      
      <p style="margin:6px 0;color:#111827;">
        <strong>Email:</strong> ${email}
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
          ${message}
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
    return NextResponse.json({ error }, { status: 500 });
  }
}
