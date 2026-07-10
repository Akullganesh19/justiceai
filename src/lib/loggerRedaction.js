// src/lib/loggerRedaction.js

import util from 'util';

const PII_REGEXES = [
  // Email
  { regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/gi, replacement: '[REDACTED_EMAIL]' },
  // SSN (basic US SSN format)
  { regex: /\b\d{3}-\d{2}-\d{4}\b/g, replacement: '[REDACTED_SSN]' },
  // Credit Card (basic formats with/without dashes or spaces)
  { regex: /\b(?:\d[ -]*?){13,16}\b/g, replacement: '[REDACTED_CC]' }
];

const SENSITIVE_KEYS = new Set([
  'email', 'phone', 'ssn', 'address', 'dob', 'date_of_birth',
  'password', 'card_number', 'apikey', 'apikeys', 'authorization',
  'token', 'secret', 'bhashini_api_key', 'bhashini_user_id',
  'gemini_api_key', 'deepseek_api_key'
]);

function isBuiltInType(obj) {
  return obj instanceof Date ||
         obj instanceof RegExp ||
         obj instanceof Map ||
         obj instanceof Set ||
         (typeof Buffer !== 'undefined' && obj instanceof Buffer) ||
         obj instanceof String ||
         obj instanceof Number ||
         obj instanceof Boolean;
}

export function deepRedact(obj, seen = new WeakSet()) {
  if (obj === null || obj === undefined) return obj;

  if (typeof obj === 'string') {
    let redacted = obj;
    for (const { regex, replacement } of PII_REGEXES) {
      redacted = redacted.replace(regex, replacement);
    }
    return redacted;
  }

  if (typeof obj !== 'object' && typeof obj !== 'function') {
    return obj;
  }

  if (seen.has(obj)) {
    return '[Circular]';
  }

  if (isBuiltInType(obj)) {
    return obj;
  }

  seen.add(obj);

  if (obj instanceof Error) {
    const redactedErr = new Error(deepRedact(obj.message, seen));
    redactedErr.stack = deepRedact(obj.stack, seen);
    redactedErr.name = obj.name;
    // explicitly iterate over and copy any custom enumerable properties
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        redactedErr[key] = deepRedact(obj[key], seen);
      }
    }
    return redactedErr;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepRedact(item, seen));
  }

  const redactedObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      if (SENSITIVE_KEYS.has(key.toLowerCase())) {
        redactedObj[key] = '[REDACTED]';
      } else {
        redactedObj[key] = deepRedact(obj[key], seen);
      }
    }
  }

  // Preserve symbols if present
  const symbols = Object.getOwnPropertySymbols(obj);
  for (const sym of symbols) {
    redactedObj[sym] = obj[sym]; // Do not redact symbol values typically used for internal logic, or if we do, be careful
  }

  return redactedObj;
}
