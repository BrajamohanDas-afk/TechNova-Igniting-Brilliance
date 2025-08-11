import express from 'express';
import { authController } from '../controllers/authController';
import { validateRequest } from '../middleware/validation';
import { body } from 'express-validator';

const router = express.Router();

// Validation rules
const registerValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('firstName').isString().isLength({ min: 1, max: 50 }).withMessage('First name required'),
  body('lastName').isString().isLength({ min: 1, max: 50 }).withMessage('Last name required'),
  body('phone').optional().isMobilePhone('any').withMessage('Invalid phone number'),
];

const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 1 }).withMessage('Password required'),
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
];

const resetPasswordValidation = [
  body('token').isString().isLength({ min: 1 }).withMessage('Reset token required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

const changePasswordValidation = [
  body('currentPassword').isLength({ min: 1 }).withMessage('Current password required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
];

// Routes
router.post(
  '/register',
  registerValidation,
  validateRequest,
  authController.register
);

router.post(
  '/login',
  loginValidation,
  validateRequest,
  authController.login
);

router.post(
  '/logout',
  authController.logout
);

router.post(
  '/forgot-password',
  forgotPasswordValidation,
  validateRequest,
  authController.forgotPassword
);

router.post(
  '/reset-password',
  resetPasswordValidation,
  validateRequest,
  authController.resetPassword
);

router.post(
  '/change-password',
  changePasswordValidation,
  validateRequest,
  authController.changePassword
);

router.post(
  '/refresh-token',
  authController.refreshToken
);

router.get(
  '/verify-email/:token',
  authController.verifyEmail
);

export { router as authRoutes };
