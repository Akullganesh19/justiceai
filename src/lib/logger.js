export function setupRedactedLogger() {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;

  function redactEmail(match) {
    const [local, domain] = match.split('@');
    if (!domain) return match;
    return `${local[0]}***@${domain}`;
  }

  const piiRegexes = [
    { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, fn: redactEmail },
    { regex: /\b(?:\+?91[-. ]?)?[6-9]\d{9}\b/g, fn: () => '[REDACTED_PHONE]' },
    { regex: /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, fn: () => '[REDACTED_AADHAAR]' },
    { regex: /\b[A-Z]{5}\d{4}[A-Z]\b/gi, fn: () => '[REDACTED_PAN]' },
    { regex: /\b(?:\d[ -]*?){13,16}\b/g, fn: () => '[REDACTED_CARD]' }
  ];

  function redactString(str) {
    let safeStr = str;
    for (const { regex, fn } of piiRegexes) {
      safeStr = safeStr.replace(regex, fn);
    }
    return safeStr;
  }

  function redactContent(arg, seen = new WeakSet()) {
    if (typeof arg === 'string') {
      return redactString(arg);
    }
    if (arg instanceof Error) {
      const newErr = new Error(redactString(arg.message));
      newErr.stack = redactString(arg.stack || '');
      return newErr;
    }
    if (arg && typeof arg === 'object') {
      if (seen.has(arg)) return '[Circular]';
      seen.add(arg);
      if (Array.isArray(arg)) {
        return arg.map(item => redactContent(item, seen));
      }
      const safeObj = {};
      for (const [k, v] of Object.entries(arg)) {
        if (['password', 'token', 'secret', 'authorization', 'api_key', 'apikey'].includes(k.toLowerCase())) {
          safeObj[k] = '[REDACTED_CREDENTIAL]';
        } else {
          safeObj[k] = redactContent(v, seen);
        }
      }
      return safeObj;
    }
    return arg;
  }

  console.log = (...args) => originalConsoleLog(...args.map(redactContent));
  console.error = (...args) => originalConsoleError(...args.map(redactContent));
  console.warn = (...args) => originalConsoleWarn(...args.map(redactContent));
}
