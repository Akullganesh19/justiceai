import winston from 'winston';

const PII_PATTERNS = [
  /\b(?:\d[ -]*?){13,16}\b/g, // Card (13-16 digits)
  /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, // Aadhaar
  /\b[A-Z]{5}\d{4}[A-Z]\b/gi, // PAN
  /(?:\+91[-\s]?)?[6-9]\d{9}\b/g, // Phone
  /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g // Email
];

function redactString(str) {
  if (typeof str !== 'string') return str;
  let redacted = str;
  for (const pattern of PII_PATTERNS) {
    redacted = redacted.replace(pattern, '[REDACTED]');
  }
  return redacted;
}

export function redactObject(obj, seen = new WeakSet(), depth = 0, maxDepth = 5) {
  if (depth > maxDepth) return '[MAX_DEPTH_REACHED]';
  if (obj === null || typeof obj !== 'object') {
    if (typeof obj === 'string') return redactString(obj);
    return obj;
  }

  if (seen.has(obj)) return '[CIRCULAR]';
  seen.add(obj);

  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);

  if (obj instanceof Error) {
    const newErr = new Error(redactString(obj.message));
    newErr.stack = redactString(obj.stack);
    newErr.name = obj.name;
    // Copy any custom properties the Error might have
    for (const key of Reflect.ownKeys(obj)) {
      if (key !== 'message' && key !== 'stack' && key !== 'name') {
        newErr[key] = redactObject(obj[key], seen, depth + 1, maxDepth);
      }
    }
    return newErr;
  }

  // Handle Buffer by returning it as-is to preserve formatting
  if (typeof Buffer !== 'undefined' && obj instanceof Buffer) {
    return obj;
  }

  if (obj instanceof Set) {
    return new Set(Array.from(obj).map(item => redactObject(item, seen, depth + 1, maxDepth)));
  }
  if (obj instanceof Map) {
    const newMap = new Map();
    for (const [k, v] of obj.entries()) {
      newMap.set(redactObject(k, seen, depth + 1, maxDepth), redactObject(v, seen, depth + 1, maxDepth));
    }
    return newMap;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => redactObject(item, seen, depth + 1, maxDepth));
  }

  const redacted = {};
  for (const key of Reflect.ownKeys(obj)) {
    const value = obj[key];
    if (typeof value === 'string') {
      redacted[key] = redactString(value);
    } else if (typeof value === 'object' && value !== null) {
      redacted[key] = redactObject(value, seen, depth + 1, maxDepth);
    } else {
      redacted[key] = value;
    }
  }
  return redacted;
}

export const redactFormat = winston.format((info) => {
  return redactObject(info);
});

export const setupRedactedLogger = () => {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;

  function processArgs(args) {
    return args.map(arg => {
      if (typeof arg === 'string') return redactString(arg);
      if (typeof arg === 'object' && arg !== null) {
        return redactObject(arg);
      }
      return arg;
    });
  }

  console.log = (...args) => originalLog.apply(console, processArgs(args));
  console.error = (...args) => originalError.apply(console, processArgs(args));
  console.warn = (...args) => originalWarn.apply(console, processArgs(args));
  console.info = (...args) => originalInfo.apply(console, processArgs(args));
};
