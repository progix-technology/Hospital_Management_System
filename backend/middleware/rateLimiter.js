import rateLimit from 'express-rate-limit';

/**
 * Global rate limiter: applied to all incoming API requests across the platform.
 * Allows 500 requests per 15 minutes per IP.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per `window`
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP. Please try again after 15 minutes.'
  }
});

/**
 * Auth rate limiter: applied to login, register, and password reset endpoints.
 * Protects against brute-force attacks and credential stuffing.
 * Allows 20 attempts per 15 minutes per IP.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 attempts per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login or registration attempts. Please wait 15 minutes before trying again.'
  }
});

/**
 * Contact & Inquiry rate limiter: protects SMTP mailer from spam and flooding.
 * Allows 10 inquiries per 15 minutes per IP.
 */
export const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 messages per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'You have sent several messages recently. Please wait a few minutes before submitting another inquiry.'
  }
});

/**
 * Appointment booking limiter: prevents bot automation from locking all appointment slots.
 * Allows 30 appointment operations per 15 minutes per IP.
 */
export const appointmentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 appointment operations per 15 mins
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many appointment requests from this IP. Please try again after 15 minutes.'
  }
});
