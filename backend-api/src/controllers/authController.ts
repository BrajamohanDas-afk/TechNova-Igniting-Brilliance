import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User, IUser } from '../models/User';
import { logger } from '../utils/logger';

interface AuthRequest extends Request {
  user?: IUser;
}

export const authController = {
  // Register a new user
  register: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        res.status(400).json({
          success: false,
          message: 'User with this email already exists',
        });
        return;
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate email verification token
      const emailVerificationToken = crypto.randomBytes(32).toString('hex');

      // Create user
      const user = new User({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        phone,
        emailVerificationToken,
      });

      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      logger.info('User registered successfully', { userId: user._id, email });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
          },
          token,
        },
      });
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // Login user
  login: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email }).select('+password');
      if (!user) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      // Check if user is active
      if (!user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Account is deactivated',
        });
        return;
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        res.status(401).json({
          success: false,
          message: 'Invalid email or password',
        });
        return;
      }

      // Update last login
      user.lastLogin = new Date();
      await user.save();

      // Generate JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      logger.info('User logged in successfully', { userId: user._id, email });

      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            isEmailVerified: user.isEmailVerified,
            lastLogin: user.lastLogin,
          },
          token,
        },
      });
    } catch (error) {
      logger.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // Logout user
  logout: async (req: Request, res: Response): Promise<void> => {
    try {
      // In a real implementation, you might want to blacklist the token
      // For now, we'll just return a success message
      res.json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      logger.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // Forgot password
  forgotPassword: async (req: Request, res: Response): Promise<void> => {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        // Don't reveal if email exists or not
        res.json({
          success: true,
          message: 'If an account with this email exists, a password reset link has been sent',
        });
        return;
      }

      // Generate reset token
      const resetToken = crypto.randomBytes(32).toString('hex');
      user.passwordResetToken = resetToken;
      user.passwordResetExpires = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

      await user.save();

      // In a real implementation, send email with reset token
      logger.info('Password reset requested', { userId: user._id, email });

      res.json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent',
        // In development, return the token (remove in production)
        ...(process.env.NODE_ENV === 'development' && { resetToken }),
      });
    } catch (error) {
      logger.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // Reset password
  resetPassword: async (req: Request, res: Response): Promise<void> => {
    try {
      const { token, password } = req.body;

      const user = await User.findOne({
        passwordResetToken: token,
        passwordResetExpires: { $gt: new Date() },
      });

      if (!user) {
        res.status(400).json({
          success: false,
          message: 'Invalid or expired reset token',
        });
        return;
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Update user
      user.password = hashedPassword;
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;

      await user.save();

      logger.info('Password reset successfully', { userId: user._id });

      res.json({
        success: true,
        message: 'Password reset successful',
      });
    } catch (error) {
      logger.error('Reset password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // Change password
  changePassword: async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user?._id;

      const user = await User.findById(userId).select('+password');
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found',
        });
        return;
      }

      // Verify current password
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        res.status(400).json({
          success: false,
          message: 'Current password is incorrect',
        });
        return;
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update password
      user.password = hashedPassword;
      await user.save();

      logger.info('Password changed successfully', { userId: user._id });

      res.json({
        success: true,
        message: 'Password changed successfully',
      });
    } catch (error) {
      logger.error('Change password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },

  // Refresh token
  refreshToken: async (req: Request, res: Response): Promise<void> => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');

      if (!token) {
        res.status(401).json({
          success: false,
          message: 'Access denied. No token provided.',
        });
        return;
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
      const user = await User.findById(decoded.userId);

      if (!user || !user.isActive) {
        res.status(401).json({
          success: false,
          message: 'Invalid token or user not found.',
        });
        return;
      }

      // Generate new token
      const newToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '24h' }
      );

      res.json({
        success: true,
        data: {
          token: newToken,
        },
      });
    } catch (error) {
      logger.error('Refresh token error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid token',
      });
    }
  },

  // Verify email
  verifyEmail: async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.params;

      const user = await User.findOne({ emailVerificationToken: token });
      if (!user) {
        res.status(400).json({
          success: false,
          message: 'Invalid verification token',
        });
        return;
      }

      user.isEmailVerified = true;
      user.emailVerificationToken = undefined;
      await user.save();

      logger.info('Email verified successfully', { userId: user._id });

      res.json({
        success: true,
        message: 'Email verified successfully',
      });
    } catch (error) {
      logger.error('Email verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
      });
    }
  },
};
