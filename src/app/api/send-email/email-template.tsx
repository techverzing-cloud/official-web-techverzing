// email-template.ts
// Builds the notification email sent to the Techverzing team when someone
// submits the contact form. Table-based layout + inline styles so it renders
// consistently in Gmail, Outlook, and Apple Mail.

export interface ContactEmailData {
  name: string;
  email: string;
  message: string;
  submittedAt: Date;
  // Optional. If omitted, they are read from "Company: ..." style lines at
  // the top of `message` (what the website form currently sends).
  company?: string;
  phone?: string;
  service?: string;
}

export interface ParsedMessage {
  fields: { company?: string; phone?: string; service?: string };
  body: string;
}

export interface BuiltEmail {
  subject: string;
  html: string;
  text: string;
}

// Change these to match the brand.
// Mirrors the site's @theme tokens (email clients don't support CSS variables
// or rgba text reliably, so everything is a solid hex value).
const BRAND = {
  name: "Techverzing",
  site: "techverzing.com",
  siteUrl: "https://techverzing.com",
  primary: "#141415", // --color-black (header)
  primaryDark: "#0d0d0e", // --color-black-slate (header gradient end)
  onPrimary: "#f4f4f4", // --color-white (text on dark header)
  accent: "#FF8C42", // --color-impact / --color-complement
  onAccent: "#141415", // dark text keeps the orange button readable
  text: "#202223", // --color-primary
  muted: "#636565", // --color-dull-text-dark (70% of #202223) as a solid color
  border: "#d9d6c4", // slightly deeper cream so borders show on the cream page
  cream: "#e8e6d9", // --color-cream-white
  pageBg: "#e8e6d9", // --color-cream-white
  cardBg: "#f4f4f4", // --color-white
  messageBg: "#ffffff",
};

const FONT = "'Segoe UI',Helvetica,Arial,sans-serif";

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(date);
}

function initialOf(name: string): string {
  return escapeHtml(name.trim().charAt(0).toUpperCase() || "?");
}

const FIELD_RE = /^(company|phone|service)\s*:\s*(.*)$/i;

/**
 * Splits a message like
 *   Company: Acme
 *   Phone: 12345
 *   Service: Digital Marketing & SEO
 *
 *   Hi, I'd like to talk about...
 * into { fields: {company, phone, service}, body: "Hi, I'd like..." }.
 * If the message has no such header lines, body is the whole message.
 */
export function parseContactMessage(raw: string): ParsedMessage {
  const lines = raw.split(/\r?\n/);
  const fields: ParsedMessage["fields"] = {};
  let i = 0;

  while (i < lines.length) {
    const match = lines[i].trim().match(FIELD_RE);
    if (!match) break;
    const key = match[1].toLowerCase() as keyof ParsedMessage["fields"];
    fields[key] = match[2].trim();
    i++;
  }

  if (Object.keys(fields).length === 0) {
    return { fields, body: raw.trim() };
  }

  while (i < lines.length && lines[i].trim() === "") i++;
  return { fields, body: lines.slice(i).join("\n").trim() };
}

function detailRow(label: string, valueHtml: string, isLast: boolean): string {
  const bottom = isLast ? "" : `border-bottom:1px solid ${BRAND.border};`;
  return `
                <tr>
                  <td width="130" valign="top" style="padding:12px 16px;background-color:${BRAND.cream};${bottom}font-family:${FONT};font-size:13px;font-weight:600;color:${BRAND.text};">${label}</td>
                  <td valign="top" style="padding:12px 16px;${bottom}font-family:${FONT};font-size:14px;color:${BRAND.text};">${valueHtml}</td>
                </tr>`;
}

