import winston from 'winston';
import util from 'util';

const PII_PATTERNS = [
  { name: 'email', regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g },
  { name: 'phone_in', regex: /(?:\+91|91)?\s?[6-9]\d{9}/g },
  { name: 'aadhaar', regex: /\b\d{4}\s?\d{4}\s?\d{4}\b/g },
  { name: 'pan', regex: /\b[A-Z]{5}\d{4}[A-Z]\b/g },
  { name: 'card', regex: /\b(?:\d[ -]*?){13,16}\b/g }
];

function redactString(str) {
  if (typeof str !== 'string') return str;
  let redacted = str;
  for (const { regex } of PII_PATTERNS) {
    redacted = redacted.replace(regex, '[REDACTED]');
  }
  return redacted;
}

export function redactObject(obj, seen = new WeakSet(), depth = 0) {
  if (depth > 5) return '[Max Depth Exceeded]';

  if (obj === null || typeof obj !== 'object') {
    if (typeof obj === 'string') return redactString(obj);
    return obj;
  }

  if (seen.has(obj)) {
    return '[Circular]';
  }
  seen.add(obj);

  if (obj instanceof Date) {
    return obj;
  }

  if (obj instanceof Error) {
    const redactedErr = new Error(redactString(obj.message));
    redactedErr.stack = redactString(obj.stack || '');
    redactedErr.name = obj.name;
    Reflect.ownKeys(obj).forEach(key => {
      if (key !== 'message' && key !== 'stack' && key !== 'name') {
         redactedErr[key] = redactObject(obj[key], seen, depth + 1);
      }
    });
    return redactedErr;
  }

  const redactedObj = Array.isArray(obj) ? [] : {};
  Reflect.ownKeys(obj).forEach(key => {
    const val = obj[key];
    redactedObj[key] = redactObject(val, seen, depth + 1);
  });

  return redactedObj;
}

export const redactFormat = winston.format((info) => {
  return redactObject(info, new WeakSet(), 0);
});

export function setupRedactedLogger() {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;

  const createRedacted = (originalMethod) => {
    return (...args) => {
      const formattedArgs = args.map(arg => {
        if (typeof arg === 'string') return redactString(arg);
        if (typeof arg === 'object') {
          const redacted = redactObject(arg, new WeakSet(), 0);
          return util.inspect(redacted, { depth: 5, maxArrayLength: 100 });
        }
        return arg;
      });
      originalMethod(...formattedArgs);
    };
  };

  console.log = createRedacted(originalLog);
  console.error = createRedacted(originalError);
  console.warn = createRedacted(originalWarn);
  console.info = createRedacted(originalInfo);
}
