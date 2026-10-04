/* global process, Buffer */
import crypto from 'crypto';

export const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const expectedSecret = process.env.ADMIN_SECRET;

  if (!expectedSecret) {
    if (process.env.NODE_ENV !== 'development') {
      return res.status(500).json({ error: 'Server configuration error' });
    }
    // Fallback in development for testing if no secret is set
    return next();
  }

  try {
    const providedSecret = Buffer.from(authHeader);
    const expectedSecretBuffer = Buffer.from(`Bearer ${expectedSecret}`);

    if (providedSecret.length !== expectedSecretBuffer.length ||
        !crypto.timingSafeEqual(providedSecret, expectedSecretBuffer)) {
      return res.status(403).json({ error: 'Invalid credentials' });
    }

    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid authentication format' });
  }
};
