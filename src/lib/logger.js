import winston from 'winston';
import util from 'util';

function maskString(str) {
  if (typeof str !== 'string') return str;
  let masked = str;

  // Email: j***@gmail.com
  masked = masked.replace(/([a-zA-Z0-9._%+-]+)(@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g, (match, p1, p2) => {
    return p1.charAt(0) + '***' + p2;
  });

  // Card number: 16 digits
  masked = masked.replace(/\b(\d{4})[\s-]?(\d{4})[\s-]?(\d{4})[\s-]?(\d{4})\b/g, '****-****-****-$4');

  // Aadhaar: 12 digits
  masked = masked.replace(/\b(\d{4})[\s-]?(\d{4})[\s-]?(\d{4})\b/g, '****-****-$3');

  // PAN: 5 letters, 4 digits, 1 letter
  masked = masked.replace(/\b([a-zA-Z]{5})([0-9]{4})([a-zA-Z])\b/g, '***$2***');

  // Indian Phone
  masked = masked.replace(/(\+91[\s-]?|0)?([6-9]\d{1})(\d{6})(\d{2})\b/g, (match, prefix, start, middle, end) => {
    return (prefix || '') + start + '******' + end;
  });

  return masked;
}

function redactObject(obj, seen = new WeakSet(), depth = 0) {
  if (depth > 10) return '[MAX DEPTH EXCEEDED]';
  if (obj === null || typeof obj !== 'object') {
    if (typeof obj === 'string') return maskString(obj);
    return obj;
  }

  if (seen.has(obj)) return '[CIRCULAR]';
  seen.add(obj);

  let redacted;
  if (obj instanceof Error) {
    redacted = new Error(maskString(obj.message));
    redacted.stack = maskString(obj.stack);
    redacted.name = obj.name;
    for (const key of Object.getOwnPropertyNames(obj)) {
      if (key !== 'message' && key !== 'stack' && key !== 'name') {
        try {
          redacted[key] = redactObject(obj[key], seen, depth + 1);
        } catch(e) {}
      }
    }
    return redacted;
  }

  if (obj instanceof Date) return obj;

  redacted = Array.isArray(obj) ? [] : {};

  for (const key of Reflect.ownKeys(obj)) {
    try {
      redacted[key] = redactObject(obj[key], seen, depth + 1);
    } catch (e) {
      redacted[key] = '[UNABLE TO REDACT]';
    }
  }

  return redacted;
}

const redactFormat = winston.format((info) => {
  const infoClone = Object.assign({}, info);
  const redacted = redactObject(infoClone);
  // Ensure Winston's internal symbols are preserved
  for (const key of Reflect.ownKeys(info)) {
    if (typeof key === 'symbol') {
      redacted[key] = info[key];
    }
  }
  return redacted;
});

export { redactObject, setupRedactedLogger };

const setupRedactedLogger = () => {
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

  // Override console methods
  const safeFormat = (obj) => {
    if (typeof obj === 'string') return obj;
    return util.inspect(obj, { depth: 5, maxArrayLength: 100 });
  };

  console.log = (...args) => {
    logger.info(args.map(a => safeFormat(a)).join(' '));
  };
  console.warn = (...args) => {
    logger.warn(args.map(a => safeFormat(a)).join(' '));
  };
  console.error = (...args) => {
    logger.error(args.map(a => safeFormat(a)).join(' '));
  };
  console.info = (...args) => {
    logger.info(args.map(a => safeFormat(a)).join(' '));
  };

  return logger;
};
