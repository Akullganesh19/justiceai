## 2024-05-20 — Inadequate XSS Filter
**Attacked:** `xssMiddleware` in `server.js`
**Found:** The custom XSS middleware fails to properly escape all malicious inputs. By using a basic regex replacement, characters like `<` and `>` were not being correctly replaced with their HTML entity equivalents `&lt;` and `&gt;` (it was replacing `<` with `<`). Thus, XSS vectors via JSON payloads are possible, bypassing the filter entirely.
**Severity:** 🔴
**Fixed or flagged:** Fixed. Replaced the flawed replace calls with standard entity equivalents `&lt;` and `&gt;`.
**Systemic pattern:** Homegrown sanitation logic is always risky. The `escapeHtml` function was implemented incorrectly. We should rely on established libraries, but since we are maintaining the custom function here, the fix addresses the immediate vector.