export function buildContactEmail(data: ContactEmailData): BuiltEmail {
  // Strip line breaks so a name can never inject extra email headers.
  const safeSubjectName = data.name.replace(/[\r\n]+/g, " ");
  const subject = `New message from ${safeSubjectName} | ${BRAND.name} Contact Form`;

  const name = escapeHtml(data.name);
  const email = escapeHtml(data.email);

  const when = escapeHtml(formatDate(data.submittedAt));
  const parsed = parseContactMessage(data.message);
  const company = (data.company ?? parsed.fields.company ?? "").trim();
  const phone = (data.phone ?? parsed.fields.phone ?? "").trim();
  const service = (data.service ?? parsed.fields.service ?? "").trim();
  const bodyText = parsed.body;

  const messageHtml = bodyText
    ? escapeHtml(bodyText).replace(/\r?\n/g, "<br />")
    : `<span style="color:${BRAND.muted};font-style:italic;">No additional message provided.</span>`;

  const rows: Array<[string, string]> = [
    ["Name", name],
    [
      "Email",
      `<a href="mailto:${email}" style="color:${BRAND.text};text-decoration:underline;">${email}</a>`,
    ],
  ];
  if (company) rows.push(["Company", escapeHtml(company)]);
  if (phone) rows.push(["Phone", escapeHtml(phone)]);
  if (service) rows.push(["Service", escapeHtml(service)]);
  rows.push(["Received", `${when} (IST)`]);
  rows.push(["Source", `Contact form on ${BRAND.site}`]);

  const detailsRows = rows
    .map(([label, value], i) => detailRow(label, value, i === rows.length - 1))
    .join("");
  const mailtoHref = `mailto:${encodeURIComponent(data.email)}?subject=${encodeURIComponent(
    `Re: Your message to ${BRAND.name}`,
  )}`;

  const preheader = escapeHtml(
    (bodyText || data.message).replace(/\s+/g, " ").slice(0, 100),
  );

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background-color:${BRAND.pageBg};font-family:${FONT};">
  <!-- Preheader (inbox preview text) -->
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
    ${preheader}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${BRAND.pageBg};">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;background-color:${BRAND.cardBg};border-radius:14px;overflow:hidden;border:1px solid ${BRAND.border};">

          <!-- Header -->
          <tr>
            <td style="background-color:${BRAND.primary};background-image:linear-gradient(135deg,${BRAND.primary},${BRAND.primaryDark});padding:28px 32px;">
              <p style="margin:0;font-family:${FONT};font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:${BRAND.accent};">
                ${BRAND.name}
              </p>
              <h1 style="margin:6px 0 0;font-family:${FONT};font-size:22px;line-height:1.3;font-weight:700;color:${BRAND.onPrimary};">
                New contact form message
              </h1>
            </td>
          </tr>

          <!-- Accent strip -->
          <tr>
            <td style="height:4px;line-height:4px;font-size:0;background-color:${BRAND.accent};">&nbsp;</td>
          </tr>

          <!-- Sender -->
          <tr>
            <td style="padding:28px 32px 8px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td width="52" valign="middle">
                    <div style="width:44px;height:44px;line-height:44px;border-radius:22px;background-color:${BRAND.cream};color:${BRAND.text};text-align:center;font-family:${FONT};font-size:18px;font-weight:700;">
                      ${initialOf(data.name)}
                    </div>
                  </td>
                  <td valign="middle" style="font-family:${FONT};">
                    <div style="font-size:16px;font-weight:600;color:${BRAND.text};">${name}</div>
                    <div style="font-size:14px;margin-top:2px;">
                      <a href="mailto:${email}" style="color:${BRAND.text};text-decoration:underline;">${email}</a>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:20px 32px 8px;">
              <p style="margin:0 0 8px;font-family:${FONT};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${BRAND.muted};font-weight:600;">
                Message
              </p>
              <div style="background-color:${BRAND.messageBg};border:1px solid ${BRAND.border};border-left:4px solid ${BRAND.accent};border-radius:8px;padding:16px 18px;font-family:${FONT};font-size:15px;line-height:1.7;color:${BRAND.text};word-break:break-word;">
                ${messageHtml}
              </div>
            </td>
          </tr>

          <!-- Reply button -->
          <tr>
            <td align="left" style="padding:20px 32px 8px;">
              <a href="${mailtoHref}" style="display:inline-block;background-color:${BRAND.accent};color:${BRAND.onAccent};font-family:${FONT};font-size:14px;font-weight:600;text-decoration:none;padding:12px 22px;border-radius:8px;">
                Reply to ${name}
              </a>
            </td>
          </tr>

          <!-- Submission details table -->
          <tr>
            <td style="padding:20px 32px 28px;">
              <p style="margin:0 0 8px;font-family:${FONT};font-size:12px;letter-spacing:1px;text-transform:uppercase;color:${BRAND.muted};font-weight:600;">
                Submission details
              </p>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid ${BRAND.border};border-radius:8px;border-collapse:separate;border-spacing:0;overflow:hidden;background-color:${BRAND.messageBg};">${detailsRows}
              </table>
            </td>
          </tr>

        </table>

        <!-- Footer -->
        <p style="max-width:600px;margin:16px auto 0;font-family:${FONT};font-size:12px;line-height:1.6;color:${BRAND.muted};text-align:center;">
          Sent from the contact form on
          <a href="${BRAND.siteUrl}" style="color:${BRAND.muted};text-decoration:underline;">${BRAND.site}</a>.
          You can reply directly to this email to reach ${name}.
        </p>

      </td>
    </tr>
  </table>
</body>
</html>`;

  const text = [
    `New contact form message - ${BRAND.name}`,
    "",
    `Name:    ${data.name}`,
    `Email:   ${data.email}`,
    ...(company ? [`Company: ${company}`] : []),
    ...(phone ? [`Phone:   ${phone}`] : []),
    ...(service ? [`Service: ${service}`] : []),
    `Date:    ${formatDate(data.submittedAt)} (IST)`,
    "",
    "Message:",
    bodyText || "(No additional message provided.)",
    "",
    `Sent from ${BRAND.site}. Reply to this email to respond to the sender.`,
  ].join("\n");

  return { subject, html, text };
}