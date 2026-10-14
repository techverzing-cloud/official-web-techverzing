# Contact Form Security - Implementation Summary (No External Dependencies)

**Date**: 13-10-2026  
**Project**: Techverzing  
**Status**: ✅ Implemented (Zero external dependencies, free forever)

---

## Implemented Features (All Self-Hosted / No API Keys)

### 1. Bot Timing Check
**Files**: `src/app/api/send-email/route.ts`, `src/app/(main)/contact/ContactForm.tsx`

- **Frontend**: Records `formLoadTime` on component mount via `useRef`
- **Backend**: Rejects submissions where `Date.now() - formLoadTime < 3000ms`
- **Error code**: `BOT_TIMING_FAILED` (400)
- **Note**: Humans typically take >5s to fill form; bots submit instantly
- **Cost**: $0, no external service

### 2. In-Memory Rate Limiting (Email + IP)
**Files**: `src/app/api/send-email/route.ts`

- **Email limit**: 3 requests / 24 hours (sliding window)
- **IP limit**: 10 requests / 1 hour (sliding window)
- **Storage**: In-memory `Map` with hourly cleanup interval
- **Persistence**: Resets on deploy/restart (acceptable for low-traffic)
- **Error code**: `RATE_LIMITED` (429) with retry-after seconds
- **Cost**: $0, no external service

### 3. Spam Keyword Detection
**Files**: `src/app/api/send-email/route.ts:100-120`

- 30+ spam keywords/phrases
- URL count check (>2 URLs = spam)
- Capital letter ratio check (>50% = spam)
- **Error code**: `SPAM_DETECTED` (400)
- **Cost**: $0

### 4. Honeypot Field
**Files**: `src/app/(main)/contact/ContactForm.tsx:140-150`, `src/app/api/send-email/route.ts`

- Hidden `website` input (screen-reader only, `tabIndex={-1}`)
- Bots fill all fields; real users don't see it
- Silently drops submission if filled
- **Cost**: $0

### 5. Input Validation & Sanitization
**Files**: `src/app/api/send-email/route.ts:150-180`

- Required fields: name, email, message
- Length limits: name (2-100), email (254), message (10-5000), company (200), phone (50), service (200)
- Email format validation (regex)
- Control character stripping (null bytes, etc.)
- **Cost**: $0

### 6. HTML Escaping in Email Template
**Files**: `src/app/api/send-email/email-template.ts:42-49`

- Prevents email header injection
- Escapes `&`, `<`, `>`, `"`, `'`
- **Cost**: $0

### 7. Structured Logging
**Files**: `src/app/api/send-email/route.ts`

All events logged as JSON to console (captured by Vercel):

| Event | Trigger |
|-------|---------|
| `contact_form_submitted` | Successful email send |
| `contact_validation_error` | Input validation failed |
| `contact_rate_limited_email` | Email rate limit exceeded |
| `contact_rate_limited_ip` | IP rate limit exceeded |
| `contact_spam_detected` | Spam keywords/heuristics matched |
| `contact_bot_timing_failed` | Sub-3-second submission |
| `contact_email_provider_error` | Resend API error |
| `contact_internal_error` | Unexpected server error |
| `contact_invalid_json` | Malformed request body |

Each log includes: `requestId`, `timestamp`, `ip`, `email`, and relevant details.

### 8. Request ID per Submission
- UUID v4 generated per request for tracing
- Included in all logs and API responses

---

## Removed (Required External Services)

| Feature | Reason |
|---------|--------|
| Cloudflare Turnstile | Requires dashboard setup, site/secret keys |
| Upstash Redis | Requires account, REST URL/token |
| Akismet | Paid for commercial use |

---

## Error Codes (API Response)

| Code | HTTP | Meaning |
|------|------|---------|
| `EMAIL_SENT` | 200 | Success |
| `VALIDATION_ERROR` | 400 | Invalid input |
| `SPAM_DETECTED` | 400 | Spam heuristics matched |
| `BOT_TIMING_FAILED` | 400 | Submitted too fast (<3s) |
| `RATE_LIMITED` | 429 | Email (3/day) or IP (10/hr) limit exceeded |
| `CONFIG_ERROR` | 500 | Missing env vars (Resend) |
| `EMAIL_PROVIDER_ERROR` | 502 | Resend API failed |
| `INTERNAL_ERROR` | 500 | Unexpected error |
| `INVALID_JSON` | 400 | Malformed request |

---

## Frontend Status States

| State | Message |
|-------|---------|
| `success` | "Thanks, your note is in. We'll reply within one working day." |
| `error` | "We couldn't send your note. Please try again, or email us at info@techverzing.com." |
| `rate-limited` | "You've sent 3 messages today. Please wait until tomorrow to send more." (email) or "Too many requests from this IP. Please try again in X seconds." (IP) |
| `spam` | "Your message was flagged as spam. Please revise and try again." |
| `bot-timing-failed` | "Submission too fast. Please take your time filling the form." |

---

## Environment Variables (Only Resend Required)

```bash
# Email (Resend) - Required
RESEND_API_KEY=
EMAIL_FROM="Techverzing <onboarding@resend.dev>"
EMAIL_TO=contact@techverzing.com

# AI (Optional)
GOOGLE_GENERATIVE_AI_API_KEY=
```

---

## Files Modified

| File | Changes |
|------|---------|
| `src/app/api/send-email/route.ts` | In-memory rate limits (email + IP), bot timing check, spam detection, structured logs |
| `src/app/(main)/contact/ContactForm.tsx` | Timing tracking, new error states (bot-timing-failed), removed Turnstile |
| `src/app/(main)/contact/page.tsx` | Removed Turnstile script |
| `package.json` | Removed `@upstash/ratelimit`, `@upstash/redis` |
| `.env.example` | Only Resend vars documented |

---

## Verification Checklist

- [x] TypeScript compiles (`pnpm tsc --noEmit`)
- [x] Build succeeds (`pnpm build`)
- [x] Zero external dependencies for security features
- [x] All error states handled in UI
- [x] In-memory rate limiting with cleanup
- [x] Structured logging implemented
- [x] Only Resend API key required

---

## Trade-offs

| Aspect | In-Memory | Upstash Redis |
|--------|-----------|---------------|
| **Cost** | $0 | $0 (free tier) |
| **Persistence** | Resets on deploy | Survives deploys |
| **Multi-instance** | Not shared | Shared across instances |
| **Scale** | Low traffic only | High traffic |
| **Setup** | None | Account + keys |

**Verdict**: In-memory is fine for Techverzing's current traffic. Upgrade to Upstash when:
- Multiple Vercel instances run simultaneously
- Rate limits need to persist across deploys
- Traffic exceeds ~100 submissions/day

---

## Cost Summary

| Service | Cost |
|---------|------|
| Resend (email) | Free tier: 3k emails/month |
| Rate limiting | $0 (in-memory) |
| Bot detection | $0 (timing + honeypot + keywords) |
| Spam filtering | $0 (keywords + heuristics) |
| Logging | $0 (Vercel console) |
| **Total** | **$0/month** |