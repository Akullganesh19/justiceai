import winston from 'winston';
import util from 'util';

const REDACT_STRING = '[REDACTED]';

const PII_PATTERNS = [
  { name: 'email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: (match) => {
      const parts = match.split('@');
      if (parts.length === 2 && parts[0].length > 1) {
          return `${parts[0][0]}***@${parts[1]}`;
      }
      return REDACT_STRING;
  }},
  { name: 'phone', regex: /(?:\+91|91|0)?\s?[7-9]\d{2}\s?\d{3}\s?\d{4}/g, replacement: '[REDACTED PHONE]' },
  { name: 'aadhaar', regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g, replacement: '[REDACTED AADHAAR]' },
  { name: 'pan', regex: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g, replacement: '[REDACTED PAN]' },
  { name: 'card', regex: /\b(?:\d[ -]*?){13,16}\b/g, replacement: '[REDACTED CARD]' }
];

export function redactString(str) {
  if (typeof str !== 'string') return str;
  let redacted = str;
  for (const { regex, replacement } of PII_PATTERNS) {
    redacted = redacted.replace(regex, replacement);
  }
  return redacted;
}

export function redactObject(obj, maxDepth = 5, currentDepth = 0, seen = new WeakSet()) {
  if (currentDepth >= maxDepth) {
    return '[MAX DEPTH REACHED]';
  }

  if (obj === null || typeof obj !== 'object') {
    if (typeof obj === 'string') {
      return redactString(obj);
    }
    return obj;
  }

  if (seen.has(obj)) {
    return '[CIRCULAR REFERENCE]';
  }

  seen.add(obj);

  if (obj instanceof Date) {
    return obj;
  }

  if (obj instanceof Error) {
    const newError = new Error(redactString(obj.message));
    newError.stack = redactString(obj.stack);
    newError.name = obj.name;
    return newError;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => redactObject(item, maxDepth, currentDepth + 1, seen));
  }

  const result = {};
  for (const key of Reflect.ownKeys(obj)) {
      result[key] = redactObject(obj[key], maxDepth, currentDepth + 1, seen);
  }

  return result;
}

export const redactFormat = winston.format((info) => {
  return redactObject(info);
});

export function setupRedactedLogger() {
  const originalConsoleLog = console.log;
  const originalConsoleError = console.error;
  const originalConsoleWarn = console.warn;
  const originalConsoleInfo = console.info;

  const formatArgs = (args) => {
    return args.map(arg => {
      if (typeof arg === 'string') {
        return redactString(arg);
      }
      if (arg instanceof Error) {
        return redactObject(arg);
      }
      if (typeof arg === 'object' && arg !== null) {
        // Redact object and then use util.inspect to avoid breaking circular references that util.inspect natively handles
        const redacted = redactObject(arg);
        return util.inspect(redacted, { depth: 5, maxArrayLength: 100 });
      }
      return arg;
    });
  };

  console.log = (...args) => {
    originalConsoleLog(...formatArgs(args));
  };

  console.error = (...args) => {
    originalConsoleError(...formatArgs(args));
  };

  console.warn = (...args) => {
    originalConsoleWarn(...formatArgs(args));
  };

  console.info = (...args) => {
    originalConsoleInfo(...formatArgs(args));
  };
}
