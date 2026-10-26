import winston from 'winston';
import util from 'util';

// PII Regex Patterns
const PII_PATTERNS = [
  { name: 'Email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, replacement: '[REDACTED_EMAIL]' },
  { name: 'Indian Phone', regex: /(?:\+91|91)?[-\s]?[6-9]\d{9}/g, replacement: '[REDACTED_PHONE]' },
  { name: 'Aadhaar', regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g, replacement: '[REDACTED_AADHAAR]' },
  { name: 'PAN', regex: /[A-Z]{5}[0-9]{4}[A-Z]{1}/g, replacement: '[REDACTED_PAN]' },
  { name: 'Card', regex: /\b(?:\d[ -]*?){13,16}\b/g, replacement: '[REDACTED_CARD]' },
];

function redactString(str) {
  let redacted = str;
  for (const pattern of PII_PATTERNS) {
    redacted = redacted.replace(pattern.regex, pattern.replacement);
  }
  return redacted;
}

export const redactObject = winston.format((info) => {
  const sanitize = (obj, depth = 0, seen = new WeakSet()) => {
    if (depth > 5) return '[MAX_DEPTH_REACHED]';
    if (!obj || typeof obj !== 'object') {
      if (typeof obj === 'string') return redactString(obj);
      return obj;
    }

    if (seen.has(obj)) return '[CIRCULAR]';
    seen.add(obj);

    if (obj instanceof Date || obj instanceof Error) return obj;

    const sanitizedObj = Array.isArray(obj) ? [] : {};
    for (const key of Reflect.ownKeys(obj)) {
      sanitizedObj[key] = sanitize(obj[key], depth + 1, seen);
    }
    return sanitizedObj;
  };

  const sanitizedInfo = sanitize(info);

  // Need to preserve winston symbols
  for (const key of Reflect.ownKeys(info)) {
    if (typeof key === 'symbol') {
      sanitizedInfo[key] = info[key];
    }
  }

  return sanitizedInfo;
});

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    redactObject(),
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

export function setupRedactedLogger() {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;

  console.log = (...args) => {
    logger.info(util.format(...args));
  };
  console.error = (...args) => {
    logger.error(util.format(...args));
  };
  console.warn = (...args) => {
    logger.warn(util.format(...args));
  };
  console.info = (...args) => {
    logger.info(util.format(...args));
  };
}
