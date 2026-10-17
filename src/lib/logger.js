import winston from 'winston';

const PII_PATTERNS = [
  // Email
  { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '[REDACTED_EMAIL]' },
  // Credit/Debit Cards (13-16 digits with optional spaces/dashes)
  { regex: /\b(?:\d[ -]*?){13,16}\b/g, replacement: '[REDACTED_CARD]' },
  // Aadhaar (12 digits, optional spaces/dashes)
  { regex: /\b\d{4}[ -]?\d{4}[ -]?\d{4}\b/g, replacement: '[REDACTED_AADHAAR]' },
  // PAN Card (5 letters, 4 digits, 1 letter)
  { regex: /\b[A-Z]{5}\d{4}[A-Z]{1}\b/g, replacement: '[REDACTED_PAN]' },
  // Indian Phone Numbers (+91 or just 10 digits)
  { regex: /(?:\+?91[-\s]?)?[6-9]\d{9}\b/g, replacement: '[REDACTED_PHONE]' },
];

export function maskPII(str) {
  if (typeof str !== 'string') return str;
  let masked = str;
  for (const { regex, replacement } of PII_PATTERNS) {
    masked = masked.replace(regex, replacement);
  }
  return masked;
}

export function redactObject(obj, seen = new WeakSet(), depth = 0) {
  // Max depth to prevent stack overflow on massive objects like req/res
  if (depth > 5) return '[Max Depth Reached]';

  if (obj === null || typeof obj !== 'object') {
    return typeof obj === 'string' ? maskPII(obj) : obj;
  }

  if (seen.has(obj)) {
    return '[Circular]';
  }

  if (obj instanceof Date) {
    return obj;
  }

  if (obj instanceof Error) {
    return {
      message: maskPII(obj.message),
      name: obj.name,
      stack: maskPII(obj.stack || ''),
    };
  }

  if (Array.isArray(obj)) {
    seen.add(obj);
    return obj.map(item => redactObject(item, seen, depth + 1));
  }

  seen.add(obj);
  const result = {};

  // Use Reflect.ownKeys to iterate over properties including Symbols
  for (const key of Reflect.ownKeys(obj)) {
    result[key] = redactObject(obj[key], seen, depth + 1);
  }

  return result;
}

export const winstonRedactFormat = winston.format((info) => {
  return redactObject(info);
});

export function setupRedactedLogger() {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;

  const processArgs = (args) => {
    return args.map(arg => {
      if (typeof arg === 'string') {
        return maskPII(arg);
      } else if (typeof arg === 'object') {
        return redactObject(arg);
      }
      return arg;
    });
  };

  console.log = (...args) => originalLog.apply(console, processArgs(args));
  console.error = (...args) => originalError.apply(console, processArgs(args));
  console.warn = (...args) => originalWarn.apply(console, processArgs(args));
  console.info = (...args) => originalInfo.apply(console, processArgs(args));
}
