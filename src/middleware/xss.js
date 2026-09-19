export const xssMiddleware = (req, res, next) => {
  const escapeHtml = (str) => {
    if (!str) return str;
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const sanitize = (obj) => {
    if (typeof obj === 'string') return escapeHtml(obj);
    if (Array.isArray(obj)) return obj.map(sanitize);
    if (obj && typeof obj === 'object' && !Object.isFrozen(obj)) {
      const sanitized = {};
      for (const key in obj) {
        sanitized[key] = sanitize(obj[key]);
      }
      return sanitized;
    }
    return obj;
  };

  // Sanitize body and query (req.params is read-only in Express 5)
  if (req.body) req.body = sanitize(req.body);
  if (req.query) {
    // For query params, we need to handle them differently
    Object.keys(req.query).forEach(key => {
      req.query[key] = sanitize(req.query[key]);
    });
  }
  next();
};
