import rateLimiter from '../config/upstash.js';

export default async function rateLimiterMiddleware(req, res, next) {
  try {
    const { success } = await rateLimiter.limit(req.ip);
    if (!success) {
      return res.status(429).json({ error: 'Rate limit exceeded, try again later' });
    }
    next();
  } catch (error) {
    console.error('🚫 Error applying rate limit:', error);
    res.status(500).json({ error: 'Failed to apply rate limit' });
  }
}
