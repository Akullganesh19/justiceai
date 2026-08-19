## 2024-08-19 — XSS Middleware Failed to Escape HTML Entities
**Attacked:** Express `xssMiddleware` (`server.js`)
**Found:** The `escapeHtml` function intended to sanitize request bodies and queries was replacing characters with themselves (e.g., `.replace(/</g, '<')` instead of `.replace(/</g, '&lt;')`), rendering the XSS protection completely ineffective.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Replaced the identity transformations with the proper HTML entities (`&amp;`, `&lt;`, `&gt;`, `&quot;`).
**Systemic pattern:** This is a classic "copy-paste without testing" error. Suggests that other security-critical middleware (like CORS, rate limiting) might also have configuration bugs. Will keep an eye out.

## 2024-08-19 — Rate Limits Overly Permissive / Not Shared Across Instances
**Attacked:** Rate Limiters (`apiLimiter`, `chatLimiter` in `server.js`)
**Found:** The memory store is used for rate limiting (`express-rate-limit` default). This means if the server scales horizontally, rate limits apply per-instance, severely weakening protection. Additionally, the fallback message in `chatLimiter` and `apiLimiter` doesn't enforce standard HTTP 429 semantics correctly (by default it sets status code 429, but when you look at the JSON response, there is no Redis or central store).
**Severity:** 🟡
**Fixed or flagged:** Flagged. Requires integrating Redis or similar for central rate-limiting, and checking if the application runs behind a load balancer that might need `trust proxy` configuration (currently missing).

## 2024-08-19 — CSP allows 'unsafe-inline' and 'unsafe-eval'
**Attacked:** Helmet CSP configuration (`server.js`)
**Found:** The Content Security Policy allows `'unsafe-inline'` and `'unsafe-eval'` for scripts. While sometimes necessary for development or certain frameworks, it significantly weakens XSS protection.
**Severity:** 🟡
**Fixed or flagged:** Flagged. Need to review if React/Vite in production actually requires these directives, and consider removing them for production environments.

## 2024-08-19 — Missing 'trust proxy' for rate limiters
**Attacked:** Express `trust proxy` setting (`server.js`)
**Found:** `app.set('trust proxy', ...)` is not configured. Since rate limiters depend on `req.ip`, if this app is deployed behind a reverse proxy (like Nginx, Vercel, Render), all requests will appear to come from the proxy's IP. The rate limiters will block the proxy itself after a few requests, causing a denial of service for all users.
**Severity:** 🟡
**Fixed or flagged:** Flagged. Need to configure `app.set('trust proxy', 1)` or similar if deploying behind a proxy.
