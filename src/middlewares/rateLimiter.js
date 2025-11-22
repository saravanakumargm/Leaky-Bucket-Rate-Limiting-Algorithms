import { LeakyBucket } from "../utils/leakyBucket.js";
import { rateLimitConfigs } from "../config.js";

const rateLimiter = new LeakyBucket({
    capacity: rateLimitConfigs.CAPACITY,
    leakRate: rateLimitConfigs.LEAK_RATE,
    interval: rateLimitConfigs.INTERVAL
});

function rateLimit(req, res, next){
    const userIp = req.ip || req.connection.remoteConnection;

    const result = rateLimiter.isAllowed(userIp);

    if(!result.allowed){
        return res.status(429).json({
            error: 'Too Many Request',
            message: 'Rate limit exceeded. Try again later.',
            retryAfter: Math.ceil(1 / rateLimiter.leakRate)
        });    
    }
    
    res.set('X-RateLimit-Limit', rateLimiter.capacity);
    res.set('X-RateLimit-Remaining', result.remaining);

    next();
}

export default rateLimit;