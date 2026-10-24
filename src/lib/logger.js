import winston from 'winston';
import util from 'util';
import { Buffer } from 'buffer';
import process from 'process';

const PII_PATTERNS = [
  { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, replacement: '[REDACTED_EMAIL]' },
  { regex: /\b(?:\+?91[-\s]?)?[6789]\d{9}\b/g, replacement: '[REDACTED_PHONE]' },
  { regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g, replacement: '[REDACTED_AADHAAR]' },
  { regex: /\b[A-Z]{5}[0-9]{4}[A-Z]{1}\b/g, replacement: '[REDACTED_PAN]' },
  { regex: /\b(?:\d[ -]*?){13,16}\b/g, replacement: '[REDACTED_CARD]' }
];

export const redactPII = (str) => {
  if (typeof str !== 'string') return str;
  let redacted = str;
  for (const { regex, replacement } of PII_PATTERNS) {
    redacted = redacted.replace(regex, replacement);
  }
  return redacted;
};

export const redactObject = (obj, depth = 0, seen = new WeakSet()) => {
  if (depth > 5) return '[Max Depth Exceeded]';

  if (obj === null || obj === undefined) return obj;

  if (typeof obj !== 'object') {
      if (typeof obj === 'string') return redactPII(obj);
      return obj;
  }

  if (seen.has(obj)) return '[Circular]';
  seen.add(obj);

  if (obj instanceof Date) return obj;
  if (obj instanceof Error) {
    const redactedError = new Error(redactPII(obj.message));
    redactedError.stack = redactPII(obj.stack);
    redactedError.name = obj.name;
    return redactedError;
  }

  if (Buffer.isBuffer(obj)) return '[Buffer]';

  const redacted = Array.isArray(obj) ? [] : {};
  const keys = Reflect.ownKeys(obj);

  for (const key of keys) {
    // Avoid redacting safe internal keys or functions
    if (typeof key === 'symbol') {
      redacted[key] = obj[key];
      continue;
    }

    const value = obj[key];

    if (typeof value === 'function') {
        redacted[key] = '[Function]';
    } else {
        redacted[key] = redactObject(value, depth + 1, seen);
    }
  }
  return redacted;
};

const redactFormat = winston.format((info) => {
  // We need to carefully redact the info object while preserving Winston symbols
  const redactedInfo = Object.assign({}, info);

  for (const key of Reflect.ownKeys(info)) {
      if (typeof key === 'symbol') {
          redactedInfo[key] = info[key];
      } else {
          redactedInfo[key] = redactObject(info[key]);
      }
  }

  return redactedInfo;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    redactFormat(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

export const setupRedactedLogger = () => {
    const originalConsoleLog = console.log;
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;
    const originalConsoleInfo = console.info;

    // Use util.format for formatting before redaction to handle complex objects
    console.log = (...args) => originalConsoleLog(redactPII(util.format(...args)));
    console.error = (...args) => originalConsoleError(redactPII(util.format(...args)));
    console.warn = (...args) => originalConsoleWarn(redactPII(util.format(...args)));
    console.info = (...args) => originalConsoleInfo(redactPII(util.format(...args)));
};

export default logger;
