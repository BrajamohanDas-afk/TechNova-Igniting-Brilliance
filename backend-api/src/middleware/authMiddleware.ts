import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
      return;
    }

    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid token. User not found.',
      });
      return;
    }

    if (!user.isActive) {
      res.status(401).json({
        success: false,
        message: 'Account is deactivated.',
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    logger.error('Auth middleware error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: 'Invalid token.',
      });
      return;
    }

    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: 'Token expired.',
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export const adminMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    if (req.user.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'Admin access required.',
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Admin middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};

export const moderatorMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Authentication required.',
      });
      return;
    }

    if (!['admin', 'moderator'].includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Moderator or admin access required.',
      });
      return;
    }

    next();
  } catch (error) {
    logger.error('Moderator middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error.',
    });
  }
};
