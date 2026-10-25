export function redactString(str) {
  if (typeof str !== 'string') return str;
  let redacted = str;

  // Credit Card (16 digits)
  redacted = redacted.replace(/(?<!\d)(\d{4})[\s-]?(\d{4})[\s-]?(\d{4})[\s-]?(\d{4})(?!\d)/g, (match, p1, p2, p3, p4) => {
    return `****-****-****-${p4}`;
  });

  // Aadhaar (12 digits)
  redacted = redacted.replace(/(?<!\d)(\d{4})[\s-]?(\d{4})[\s-]?(\d{4})(?!\d)/g, (match, p1, p2, p3) => {
    return `****-****-${p3}`;
  });

  // PAN Card
  redacted = redacted.replace(/\b([A-Z]{5})(\d{4})([A-Z])\b/gi, (match, p1, p2, p3) => {
    return `*****${p2}*`;
  });

  // Indian Phone numbers
  redacted = redacted.replace(/(?<!\d)(\+91[\s-]?)?([6-9]\d{2})[\s-]?(\d{3})[\s-]?(\d{4})(?!\d)/g, (match, p1, p2, p3, p4) => {
    const prefix = p1 ? p1.trim() + ' ' : '';
    return `${prefix}******${p4}`;
  });

  // Email
  redacted = redacted.replace(/\b([A-Za-z0-9._%+-]+)@([A-Za-z0-9.-]+\.[A-Za-z]{2,})\b/gi, (match, p1, p2) => {
    return `${p1[0]}***@${p2}`;
  });

  return redacted;
}

export function redactObject(obj, seen = new WeakSet(), depth = 0) {
  if (obj === null || obj === undefined) return obj;
  if (typeof obj === 'string') return redactString(obj);
  if (typeof obj !== 'object') return obj;

  if (depth > 5) return '[MAX_DEPTH]';

  if (seen.has(obj)) return '[CIRCULAR]';
  seen.add(obj);

  if (obj instanceof Date) return obj;
  if (obj instanceof RegExp) return obj;
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

  if (Array.isArray(obj)) {
    return obj.map(item => redactObject(item, seen, depth + 1));
  }

  const redacted = Object.create(Object.getPrototypeOf(obj) || null);

  Reflect.ownKeys(obj).forEach(key => {
    try {
      redacted[key] = redactObject(obj[key], seen, depth + 1);
    } catch (e) {}
  });

  return redacted;
}

export function setupRedactedLogger() {
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;

  console.log = (...args) => originalLog(...args.map(arg => redactObject(arg)));
  console.error = (...args) => originalError(...args.map(arg => redactObject(arg)));
  console.warn = (...args) => originalWarn(...args.map(arg => redactObject(arg)));
  console.info = (...args) => originalInfo(...args.map(arg => redactObject(arg)));
}
