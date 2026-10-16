import winston from 'winston';

/* global process */

export const redactString = (str) => {
  if (typeof str !== 'string') return str;
  let result = str;
  result = result.replace(/([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi, (match, name, domain) => {
    return `${name[0]}***@${domain}`;
  });
  result = result.replace(/(?:\+91[-\s]?)?[6789]\d{9}(?!\d)/g, '[REDACTED PHONE]');
  result = result.replace(/(?<!\d)(?:\d[ -]*?){13,19}(?!\d)/g, '[REDACTED CARD]');
  result = result.replace(/(?<!\d)\d{4}[-\s]?\d{4}[-\s]?\d{4}(?!\d)/g, '[REDACTED AADHAAR]');
  result = result.replace(/(?<![A-Z])[A-Z]{5}\d{4}[A-Z](?![A-Z])/gi, '[REDACTED PAN]');
  return result;
};

export const redactItem = (item, seen) => {
  if (typeof item === 'string') return redactString(item);
  if (item instanceof Error) {
    const redactedErr = new Error(redactString(item.message));
    redactedErr.stack = redactString(item.stack);
    redactedErr.name = item.name;
    for (const key of Object.keys(item)) {
      redactedErr[key] = redactItem(item[key], seen);
    }
    return redactedErr;
  }
  if (item instanceof Date || item instanceof RegExp || item instanceof Map || item instanceof Set) {
    return item;
  }
  if (item && typeof item === 'object') {
    if (seen.has(item)) return '[Circular]';
    seen.add(item);
    if (Array.isArray(item)) return item.map(i => redactItem(i, seen));

    const redactedObj = {};
    const keys = Reflect.ownKeys(item);
    for (const key of keys) {
        redactedObj[key] = redactItem(item[key], seen);
    }
    return redactedObj;
  }
  return item;
};

export const setupRedactedLogger = () => {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;

  const redactArgs = (args) => {
    const seen = new WeakSet();
    return args.map(arg => redactItem(arg, seen));
  };

  console.log = (...args) => originalLog.apply(console, redactArgs(args));
  console.error = (...args) => originalError.apply(console, redactArgs(args));
  console.warn = (...args) => originalWarn.apply(console, redactArgs(args));
  console.info = (...args) => originalInfo.apply(console, redactArgs(args));
};

const redactFormat = winston.format((info) => {
  const seen = new WeakSet();
  return redactItem(info, seen);
});

export const logger = winston.createLogger({
  level: typeof process !== 'undefined' && process.env ? process.env.LOG_LEVEL || 'info' : 'info',
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
