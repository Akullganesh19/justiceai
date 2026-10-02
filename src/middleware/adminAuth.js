/* global process, Buffer */
import crypto from 'crypto';

export const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const envSecret = process.env.ADMIN_SECRET;

  if (process.env.NODE_ENV !== 'development' && !envSecret) {
    return res.status(500).json({ error: 'Server misconfiguration: ADMIN_SECRET not set in production' });
  }

  const expectedSecret = envSecret || 'default_dev_secret';

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid token format' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const tokenBuffer = Buffer.from(token, 'utf8');
    const expectedBuffer = Buffer.from(expectedSecret, 'utf8');

    if (tokenBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(tokenBuffer, expectedBuffer)) {
      return res.status(403).json({ error: 'Forbidden: Invalid admin token' });
    }

    next();
  } catch {
    return res.status(403).json({ error: 'Forbidden: Error validating token' });
  }
};
