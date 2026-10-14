# Contact Form Security - Production Ready Plan

**Date**: 13-10-2026  
**Project**: Techverzing  
**Scope**: Free-tier only security enhancements for contact form

---

## Current State (Baseline)

| Protection | Status |
|------------|--------|
| Honeypot field | ✅ Implemented |
| Rate limiting (in-memory, 3/day per email) | ✅ Implemented |
| Spam keyword detection (30+ keywords) | ✅ Implemented |
| Input validation & sanitization | ✅ Implemented |
| HTML escaping in email template | ✅ Implemented |
| Request ID logging | ✅ Implemented |

---

## Gaps Identified

| Gap | Risk | Free Solution |
|-----|------|---------------|
| No CAPTCHA/challenge | Medium | Cloudflare Turnstile (free, invisible) |
| In-memory rate limit resets on deploy | Medium | Upstash Redis (free tier: 10k req/day) |
| No IP-based rate limiting | Medium | Upstash Redis sliding window |
| No bot timing detection | Medium | Client-side timestamp check |
| No request size limit | Low | Next.js bodyParser config |
| No structured monitoring | Low | Console JSON logs (Vercel captures) |

---

## Implementation Plan (Free Tier Only)

### Phase 1: Core Bot Protection (~1 hour)

#### 1.1 Cloudflare Turnstile (Invisible)
- **Frontend**: Add Turnstile widget to form, get token on submit
- **Backend**: Verify token via `challenges.cloudflare.com/turnstile/v0/siteverify`
- **Env vars**: `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
- **Cost**: Free (unlimited)

#### 1.2 Bot Timing Check
- **Frontend**: Record `formLoadTime` on component mount
- **Backend**: Reject if submit time - loadTime < 3000ms
- **Cost**: Free

#### 1.3 Request Size Limit
- **Backend**: Add `export const config = { api: { bodyParser: { sizeLimit: "1mb" } } }`
- **Cost**: Free

---

### Phase 2: Persistent Rate Limiting (~45 min)

#### 2.1 Upstash Redis Rate Limits
- **Dependencies**: `@upstash/ratelimit`, `@upstash/redis`
- **Email limit**: 3 requests / 24 hours (sliding window)
- **IP limit**: 10 requests / 1 hour (sliding window)
- **Env vars**: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- **Cost**: Free tier (10k req/day, 256 MB)

---

### Phase 3: Monitoring & Observability (~20 min)

#### 3.1 Structured Logging
- Log events as JSON: `contact_form_submitted`, `rate_limited`, `spam_blocked`, `turnstile_failed`, `bot_timing_failed`
- Include: `requestId`, `email`, `ip`, `timestamp`, `details`
- Vercel captures console.log automatically

---

## Files to Modify

| File | Changes |
|------|---------|
| `src/app/api/send-email/route.ts` | Turnstile verify, Upstash rate limits, timing check, size limit, structured logs |
| `src/app/(main)/contact/ContactForm.tsx` | Turnstile widget, timing tracking, token in payload |
| `package.json` | Add `@upstash/ratelimit`, `@upstash/redis` |
| `.env.example` | Document new env vars |

---

## Environment Variables Needed

```bash
# Cloudflare Turnstile (get from dash.cloudflare.com)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=your_site_key
TURNSTILE_SECRET_KEY=your_secret_key

# Upstash Redis (get from console.upstash.com)
UPSTASH_REDIS_REST_URL=https://your-db.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token
```

---

## Success Criteria

- [ ] Turnstile blocks automated submissions
- [ ] Rate limits persist across deploys
- [ ] IP-based rate limiting works
- [ ] Sub-3-second submissions rejected
- [ ] Large payloads rejected (413)
- [ ] Structured logs visible in Vercel
- [ ] No regression in legitimate form submissions
- [ ] Build passes (TypeScript + ESLint)