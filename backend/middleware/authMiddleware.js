import jwt from 'jsonwebtoken';
import { findUserById } from '../utils/getUserModel.js';

/**
 * Protect middleware: Verifies JWT token in Authorization header (Bearer <token>)
 * Attaches the authenticated user object and role to `req.user` and `req.userRole`.
 */
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecretkey12345');

      // Fetch user from database
      const { user, role } = await findUserById(decoded.id);

      if (!user) {
        return res.status(401).json({ message: 'User not found. Invalid or revoked token.' });
      }

      // Strip password from request user object
      const userObj = user.toObject ? user.toObject() : { ...user };
      delete userObj.password;

      req.user = userObj;
      req.userRole = role || user.role;

      return next();
    } catch (error) {
      console.error('JWT Auth Error:', error.message);
      return res.status(401).json({ message: 'Not authorized: token is invalid or expired.' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized: no token provided.' });
  }
};

/**
 * Role-based authorization middleware
 * Example: router.get('/admin-only', protect, authorize('admin'), handler);
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    const userRole = req.userRole || req.user?.role;
    if (!req.user || !roles.includes(userRole)) {
      return res.status(403).json({
        message: `Role '${userRole}' is not authorized to access this resource.`
      });
    }
    next();
  };
};
