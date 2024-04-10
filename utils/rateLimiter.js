import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 10 * 1000, // 10 seconds
  max: 50, // Limit each IP to 50 requests per windowMs
  message: 'Too many requests from this IP, please try again later',
});

export default limiter;