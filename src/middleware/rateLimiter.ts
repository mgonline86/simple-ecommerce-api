import { rateLimit } from 'express-rate-limit'

// Rate limit middleware
const rateLimiter = rateLimit({
    windowMs: 60 * 1000,  // 1 minute
    max: 30, // Limit each IP to 30 requests per 1 minute
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    }
})

export default rateLimiter;