import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

const rateLimiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(100, '60 s')
});

export default rateLimiter;
