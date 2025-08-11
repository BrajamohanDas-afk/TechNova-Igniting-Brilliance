import express from 'express';
import { reportController } from '../controllers/reportController';
import { authMiddleware } from '../middleware/authMiddleware';
import { validateRequest } from '../middleware/validation';
import { body, param, query } from 'express-validator';

const router = express.Router();

// Validation rules
const createReportValidation = [
  body('location.latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('location.longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('location.address').isString().isLength({ min: 1, max: 500 }).withMessage('Address required'),
  body('violationType').isIn(['size', 'location', 'content', 'structural']).withMessage('Invalid violation type'),
  body('description').optional().isString().isLength({ max: 1000 }),
  body('confidence').optional().isFloat({ min: 0, max: 1 }),
];

const updateStatusValidation = [
  param('id').isMongoId().withMessage('Invalid report ID'),
  body('status').isIn(['pending', 'verified', 'resolved', 'dismissed']).withMessage('Invalid status'),
  body('adminNotes').optional().isString().isLength({ max: 1000 }),
];

const getReportsValidation = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  query('status').optional().isIn(['pending', 'verified', 'resolved', 'dismissed']),
  query('violationType').optional().isIn(['size', 'location', 'content', 'structural']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601(),
];

// Routes
router.post(
  '/',
  authMiddleware,
  createReportValidation,
  validateRequest,
  reportController.createReport
);

router.get(
  '/',
  authMiddleware,
  getReportsValidation,
  validateRequest,
  reportController.getReports
);

router.get(
  '/:id',
  authMiddleware,
  param('id').isMongoId().withMessage('Invalid report ID'),
  validateRequest,
  reportController.getReportById
);

router.put(
  '/:id/status',
  authMiddleware,
  updateStatusValidation,
  validateRequest,
  reportController.updateReportStatus
);

router.delete(
  '/:id',
  authMiddleware,
  param('id').isMongoId().withMessage('Invalid report ID'),
  validateRequest,
  reportController.deleteReport
);

router.get(
  '/analytics/stats',
  authMiddleware,
  reportController.getReportStats
);

router.get(
  '/analytics/heatmap',
  authMiddleware,
  query('bounds').optional().isString(),
  validateRequest,
  reportController.getHeatmapData
);

export { router as reportRoutes };
